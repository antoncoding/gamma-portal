import { createContext } from 'react';
import Web3 from 'web3'

export interface Wallet {
  web3: Web3,
  onboard: any,
  user: string,
  setUser: (user: string) => void;
  networkId: number,
  connect: () => string | null,
  disconnect: Function
}

export const DEFAULT : Wallet = {
  networkId: 4,
  web3: null,
  user: '',
  onboard: null, 
  setUser: (user: string):void => {},
  connect: () => '',
  disconnect: () => {}
}

export const walletContext = createContext(DEFAULT);
