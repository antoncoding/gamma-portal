export enum SupportedNetworks {
  Mainnet = 1,
  Rinkeby = 4
}

type Token = {
  address: string,
  name: string,
  symbol: string,
  decimals: 6
}

type configType = {
  [key in SupportedNetworks]: {controller: string, tokens:Token[]}
}

const config: configType = {
  '1' : {
    controller: '',
    tokens: [
      {
        name: 'USDC',
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        symbol: 'USDC',
        decimals: 6
      }
    ]
  },
  '4': {
    controller: '0x5ca72b05416f728c877942078454d458e6733421',
    tokens: [
      {
        name: 'USDC',
        address: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b',
        symbol: 'USDC',
        decimals: 6
      }
    ]
  }
}

export default config