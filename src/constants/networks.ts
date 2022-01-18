import Ethereum from '../imgs/Ethereum.png'
import AVAX from '../imgs/WAVAX.webp'
import Arbitrum from '../imgs/Arbitrum.svg'

export enum SupportedNetworks {
  Mainnet = 1,
  Ropsten = 3,
  Kovan = 42,
  Avalanche = 43114,
  Arbitrum = 42161,
}

export const networkIdToTxUrl = {
  [SupportedNetworks.Mainnet]: 'https://etherscan.io/tx',
  [SupportedNetworks.Ropsten]: 'https://ropsten.etherscan.io/tx',
  [SupportedNetworks.Kovan]: 'https://kovan.etherscan.io/tx',
  [SupportedNetworks.Avalanche]: 'https://snowtrace.io/tx',
  [SupportedNetworks.Arbitrum]: 'https://arbiscan.io/tx',
}

export const networkIdToAddressUrl = {
  [SupportedNetworks.Mainnet]: 'https://etherscan.io/address',
  [SupportedNetworks.Kovan]: 'https://kovan.etherscan.io/address',
  [SupportedNetworks.Ropsten]: 'https://ropsten.etherscan.io/address',
  [SupportedNetworks.Avalanche]: 'https://snowtrace.io/address',
  [SupportedNetworks.Ropsten]: 'https://arbiscan.io/address',
}

export const networkToLogo: { [key in SupportedNetworks]: string } = {
  [SupportedNetworks.Mainnet]: Ethereum,
  [SupportedNetworks.Kovan]: Ethereum,
  [SupportedNetworks.Ropsten]: Ethereum,
  [SupportedNetworks.Avalanche]: AVAX,
  [SupportedNetworks.Arbitrum]: Arbitrum,
}
