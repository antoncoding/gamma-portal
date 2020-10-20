import { createContext } from 'react';
import Web3 from 'web3'

export interface Wallet {
  web3: Web3 | null,
  user: string,
  setUser: (user: string) => void,
  networkId: number,
  connect: () => Promise<string | false>,
  disconnect: Function
  readOnlyUser: string
  setReadOnlyUser: any
}

export const DEFAULT : Wallet = {
  networkId: 4,
  web3: null,
  user: '',
  setUser: (user: string):void => {},
  connect: async () => '',
  disconnect: () => {},
  readOnlyUser: '',
  setReadOnlyUser: ()=>{}
}

export const walletContext = createContext(DEFAULT);
