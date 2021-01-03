import { SupportedNetworks } from './networks'

type graphEndPointType = {
  [key in SupportedNetworks]: string
}

export const subgraph: graphEndPointType = {
  '1': 'https://api.thegraph.com/subgraphs/name/opynfinance/gamma-mainnet',
  '42': 'https://api.thegraph.com/subgraphs/name/antoncoding/gamma-kovan-new',
}

export const ZeroXEndpoint: { [key in SupportedNetworks]: { http: string; ws: string } } = {
  1: {
    http: 'https://api.0x.org/',
    ws: 'wss://api.0x.org/sra/v3',
  },
  42: {
    http: 'https://kovan.api.0x.org/',
    ws: 'wss://kovan.api.0x.org/sra/v3',
  },
}
