import {SupportedNetworks} from './networks'
import {Token} from '../types/index'

type TokensTyps = {
  [key in SupportedNetworks]: Token[]
}

export const tokens: TokensTyps = {
  '1' : [
    {
      name: 'USDC',
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      decimals: 6
    }
  ],
  '4' : [
    {
      name: 'USDC',
      address: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b',
      symbol: 'USDC',
      decimals: 6
    },
    {
      name: 'Wrapped Ether',
      address: '0xc778417e063141139fce010982780140aa0cd5ab',
      symbol: 'WETH',
      decimals: 18
    }
  ]
}

type GammaAddress = {
  [key in SupportedNetworks]: {controller: string, factory: string, addressBook: string}
}

export const addressese: GammaAddress = {
  '1' : {
    controller: '',
    factory: '',
    addressBook: ''
  },
  '4': {
    controller: '0x5ca72b05416f728c877942078454d458e6733421',
    factory: '0x17fFbe9476dDcC79f4574E0c89CE537fD65A8cAe',
    addressBook: '0x7630e7dE53E3d1f298f653d27fcF3710c602331C'
  }
}

export const ZERO_ADDR = '0x0000000000000000000000000000000000000000'