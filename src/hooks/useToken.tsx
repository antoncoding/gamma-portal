import { useMemo } from 'react'
import { tokens, ZERO_ADDR } from '../constants/addresses'
import { Token } from '../types'

export function useTokenBySymbol(symbol: string, networkId: number): Token {
  const token = useMemo(() => tokens[networkId.toString()].find(token => token.symbol === symbol), [networkId, symbol])

  if (token === undefined)
    return {
      name: 'Unknown',
      address: ZERO_ADDR,
      symbol: symbol,
      decimals: 18,
    }

  return token
}

export function useTokenByAddress(addr: string, networkId: number): Token {
  const token = useMemo(() => tokens[networkId.toString()].find(token => token.address === addr), [networkId, addr])

  if (token === undefined)
    return {
      name: 'Unknown',
      address: addr,
      symbol: 'Unknown',
      decimals: 18,
    }

  return token
}
