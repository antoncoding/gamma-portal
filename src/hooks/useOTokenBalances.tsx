import { useState, useCallback } from 'react';

import { useToast } from '@aragon/ui'
import { OTokenBalance } from '../types';
import { getBalances } from '../utils/graph'
import useAsyncMemo from './useAsyncMemo';
import { useConnection } from './useConnection';
import { SupportedNetworks } from '../constants/networks';

export function useOTokenBalances(account: string, networkId: SupportedNetworks): { balances: OTokenBalance[] | null, refetch: Function } {
  
  const [refreshCount, setRefreshCount] = useState(0)
  
  const toast = useToast()

  const refetch = useCallback(() => {
    setRefreshCount(count => count + 1)
  }, [setRefreshCount])

  const balances = useAsyncMemo(async() => {
    return await getBalances(networkId, account, toast)
  }, null, [refreshCount, account, networkId])

  return { balances, refetch };
}
