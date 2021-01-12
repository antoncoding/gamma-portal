import { SupportedNetworks } from './networks'
import { Token } from '../types/index'

type TokensTyps = {
  [key in SupportedNetworks]: Token[]
}

export const ZERO_ADDR = '0x0000000000000000000000000000000000000000'

export const emptyToken: Token = {
  name: 'No Token',
  id: ZERO_ADDR,
  symbol: 'N/A',
  decimals: 18,
}

export const tokens: TokensTyps = {
  '1': [
    emptyToken,
    {
      name: 'USDC',
      id: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      decimals: 6,
    },
    {
      name: 'Wrapped Ether',
      id: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      symbol: 'WETH',
      decimals: 18,
    },
  ],
  '42': [
    emptyToken,
    {
      name: 'USDC',
      id: '0xb7a4f3e9097c08da09517b5ab877f7a917224ede',
      symbol: 'USDC',
      decimals: 6,
    },
    {
      name: 'Wrapped Ether',
      id: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
      symbol: 'WETH',
      decimals: 18,
    },
  ],
}

type SystemAddresses = {
  [key in SupportedNetworks]: {
    controller: string
    factory: string
    addressBook: string
    pool: string
    zeroxExchange: string
    zeroxERCProxy: string
    zeroxStaking: string
  }
}

export const addresses: SystemAddresses = {
  '1': {
    controller: '0xde158Fa7022f11707d4a3570eec4621B35d83829',
    factory: '0xE21127f47B365d3b1467746804f32BF8dCf47e26',
    addressBook: '0x57ADe7D5E9D2F45A07f8039Da7228ACC305fbeaF',
    pool: '0x0Cb5BDBf1726f7CC720B21EA910ACeda9FdDf680',
    zeroxExchange: '0x61935cbdd02287b511119ddb11aeb42f1593b7ef',
    zeroxERCProxy: '0x95e6f48254609a6ee006f7d493c8e5fb97094cef',
    zeroxStaking: '0xa26e80e7dea86279c6d778d702cc413e6cffa777',
  },
  '42': {
    controller: '0xdee7d0f8ccc0f7ac7e45af454e5e7ec1552e8e4e',
    factory: '0xb9d17ab06e27f63d0fd75099d5874a194ee623e2',
    addressBook: '0x8812f219f507e8cfe9d2f1e790164714c5e06a73',
    pool: '0x8c7c60d766951c5c570bbb7065c993070061b795',
    zeroxExchange: '0x4eacd0af335451709e1e7b570b8ea68edec8bc97',
    zeroxERCProxy: '0xf1ec01d6236d3cd881a0bf0130ea25fe4234003e',
    zeroxStaking: '0xbab9145f1d57cd4bb0c9aa2d1ece0a5b6e734d34',
  },
}

export const blacklistOTokens = {
  '1': [ZERO_ADDR],
  '42': [ZERO_ADDR],
}

export const knownOperators: {
  [key in SupportedNetworks]: { address: string; name: string; audited: boolean }[]
} = {
  '1': [
    {
      address: '0x8f7dd610c457fc7cb26b0f9db4e77581f94f70ac',
      name: 'PayableProxy',
      audited: true,
    },
  ],
  '42': [
    {
      address: '0x5957a413f5ac4bcf2ba7c5c461a944b548adb1a5',
      name: 'PayableProxy',
      audited: true,
    },
  ],
}

export const zx_exchange = {
  '1': '0x61935cbdd02287b511119ddb11aeb42f1593b7ef',
  '42': '0x4eacd0af335451709e1e7b570b8ea68edec8bc97',
}

export const getUSDC = (networkId: SupportedNetworks) => {
  return tokens[networkId].find(t => t.symbol === 'USDC') || emptyToken
}

export const getWeth = (networkId: SupportedNetworks) => {
  return tokens[networkId].find(t => t.symbol === 'WETH') as Token
}
