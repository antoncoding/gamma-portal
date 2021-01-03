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
  }
}

export const addresses: SystemAddresses = {
  '1': {
    controller: '0x4ccc2339F87F6c59c6893E1A678c2266cA58dC72',
    factory: '0x7C06792Af1632E77cb27a558Dc0885338F4Bdf8E',
    addressBook: '0x1E31F2DCBad4dc572004Eae6355fB18F9615cBe4',
    pool: '0x5934807cC0654d46755eBd2848840b616256C6Ef',
    zeroxExchange: '0x61935cbdd02287b511119ddb11aeb42f1593b7ef',
    zeroxERCProxy: '0x95e6f48254609a6ee006f7d493c8e5fb97094cef',
  },
  '42': {
    controller: '0x37adb373e5f986a31a3441a24453bc047f26c46c',
    factory: '0x6fb1a6809961b0611c4296b16d8F14eF17FfAacF',
    addressBook: '0x16124C5d58F58Fe3fce36C36C5c5Df67548',
    pool: '0xe477d1FFC1e5eA6a577846a4699617997315B4ee',
    zeroxExchange: '0x4eacd0af335451709e1e7b570b8ea68edec8bc97',
    zeroxERCProxy: '0xf1ec01d6236d3cd881a0bf0130ea25fe4234003e',
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
      address: '0x3bee6b613b3e52020fa958ebd9ca691c11a55995',
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
