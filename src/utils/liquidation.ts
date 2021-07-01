import BigNumber from 'bignumber.js'

import Web3 from 'web3'
import { SubgraphVault, SubgraphOToken, ChainlinkRound } from '../types'
import { SupportedNetworks, getETHAggregators, addresses } from '../constants'
import { toTokenAmount } from './math'

const aggregatorAbi = require('../constants/abis/chainlinkAggregator.json')
const controllerAbi = require('../constants/abis/controller.json')

export function getMostProfitableRoundId(otoken: SubgraphOToken, liqPrice: BigNumber, roundData: ChainlinkRound[]) {
  const round = roundData.find(round => {
    const historicalPrice = toTokenAmount(round.value, 8)
    return otoken.isPut ? historicalPrice.lt(liqPrice) : historicalPrice.gt(liqPrice)
  })
  return { isLiquidatable: round !== undefined, round }
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
