import { createContext, useContext } from 'react'
import Web3 from 'web3'
import { networkToProvider } from '../constants'
import { SupportedNetworks } from '../constants/networks'

export interface Wallet {
  web3: Web3
  user: string
  isWatchMode: Boolean
  setUser: (user: string) => void
  setIsWatchMode:(watchMode: Boolean) => void,
  networkId: SupportedNetworks
  connect: () => Promise<string | false>
  disconnect: Function
  setNetworkId: Function
}

export const DEFAULT: Wallet = {
  networkId: SupportedNetworks.Mainnet,
  web3: new Web3(networkToProvider[SupportedNetworks.Mainnet]),
  user: '',
  isWatchMode: false,
  setUser: (user: string): void => {},
  setIsWatchMode:(watchMode: Boolean): void => {},
  connect: async () => '',
  disconnect: () => {},
  setNetworkId: () => {},
}

export const walletContext = createContext(DEFAULT)
export const useConnectedWallet = () => useContext(walletContext)
