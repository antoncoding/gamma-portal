import { SupportedNetworks } from './networks'
import { Token } from '../types/index'

type Tokens = {
  [key in SupportedNetworks]: Token[]
}

const isPublic = process.env.REACT_APP_PUBLIC === 'true'
export const ZERO_ADDR = '0x0000000000000000000000000000000000000000'

export const eth: Token = {
  name: 'Ether',
  id: ZERO_ADDR,
  symbol: 'ETH',
  decimals: 18,
}

export const tokens: Tokens = {
  [SupportedNetworks.Mainnet]: [
    eth,
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
    {
      name: 'Wrapped Bitcoin',
      id: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      symbol: 'WBTC',
      decimals: 8,
    },
    {
      name: 'yvUSDC',
      id: '0xa354f35829ae975e850e23e9615b11da1b3dc4de',
      symbol: 'yvUSDC',
      decimals: 6,
    },
  ],
  [SupportedNetworks.Ropsten]: [
    eth,
    {
      name: 'Opyn USDC',
      id: '0x27415c30d8c87437becbd4f98474f26e712047f4',
      symbol: 'USDC',
      decimals: 6,
      canMint: true,
    },
    {
      name: 'Wrapped Ether',
      id: '0xc778417e063141139fce010982780140aa0cd5ab',
      symbol: 'WETH',
      decimals: 18,
    },
    {
      name: 'Opyn Wrapped Bitcoin',
      id: '0xe477d1ffc1e5ea6a577846a4699617997315b4ee',
      symbol: 'WBTC',
      decimals: 8,
      canMint: true,
    },
  ],
  [SupportedNetworks.Kovan]: [
    eth,
    {
      name: 'USDC',
      id: '0x7e6eda50d1c833be936492bf42c1bf376239e9e2',
      symbol: 'USDC',
      decimals: 6,
      canMint: true,
    },
    {
      name: 'Wrapped Ether',
      id: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
      symbol: 'WETH',
      decimals: 18,
    },
    {
      name: 'Wrapped Bitcoin',
      id: '0x50570256f0da172a1908207aaf0c80d4b279f303',
      symbol: 'WBTC',
      decimals: 8,
      canMint: true,
    },
  ],
  [SupportedNetworks.Avalanche]: [
    {
      name: 'Wrapped AVAX',
      id: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
      symbol: 'WAVAX',
      decimals: 18,
    },
    {
      name: 'USDC',
      id: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
      symbol: 'USDC',
      decimals: 6,
    },
  ],
  [SupportedNetworks.Arbitrum]: [
    {
      name: 'USDC',
      id: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
      symbol: 'USDC',
      decimals: 6,
    },
    {
      name: 'Wrapped Ether',
      id: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      symbol: 'WETH',
      decimals: 18,
    },
    {
      name: 'Wrapped Bitcoin',
      id: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
      symbol: 'WBTC',
      decimals: 8,
    },
  ],
  [SupportedNetworks.Matic]: [
    {
      name: 'USDC',
      id: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      symbol: 'USDC',
      decimals: 6,
    },
    {
      name: 'Wrapped Ether',
      id: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
      symbol: 'WETH',
      decimals: 18,
    },
    {
      name: '(POS) Wrapped Bitcoin',
      id: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
      symbol: 'WBTC',
      decimals: 8,
    },
  ],
}

type SystemAddresses = {
  [key in SupportedNetworks]: {
    controller: string
    calculator: string
    factory: string
    addressBook: string
    whitelist: string
    pool: string
    zeroxExchange: string
  }
}

export const addresses: SystemAddresses = {
  [SupportedNetworks.Mainnet]: {
    controller: isPublic ? '0x4ccc2339F87F6c59c6893E1A678c2266cA58dC72' : '0xde158Fa7022f11707d4a3570eec4621B35d83829',
    calculator: isPublic ? '0xfaa67e3736572645B38AF7410B3E1006708e13F4' : '0x9a33230f59Cc7Cc9A084E0098A2b2934FC7BF7c0',
    factory: isPublic ? '0x7C06792Af1632E77cb27a558Dc0885338F4Bdf8E' : '0xE21127f47B365d3b1467746804f32BF8dCf47e26',
    addressBook: isPublic ? '0x1E31F2DCBad4dc572004Eae6355fB18F9615cBe4' : '0x57ADe7D5E9D2F45A07f8039Da7228ACC305fbeaF',
    pool: isPublic ? '0x5934807cC0654d46755eBd2848840b616256C6Ef' : '0x0Cb5BDBf1726f7CC720B21EA910ACeda9FdDf680',
    whitelist: isPublic ? '0xa5EA18ac6865f315ff5dD9f1a7fb1d41A30a6779' : '0x2244364c94a9FCb6f9ae3A4cF38f279706011882',
    zeroxExchange: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
  },
  [SupportedNetworks.Ropsten]: {
    controller: isPublic ? '0x7e9beaccdccee88558aaa2dc121e52ec6226864e' : '0xdA9BDf0B5BAA8e6ab727408e6072c4Ab35e3229D',
    calculator: isPublic ? '0x48DAd1a9e38Ff941429F1542e1Cf552e647306bB' : '0x7A63Eb4e5e024FAbD16c2FD508c92878f6F6445E',
    factory: isPublic ? '0x8d6994b701f480c27757c5fe2bd93d5352160081' : '0xE3DFeFee5b295e57bAb033Fd66B8EdF016Fe85Ec',
    addressBook: isPublic ? '0xe71417eefc794c9b83fc494861981721e26db0e9' : '0x8f92cfB1BF6eD1ce79F2E8Eb0DC96e0F3b61276D',
    pool: isPublic ? '0x3C325EeBB64495665F5376930d30151C1075bFD8' : '0xFf8efB964Fa3219D1563Dd83e7253FC8d2B9c405',
    whitelist: isPublic ? '0x5faCA6DF39c897802d752DfCb8c02Ea6959245Fc' : '0x32724C61e948892A906f5EB8892B1E7e6583ba1f',
    zeroxExchange: '0xdef1c0ded9bec7f1a1670819833240f027b25eff', // v4
  },
  [SupportedNetworks.Kovan]: {
    controller: isPublic ? '0xdee7d0f8ccc0f7ac7e45af454e5e7ec1552e8e4e' : '0xa84cff11957a0a08a3e1d568ed1caaf47626c1f3',
    calculator: isPublic ? '0xFf8efB964Fa3219D1563Dd83e7253FC8d2B9c405' : '0xE9f33Cc4e29c3215fff5C8890E4e0d930246CC28',
    factory: isPublic ? '0xb9d17ab06e27f63d0fd75099d5874a194ee623e2' : '0x32b5a18238BAdF23F8E88669de2bD3671ff7BF83',
    addressBook: isPublic ? '0x8812f219f507e8cfe9d2f1e790164714c5e06a73' : '0x4163Bf53878B2169Ea9E404b9E840FA010DbF949',
    pool: isPublic ? '0x8c7c60d766951c5c570bbb7065c993070061b795' : '0xFf7a2BD21f6dAb62948Bb7545266E9a6b2a0bEb2',
    whitelist: isPublic ? '0x9164eB40a1b59512F1803aB4C2d1dE4B89627A93' : '0xc990BB199c0ed8CEE305bD1A4c50A87029AdfAE3',
    zeroxExchange: '0x4eacd0af335451709e1e7b570b8ea68edec8bc97',
  },
  [SupportedNetworks.Avalanche]: {
    controller: '0x9e3b94819aaF6de606C4Aa844E3215725b997064',
    calculator: '0xBD5A1Dc654B5476B94F81755E68d1C8f0AAc2AFd',
    factory: '0x25bC1cD298512885F0e452833198BCBb149f66a5',
    addressBook: '0xBCa124824326CF8aBc5E2E569FFf3A6f17110510',
    pool: '0xCCF6629aEaB734E621Cc59EBb0297196774fDb9D',
    whitelist: '0xe9963AFfc9a53e293c9bB547c52902071e6087c9',
    zeroxExchange: '0x0000000000000000000000000000000000000000',
  },
  [SupportedNetworks.Arbitrum]: {
    controller: '0xeE30f92cc9Bf896679567d1aCD551f0E179756fC',
    calculator: '0xC9F007D6F0aa2b6C5f0E4c0Ff79273227C2100A9',
    factory: '0x4D3a52A0e98144CAf46Ac226d83e8f144b5c654D',
    addressBook: '0x9a33230f59Cc7Cc9A084E0098A2b2934FC7BF7c0',
    pool: '0x63d8d20606c048B9B79A30ea45Ca6787F8aEB051',
    whitelist: '0xB8f0AC1Ab70643ebE8103Db3618EA5eD6901B458',
    zeroxExchange: '0x0000000000000000000000000000000000000000',
  },
  [SupportedNetworks.Matic]: {
    controller: '0x7a23c712bddde52b22d8ff52e4cdadb1bcb0b203',
    calculator: '0x5C16b2fae97ab59814F34632202D7DE69c45c057',
    factory: '0xedD70E045903D34fBA7302B5094D37EAceb1397c',
    addressBook: '0xa87ECDaEA486bB0baEeB77FF0630364772A6bbFE',
    pool: '0x30aE5DEBc9EdF60a23cD19494492b1ef37afA56d',
    whitelist: '0x9E435A5Cb48aeE2C156a8E541ee645e1c171d012',
    zeroxExchange: '0x0000000000000000000000000000000000000000',
  },
}

export const blacklistOTokens: { [key in SupportedNetworks]: string[] } = {
  [SupportedNetworks.Mainnet]: [ZERO_ADDR],
  [SupportedNetworks.Ropsten]: [ZERO_ADDR],
  [SupportedNetworks.Kovan]: ['0x81300ac27ac2470713602b4d8a73dfcc85b779b1'],
  [SupportedNetworks.Arbitrum]: [ZERO_ADDR],
  [SupportedNetworks.Avalanche]: [ZERO_ADDR],
  [SupportedNetworks.Matic]: [ZERO_ADDR],
}

type KnownOperator = {
  address: string
  name: string
  description: string
  author: string
  audited: boolean
}

export const knownOperators: {
  [key in SupportedNetworks]: KnownOperator[]
} = {
  [SupportedNetworks.Mainnet]: [
    {
      address: isPublic ? '0x8f7dd610c457fc7cb26b0f9db4e77581f94f70ac' : '0xa05157b27b7db2eb63bb0c11412b71e7de027f89',
      name: 'PayableProxy',
      description: 'Proxy contract to help mint calls with ETH instead of WETH',
      audited: true,
      author: 'Opyn',
    },
  ],
  [SupportedNetworks.Ropsten]: [
    {
      address: isPublic ? '0x0da6280d0837292b7a1f27fc602c7e0bd3ce0b66' : '0x02d048A5f5153Eb48ce0fd4E7f03966C91139636',
      name: 'PayableProxy',
      description: 'Proxy contract to help mint calls with ETH instead of WETH',
      audited: true,
      author: 'Opyn',
    },
  ],
  [SupportedNetworks.Kovan]: [
    {
      address: isPublic ? '0x5957a413f5ac4bcf2ba7c5c461a944b548adb1a5' : '0xe501e882f6e5f049899e02b7e48d89f223cb2a4f',
      name: 'PayableProxy',
      description: 'Proxy contract to help mint calls with ETH instead of WETH',
      audited: true,
      author: 'Opyn',
    },
  ],
  [SupportedNetworks.Avalanche]: [],
  [SupportedNetworks.Arbitrum]: [
    {
      address: '0x91332064B2aB742eFBB0Ee416895dffB5fA85053',
      name: 'PayableProxy',
      description: 'Proxy contract to help mint calls with ETH instead of WETH',
      audited: true,
      author: 'Opyn',
    },
  ],
  [SupportedNetworks.Matic]: [
    {
      address: '0xb03036798511912359EDfff10c54E29db718f658',
      name: 'PayableProxy',
      description: 'Proxy contract to help mint calls with MATIC instead of WMATIC',
      audited: true,
      author: 'Opyn',
    },
  ],
}

export const getETHAggregators = (networkId: SupportedNetworks) => {
  if (networkId === SupportedNetworks.Mainnet) return '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419'
  if (networkId === SupportedNetworks.Kovan) return '0x9326BFA02ADD2366b30bacB125260Af641031331'
  return ''
}

export const getPrimaryPaymentToken = (networkId: SupportedNetworks) => {
  return tokens[networkId].find(t => t.symbol === 'USDC') as Token
}

export const getUSDC = (networkId: SupportedNetworks) => {
  return tokens[networkId].find(t => t.symbol === 'USDC') || eth
}

export const getWeth = (networkId: SupportedNetworks) => {
  // return the wrapped native token
  return tokens[networkId].find(t => t.symbol === 'WETH' || t.symbol === 'WAVAX') as Token
}

export const getPayableProxyAddr = (networkId: SupportedNetworks) => {
  return knownOperators[networkId].find(o => o.name === 'PayableProxy')
}
