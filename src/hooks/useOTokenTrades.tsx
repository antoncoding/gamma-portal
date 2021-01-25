import { useState, useCallback, useEffect } from 'react'

import { useToast } from '@aragon/ui'
import { OTokenTrade } from '../types'
import { getOTokenTrades } from '../utils/graph'
import { useConnectedWallet } from '../contexts/wallet'

export function useOTokenTrades(
  token: string,
  secsBack: number,
  refetchInterval?: number,
): { trades: OTokenTrade[] | null; refetch: Function; isLoading: boolean } {
  const [trades, setTrades] = useState<OTokenTrade[]>([])

  const [refreshCount, setRefreshCount] = useState(0)
  const [isLoading, setIsLoadig] = useState(true)
  const toast = useToast()

  const { networkId } = useConnectedWallet()

  const refetch = useCallback(() => {
    setRefreshCount(count => count + 1)
  }, [setRefreshCount])

  useEffect(() => {
    async function fetchTrades() {
      const trades = await getOTokenTrades(networkId, token, secsBack, toast)
      if (trades === null) return
      setIsLoadig(false)
      setTrades(trades)
    }
    fetchTrades()
    const interval = setInterval(fetchTrades, refetchInterval ? refetchInterval * 1000 : 10000)
    return () => clearInterval(interval)
  }, [networkId, token, toast, refetchInterval, refreshCount, secsBack])

  return { trades, isLoading, refetch }
}
