import Ethereum from '../imgs/Ethereum.png'
import AVAX from '../imgs/WAVAX.webp'
import Arbitrum from '../imgs/Arbitrum.svg'
import Matic from '../imgs/matic.svg'

export enum SupportedNetworks {
  Mainnet = 1,
  Matic = 137,
  Avalanche = 43114,
  Arbitrum = 42161,
}

export const networkIdToExplorer = {
  [SupportedNetworks.Mainnet]: 'https://etherscan.io',
  [SupportedNetworks.Avalanche]: 'https://snowtrace.io',
  [SupportedNetworks.Arbitrum]: 'https://arbiscan.io',
  [SupportedNetworks.Matic]: 'https://polygonscan.com',
}

export const networkToLogo: { [key in SupportedNetworks]: string } = {
  [SupportedNetworks.Mainnet]: Ethereum,
  [SupportedNetworks.Avalanche]: AVAX,
  [SupportedNetworks.Arbitrum]: Arbitrum,
  [SupportedNetworks.Matic]: Matic,
}

export const isMainnet: { [key in SupportedNetworks]: boolean } = {
  [SupportedNetworks.Mainnet]: true,
  [SupportedNetworks.Avalanche]: true,
  [SupportedNetworks.Arbitrum]: true,
  [SupportedNetworks.Matic]: true,
}

export const isSupportedByMetaMask = (network: SupportedNetworks) => {
  if (network === SupportedNetworks.Mainnet) return true
  return false
}

export const networkToTokenConfig = (networkId: SupportedNetworks) => {
  if (isSupportedByMetaMask(networkId)) return undefined
  if (networkId === SupportedNetworks.Avalanche)
    return {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
    }
  if (networkId === SupportedNetworks.Arbitrum)
    return {
      name: 'Arbitrum ETH',
      symbol: 'AETH',
      decimals: 18,
    }
  if (networkId === SupportedNetworks.Matic)
    return {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    }
}
