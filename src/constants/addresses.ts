import { SupportedNetworks } from './networks';
import { Token } from '../types/index';

type TokensTyps = {
  [key in SupportedNetworks]: Token[];
};

export const ZERO_ADDR = '0x0000000000000000000000000000000000000000';

export const emptyToken: Token = {
  name: 'No Token',
  address: ZERO_ADDR,
  symbol: 'N/A',
  decimals: 18,
};

export const tokens: TokensTyps = {
  '1': [
    emptyToken,
    {
      name: 'USDC',
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      decimals: 6,
    },
  ],
  '42' : [
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
};

type GammaAddress = {
  [key in SupportedNetworks]: {
    controller: string;
    factory: string;
    addressBook: string;
    pool: string;
  };
};

export const addresses: GammaAddress = {
  '1': {
    controller: '',
    factory: '',
    addressBook: '',
    pool: '',
  },
  '42' : {
    controller: '0x37adb373e5f986a31a3441a24453bc047f26c46c',
    factory: '0x6fb1a6809961b0611c4296b16d8F14eF17FfAacF',
    addressBook: '0x16124C5d58F58Fe3fce36C36C5c5Df67548',
    pool: '0xe477d1FFC1e5eA6a577846a4699617997315B4ee'
  }
}

export const blacklistOTokens = {
  '1': [ZERO_ADDR],
  '42': [ZERO_ADDR]
}

export const knownOperators: {
  [key in SupportedNetworks]: { address: string; name: string; audited: boolean }[];
} = {
  '1': [],
  '42': [
    {
      address: '0x3bee6b613b3e52020fa958ebd9ca691c11a55995',
      name: 'PayableProxy',
      audited: true,
    },
  ],
};