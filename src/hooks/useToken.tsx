import { useMemo } from 'react'
import {tokens} from '../constants/addresses'
import {Token} from '../types'

function useToken(symbol: string, networkId: number): Token | null {
  const token = useMemo( () => tokens[networkId.toString()].find(token => token.symbol === symbol), [networkId, symbol] )

  if (token === undefined) return null

  return token
} 
  

export default useToken
