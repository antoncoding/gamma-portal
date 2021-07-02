import BigNumber from 'bignumber.js'

import Web3 from 'web3'
import { SubgraphVault, SubgraphOToken, ChainlinkRound } from '../types'
import { SupportedNetworks, getETHAggregators, addresses, AUCTION_TIME } from '../constants'
import { toTokenAmount } from './math'

const aggregatorAbi = require('../constants/abis/chainlinkAggregator.json')
const controllerAbi = require('../constants/abis/controller.json')

export function getMostProfitableRoundId(
  otoken: SubgraphOToken,
  vaultCollateral: string,
  vaultShort: string,
  liqPrice: BigNumber,
  roundData: ChainlinkRound[],
) {
  const roundsUnderwater = roundData.filter(round => {
    const historicalPrice = toTokenAmount(round.value, 8)
    return otoken.isPut ? historicalPrice.lt(liqPrice) : historicalPrice.gt(liqPrice)
  })
  const isLiquidatable = roundsUnderwater.length > 0
  if (!isLiquidatable) return { isLiquidatable }

  const round = roundsUnderwater
    .map(round => {
      const price = calculateDebtPrice(otoken, vaultCollateral, vaultShort, round)
      return { ...round, price }
    })
    .sort((a, b) => (a.price.gt(b.price) ? -1 : 1))[0] // sort high to low

  return { isLiquidatable, round }
}

function calculateDebtPrice(
  otoken: SubgraphOToken,
  vaultCollateral: string,
  vaultShort: string,
  roundData: ChainlinkRound,
): BigNumber {
  const otokenAmount = toTokenAmount(vaultShort, 8)
  const endingPrice = new BigNumber(vaultCollateral).div(otokenAmount)

  const auctionElapsedTime = Math.floor(Date.now() / 1000) - roundData.unixTimestamp
  if (auctionElapsedTime > AUCTION_TIME) return endingPrice

  const roundSpotPrice = new BigNumber(roundData.value)
  const startPrice = getCashValueInCollateral(otoken, roundSpotPrice)
  const price = endingPrice.minus(startPrice).times(auctionElapsedTime).div(AUCTION_TIME)

  if (price > endingPrice) return endingPrice
  return price
}

function getCashValueInCollateral(otoken: SubgraphOToken, spot: BigNumber) {
  const cashValueInStrike = getCashValue(otoken, spot)
  if (otoken.isPut) return cashValueInStrike
  return cashValueInStrike.div(spot)
}

/**
 * get cash value, denominated in strike
 */
function getCashValue(otoken: SubgraphOToken, spot: BigNumber) {
  const strikePrice = new BigNumber(otoken.strikePrice)
  if (otoken.isPut && strikePrice.gt(spot)) return strikePrice.minus(spot)
  if (!otoken.isPut && strikePrice.lt(spot)) return spot.minus(strikePrice)
  return new BigNumber(0)
}

export async function getLastRoundId(web3: Web3, networkId: SupportedNetworks) {
  const aggregatorAddress = getETHAggregators(networkId)
  if (aggregatorAddress === '') return { latestAnswer: '0', latestRoundId: '0' }
  const aggregator = new web3.eth.Contract(aggregatorAbi, aggregatorAddress)
  const latestRoundId = (await aggregator.methods.latestRound().call()) as string
  const latestAnswer = (await aggregator.methods.latestAnswer().call()) as string
  return { latestAnswer, latestRoundId }
}

export async function dumbCheckIsLiquidatable(
  web3: Web3,
  networkId: SupportedNetworks,
  vault: SubgraphVault,
  roundId,
): Promise<{
  isLiquidatable: boolean
  price: string
}> {
  const defaultResult = { isLiquidatable: false, price: '0' }
  if (roundId === '0') return defaultResult
  const address = addresses[networkId].controller
  const controller = new web3.eth.Contract(controllerAbi, address)
  try {
    const result = await controller.methods.isLiquidatable(vault.owner.id, vault.vaultId, roundId).call()
    const isLiquidatable = result[0]
    const price = result[1]
    return { isLiquidatable, price }
  } catch (error) {
    console.log(`error`, error)
    return defaultResult
  }
}
