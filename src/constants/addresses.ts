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
<<<<<<< HEAD
  // '4' : [
  //   emptyToken,
  //   {
  //     name: 'USDC',
  //     address: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b',
  //     symbol: 'USDC',
  //     decimals: 6
  //   },
  //   {
  //     name: 'Wrapped Ether',
  //     address: '0xc778417e063141139fce010982780140aa0cd5ab',
  //     symbol: 'WETH',
  //     decimals: 18
  //   },
  //   {
  //     name: 'Wrapped BTC',
  //     address: '0x577d296678535e4903d59a4c929b718e1d575e0a',
  //     symbol: 'WBTC',
  //     decimals: 8
  //   }
  // ],
  '42' : [
=======
  '4': [
    emptyToken,
    {
      name: 'USDC',
      address: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b',
      symbol: 'USDC',
      decimals: 6,
    },
    {
      name: 'Wrapped Ether',
      address: '0xc778417e063141139fce010982780140aa0cd5ab',
      symbol: 'WETH',
      decimals: 18,
    },
    {
      name: 'Wrapped BTC',
      address: '0x577d296678535e4903d59a4c929b718e1d575e0a',
      symbol: 'WBTC',
      decimals: 8,
    },
  ],
  '42': [
>>>>>>> c53abf7... Add operator info to operators page
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

export const addressese: GammaAddress = {
  '1': {
    controller: '',
    factory: '',
    addressBook: '',
    pool: '',
  },
<<<<<<< HEAD
  // '4': {
  //   controller: '0x5ca72b05416f728c877942078454d458e6733421',
  //   factory: '0x17fFbe9476dDcC79f4574E0c89CE537fD65A8cAe',
  //   addressBook: '0x7630e7dE53E3d1f298f653d27fcF3710c602331C',
  //   pool: '0x228D386D950984D1F4A2425683e620558A1430d9'
  // },
  '42' : {
    controller: '0x37adb373e5f986a31a3441a24453bc047f26c46c',
    factory: '0x6fb1a6809961b0611c4296b16d8F14eF17FfAacF',
    addressBook: '0x16124C5d58F58Fe3fce36C36C5c5Df67548',
    pool: '0xe477d1FFC1e5eA6a577846a4699617997315B4ee'
  }
}

export const blacklistOTokens = {
  '1': [ZERO_ADDR],
  // '4': ["0x080022f16f3ad1d29c42a64ab2449fda25ffafc0", "0x1b3e291570f1c35013a252b8c52fef9f3dc46783", "0x4824cb60348702718db00ebbfb78a364b71094ef", "0xcbdbbbca5cc390d3a2a0f71177d2ea3d0e7d6e1c", "0xff7094938a547b96cdfc9582644e1413421f9efc"],
  '42': [ZERO_ADDR]
}
=======
  '4': {
    controller: '0x5ca72b05416f728c877942078454d458e6733421',
    factory: '0x17fFbe9476dDcC79f4574E0c89CE537fD65A8cAe',
    addressBook: '0x7630e7dE53E3d1f298f653d27fcF3710c602331C',
    pool: '0x228D386D950984D1F4A2425683e620558A1430d9',
  },
  '42': {
    controller: '0x162114ca77be3234e459c816be93c3a32c3ad5a7',
    factory: '0x7EaEbc642Af4E92245105De1958B87BF8ee89757',
    addressBook: '0xD37752Fd2976335fddb2e6A2cF5FfbfA88bf5F05',
    pool: '0x48ab3c5ff91cce46cd96d0d31e935ca53b885b2e',
  },
};

export const blacklistOTokens = {
  '1': [ZERO_ADDR],
  '4': [
    '0x080022f16f3ad1d29c42a64ab2449fda25ffafc0',
    '0x1b3e291570f1c35013a252b8c52fef9f3dc46783',
    '0x4824cb60348702718db00ebbfb78a364b71094ef',
    '0xcbdbbbca5cc390d3a2a0f71177d2ea3d0e7d6e1c',
    '0xff7094938a547b96cdfc9582644e1413421f9efc',
  ],
  '42': [ZERO_ADDR],
};

export const knownOperators: {
  [key in SupportedNetworks]: { address: string; name: string; audited: boolean }[];
} = {
  '1': [],
  '4': [],
  '42': [
    {
      address: '0x3bee6b613b3e52020fa958ebd9ca691c11a55995',
      name: 'PayableProxy',
      audited: true,
    },
  ],
};
>>>>>>> c53abf7... Add operator info to operators page
