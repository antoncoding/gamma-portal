import { SupportedNetworks } from './networks'

type graphEndPointType = {
  [key in SupportedNetworks]: string
}

export const subgraph: graphEndPointType = {
  '1': 'https://api.thegraph.com/subgraphs/name/opynfinance/gamma-mainnet',
  '42': 'https://api.thegraph.com/subgraphs/name/antoncoding/gamma-kovan-new',
}
