import { createContext, useContext } from 'react'
import Web3 from 'web3'
import { networkToProvider } from '../constants'
import { SupportedNetworks } from '../constants/networks'

export interface Wallet {
  web3: Web3
  user: string
  setUser: (user: string) => void
  networkId: SupportedNetworks
  connect: () => Promise<string | false>
  disconnect: Function
}

export const DEFAULT: Wallet = {
  networkId: SupportedNetworks.Mainnet,
  web3: new Web3(networkToProvider[SupportedNetworks.Mainnet]),
  user: '',
  setUser: (user: string): void => {},
  connect: async () => '',
  disconnect: () => {},
}

export const walletContext = createContext(DEFAULT)
export const useConnectedWallet = () => useContext(walletContext)
