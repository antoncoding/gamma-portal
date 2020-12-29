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
    controller: '0x4ccc2339F87F6c59c6893E1A678c2266cA58dC72',
    factory: '0x7C06792Af1632E77cb27a558Dc0885338F4Bdf8E',
    addressBook: '0x1E31F2DCBad4dc572004Eae6355fB18F9615cBe4',
    pool: '0x5934807cC0654d46755eBd2848840b616256C6Ef',
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
      address: '0x8f7Dd610c457FC7Cb26B0f9Db4e77581f94F70aC',
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
