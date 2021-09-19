export enum SupportedNetworks {
  Mainnet = 1,
  Ropsten = 3,
  Kovan = 42,
  Arbitrum = 42161,
}

export const networkIdToTxUrl = {
  [SupportedNetworks.Mainnet]: 'https://etherscan.io/tx',
  [SupportedNetworks.Ropsten]: 'https://ropsten.etherscan.io/tx',
  [SupportedNetworks.Kovan]: 'https://kovan.etherscan.io/tx',
  [SupportedNetworks.Arbitrum]: 'https://arbiscan.io/tx',
}

export const networkIdToAddressUrl = {
  [SupportedNetworks.Mainnet]: 'https://etherscan.io/address',
  [SupportedNetworks.Kovan]: 'https://kovan.etherscan.io/address',
  [SupportedNetworks.Ropsten]: 'https://ropsten.etherscan.io/address',
  [SupportedNetworks.Ropsten]: 'https://arbiscan.io/address',
}
