import { useState, useCallback } from 'react'

import { useToast } from '@aragon/ui'
import { OTokenBalance } from '../types'
import { getBalances } from '../utils/graph'
import useAsyncMemo from './useAsyncMemo'
import { SupportedNetworks } from '../constants/networks'

export function useOTokenBalances(
  account: string,
  networkId: SupportedNetworks,
): { balances: OTokenBalance[] | null; refetch: Function; isLoading: boolean } {
  const [refreshCount, setRefreshCount] = useState(0)
  const [isLoading, setIsLoadig] = useState(true)
  const toast = useToast()

  const refetch = useCallback(() => {
    setRefreshCount(count => count + 1)
  }, [setRefreshCount])

  const balances = useAsyncMemo(
    async () => {
      const balances = await getBalances(networkId, account, toast)
      setIsLoadig(false)
      return balances
    },
    null,
    [refreshCount, account, networkId],
  )

  return { balances, isLoading, refetch }
}
