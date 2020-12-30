import Web3 from 'web3'
import ENS from 'ethereum-ens'
import { SubgraphOToken } from '../types'

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY

// ENS
export const resolveENS = async (ensName: string, networkId: number) => {
  const network = networkId === 1 ? 'mainnet' : 'rinkeby'
  const web3 = new Web3(`https://${network}.infura.io/v3/${INFURA_KEY}`)
  const ens = new ENS(web3)
  const address = await ens.resolver(ensName).addr()
  return address.toLowerCase()
}

export const isEOA = async (address: string, networkId: number): Promise<Boolean> => {
  const network = networkId === 1 ? 'mainnet' : networkId === 42 ? 'kovan' : 'rinkeby'
  const web3 = new Web3(`https://${network}.infura.io/v3/${INFURA_KEY}`)
  return (await web3.eth.getCode(address)) === '0x'
}

/**
 * Sorting function
 * @param a
 * @param b
 */
export const sortByExpiryThanStrike = (a: SubgraphOToken, b: SubgraphOToken) => {
  if (Number(a.expiryTimestamp) > Number(b.expiryTimestamp)) return 1
  else if (Number(a.expiryTimestamp) > Number(b.expiryTimestamp)) return -1
  else if (Number(a.strikePrice) > Number(b.strikePrice)) return 1
  else return -1
}

export const isExpired = (token: SubgraphOToken) => {
  return Number(token.expiryTimestamp) < Date.now() / 1000
}

export function toUTCDateString(expiry: number): string {
  const expiryDate = new Date(expiry * 1000)
  return expiryDate.toUTCString().split(' ').slice(0, 4).join(' ')
}
