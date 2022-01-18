import Web3 from 'web3'
import ENS from 'ethereum-ens'
import { SubgraphOToken, SubgraphOracleAsset } from '../types'
import {
  isSupportedByMetaMask,
  networkIdToExplorer,
  networkIdToName,
  networkToProvider,
  networkToTokenConfig,
  SupportedNetworks,
  WAITINT_PERIOD,
} from '../constants'
import { toTokenAmount } from './math'
import BigNumber from 'bignumber.js'

// ENS
export const resolveENS = async (ensName: string, networkId: number) => {
  const web3 = new Web3(networkToProvider[networkId])
  const ens = new ENS(web3)
  const address = await ens.resolver(ensName).addr()
  return address.toLowerCase()
}

export const isEOA = async (address: string, networkId: number): Promise<Boolean> => {
  const web3 = new Web3(networkToProvider[networkId])
  return (await web3.eth.getCode(address)) === '0x'
}

/**
 * Sorting function
 * @param a
 * @param b
 */
export const sortByExpiryThanStrike = (a: SubgraphOToken, b: SubgraphOToken) => {
  if (Number(a.expiryTimestamp) > Number(b.expiryTimestamp)) return 1
  else if (Number(a.expiryTimestamp) > Number(b.expiryTimestamp)) return -1
  else if (Number(a.strikePrice) > Number(b.strikePrice)) return 1
  else return -1
}

export const isExpired = (token: SubgraphOToken) => {
  return Number(token.expiryTimestamp) < Date.now() / 1000
}

export const isSettlementAllowed = (token: SubgraphOToken, allOracleData: SubgraphOracleAsset[]) => {
  const pricesForUnderlying = allOracleData.find(data => data.asset.id === token.underlyingAsset.id)
  if (!pricesForUnderlying) return false
  const hasPriceForExpiry = pricesForUnderlying.prices.find(priceData => priceData.expiry === token.expiryTimestamp)
  if (!hasPriceForExpiry) return false
  return Number(token.expiryTimestamp) + WAITINT_PERIOD < Date.now() / 1000
}

export const isITM = (token: SubgraphOToken, expiryPrice: string) => {
  return (
    (token.isPut && Number(expiryPrice) < Number(token.strikePrice)) ||
    (!token.isPut && Number(expiryPrice) > Number(token.strikePrice))
  )
}

export const getExpiryPayout = (token: SubgraphOToken, amount: string, expiryPrice: string) => {
  if (token.isPut) {
    return BigNumber.max(
      toTokenAmount(new BigNumber(token.strikePrice).minus(new BigNumber(expiryPrice)), 8).times(
        toTokenAmount(amount, 8),
      ),
      0,
    )
  } else {
    return BigNumber.max(
      toTokenAmount(new BigNumber(expiryPrice).minus(token.strikePrice), 8).times(toTokenAmount(amount, 8)),
      0,
    ).div(toTokenAmount(token.strikePrice, 8))
  }
}

export function toUTCDateString(expiry: number): string {
  const expiryDate = new Date(expiry * 1000)
  return expiryDate.toUTCString().split(' ').slice(1, 4).join(' ')
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function simplifyOTokenSymbol(symbol: string) {
  // oWETHUSDC/WETH-15JAN21-680C
  const [assets, remaining] = symbol.split('/')
  const [, date, strike] = remaining.split('-')
  // return oWETH--15JAN21-680C
  return `${assets.replace('USDC', '')}-${date}-${strike}`
}

export async function switchNetwork(provider: any, networkId: SupportedNetworks): Promise<boolean> {
  if (!provider.request) return false
  if (isSupportedByMetaMask(networkId)) {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: `0x${networkId.toString(16)}`,
        },
      ],
    })
    return true
  } else {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${networkId.toString(16)}`,
          chainName: networkIdToName[networkId],
          nativeCurrency: networkToTokenConfig(networkId),
          rpcUrls: [networkToProvider[networkId]],
          blockExplorerUrls: [networkIdToExplorer[networkId]],
        },
      ],
    })
    return true
  }
}
