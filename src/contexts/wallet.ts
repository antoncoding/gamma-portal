import { createContext } from 'react'
import Web3 from 'web3'
import { SupportedNetworks } from '../constants/networks'
export interface Wallet {
  web3: Web3 | null
  user: string
  setUser: (user: string) => void
  networkId: SupportedNetworks
  connect: () => Promise<string | false>
  setNetworkId: (networkId: number) => void
  disconnect: Function
  readOnlyUser: string
  setReadOnlyUser: any
}

export const DEFAULT: Wallet = {
  networkId: 4,
  web3: null,
  user: '',
  setNetworkId: (networkId: number) => {},
  setUser: (user: string): void => {},
  connect: async () => '',
  disconnect: () => {},
  readOnlyUser: '',
  setReadOnlyUser: () => {},
}

export const walletContext = createContext(DEFAULT)
