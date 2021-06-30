import { SubgraphVault } from '../types'
import Web3 from 'web3'
import { SupportedNetworks, getETHAggregators, addresses } from '../constants'
const aggregatorAbi = require('../constants/abis/chainlinkAggregator.json')
const controllerAbi = require('../constants/abis/controller.json')

export async function getLastRoundId(web3: Web3, networkId: SupportedNetworks): Promise<string> {
  const aggregatorAddress = getETHAggregators(networkId)
  const aggregator = new web3.eth.Contract(aggregatorAbi, aggregatorAddress)
  const roundId = await aggregator.methods.latestRound().call()
  console.log(`roundId`, roundId)
  return roundId
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
