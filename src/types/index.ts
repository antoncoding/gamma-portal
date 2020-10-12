import {SupportedNetworks} from '../constants/addresses'

export type Token = {
  address: string,
  name: string,
  symbol: string,
  decimals: number
}

export type configType = {
  [key in SupportedNetworks]: {controller: string, tokens:Token[]}
}