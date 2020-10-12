import {SupportedNetworks} from '../utils/constants'

export type Token = {
  address: string,
  name: string,
  symbol: string,
  decimals: number
}

export type configType = {
  [key in SupportedNetworks]: {controller: string, tokens:Token[]}
}