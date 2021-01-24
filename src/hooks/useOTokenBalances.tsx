import { useState, useCallback, useEffect } from 'react'

import { useToast } from '@aragon/ui'
import { OTokenBalance } from '../types'
import { getBalances } from '../utils/graph'
import { SupportedNetworks } from '../constants/networks'

export function useOTokenBalances(
  account: string,
  networkId: SupportedNetworks,
  refetchInterval?: number,
): { balances: OTokenBalance[] | null; refetch: Function; isLoading: boolean } {
  const [balances, setBalances] = useState<OTokenBalance[]>([])

  const [refreshCount, setRefreshCount] = useState(0)
  const [isLoading, setIsLoadig] = useState(true)
  const toast = useToast()

  const refetch = useCallback(() => {
    setRefreshCount(count => count + 1)
  }, [setRefreshCount])

  useEffect(() => {
    async function updateBalances() {
      const balances = await getBalances(networkId, account, toast)
      if (balances === null) return
      setIsLoadig(false)
      setBalances(balances)
    }
    updateBalances()
    const interval = setInterval(updateBalances, refetchInterval ? refetchInterval * 1000 : 10000)
    return () => clearInterval(interval)
  }, [networkId, account, toast, refetchInterval, refreshCount])

  return { balances, isLoading, refetch }
}
