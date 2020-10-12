import { useMemo } from 'react'
import addressese from '../utils/constants'
import {Token} from '../types'

function useToken(symbol: string, networkId: number): Token | null {
  const token = useMemo( () => addressese[networkId.toString()].tokens.find(token => token.symbol === symbol), [networkId, symbol] )

  if (token === undefined) return null

  return token
} 
  

export default useToken
