import { SupportedNetworks } from './networks'
import { Token } from '../types/index'

type TokensTyps = {
  [key in SupportedNetworks]: Token[]
}

export const ZERO_ADDR = '0x0000000000000000000000000000000000000000'

export const emptyToken: Token = {
  name: 'No Token',
  address: ZERO_ADDR,
  symbol: 'N/A',
  decimals: 18,
}

export const tokens: TokensTyps = {
  '1': [
    emptyToken,
    {
      name: 'USDC',
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      decimals: 6,
    },
    {
      name: 'Wrapped Ether',
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      symbol: 'WETH',
      decimals: 18,
    },
  ],
  '42': [
    emptyToken,
    {
      name: 'USDC',
      address: '0xb7a4f3e9097c08da09517b5ab877f7a917224ede',
      symbol: 'USDC',
      decimals: 6,
    },
    {
      name: 'Wrapped Ether',
      address: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
      symbol: 'WETH',
      decimals: 18,
    },
  ],
}

type GammaAddress = {
  [key in SupportedNetworks]: {
    controller: string
    factory: string
    addressBook: string
    pool: string
  }
}

export const addresses: GammaAddress = {
  '1': {
    controller: '0xde158Fa7022f11707d4a3570eec4621B35d83829',
    factory: '0xE21127f47B365d3b1467746804f32BF8dCf47e26',
    addressBook: '0x57ADe7D5E9D2F45A07f8039Da7228ACC305fbeaF',
    pool: '0x0Cb5BDBf1726f7CC720B21EA910ACeda9FdDf680',
  },
  '42': {
    controller: '0x37adb373e5f986a31a3441a24453bc047f26c46c',
    factory: '0x6fb1a6809961b0611c4296b16d8F14eF17FfAacF',
    addressBook: '0x16124C5d58F58Fe3fce36C36C5c5Df67548',
    pool: '0xe477d1FFC1e5eA6a577846a4699617997315B4ee',
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
      address: '0xa05157B27B7Db2Eb63bb0c11412B71E7dE027F89',
      name: 'PayableProxy',
      audited: true,
    },
  ],
  '42': [
    {
      address: '0x3bee6b613b3e52020fa958ebd9ca691c11a55995',
      name: 'PayableProxy',
      audited: true,
    },
  ],
}
