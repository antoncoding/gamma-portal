import { SupportedNetworks } from './networks'

type graphEndPointType = {
  [key in SupportedNetworks]: string
}

const isPublic = process.env.REACT_APP_PUBLIC === 'true'
const INFURA_KEY = process.env.REACT_APP_INFURA_KEY

export const networkToProvider: { [key in SupportedNetworks]: string } = {
  [SupportedNetworks.Mainnet]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  [SupportedNetworks.Kovan]: `https://kovan.infura.io/v3/${INFURA_KEY}`,
  [SupportedNetworks.Ropsten]: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
  [SupportedNetworks.Avalanche]: 'https://api.avax.network/ext/bc/C/rpc',
  [SupportedNetworks.Arbitrum]: 'https://arb1.arbitrum.io/rpc',
  [SupportedNetworks.Matic]: 'https://rpc-mainnet.maticvigil.com/',
}

export const networkIdToName: { [key in SupportedNetworks]: string } = {
  [SupportedNetworks.Mainnet]: `Mainnet`,
  [SupportedNetworks.Kovan]: `Kovan`,
  [SupportedNetworks.Ropsten]: `Ropsten`,
  [SupportedNetworks.Avalanche]: 'Avalanche',
  [SupportedNetworks.Arbitrum]: 'Arbitrum',
  [SupportedNetworks.Matic]: 'Polygon',
}

export const subgraph: graphEndPointType = {
  [SupportedNetworks.Mainnet]: isPublic
    ? 'https://api.thegraph.com/subgraphs/name/opynfinance/gamma-mainnet'
    : 'https://api.thegraph.com/subgraphs/name/opynfinance/playground',
  [SupportedNetworks.Kovan]: isPublic
    ? 'https://api.thegraph.com/subgraphs/name/opynfinance/gamma-kovan'
    : 'https://api.thegraph.com/subgraphs/name/opynfinance/gamma-internal-kovan',
  [SupportedNetworks.Ropsten]: isPublic
    ? 'https://api.thegraph.com/subgraphs/name/opynfinance/gamma-ropsten'
    : 'https://api.thegraph.com/subgraphs/name/opynfinance/gamma-internal-ropsten',
  [SupportedNetworks.Avalanche]: 'https://api.thegraph.com/subgraphs/name/opynfinance/gamma-avax',
  [SupportedNetworks.Arbitrum]: 'https://api.thegraph.com/subgraphs/name/opynfinance/gamma-arbitrum-one',
  [SupportedNetworks.Matic]: 'https://api.thegraph.com/subgraphs/name/opynfinance/gamma-matic',
}

export const ZeroXEndpoint: { [key in SupportedNetworks]: { http: string; ws: string } } = {
  [SupportedNetworks.Mainnet]: {
    http: 'https://api.0x.org/',
    ws: 'wss://api.0x.org/sra/v4',
  },
  [SupportedNetworks.Ropsten]: {
    http: 'https://ropsten.api.0x.org/',
    ws: 'wss://ropsten.api.0x.org/sra/v4',
  },
  [SupportedNetworks.Kovan]: {
    http: '',
    ws: 'wss://api.0x.org/sra/v4', // prevent useWebsocket error
  },
  [SupportedNetworks.Arbitrum]: {
    http: '',
    ws: 'wss://api.0x.org/sra/v4', // prevent useWebsocket error
  },
  [SupportedNetworks.Avalanche]: {
    http: 'https://avalanche.api.0x.org/',
    ws: 'wss://api.0x.org/sra/v4', // prevent useWebsocket error
  },
  [SupportedNetworks.Matic]: {
    http: '',
    ws: 'wss://api.0x.org/sra/v4', // prevent useWebsocket error
  },
}
