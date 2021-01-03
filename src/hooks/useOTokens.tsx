import { useState } from 'react'
import { useToast } from '@aragon/ui'

import { useConnectedWallet } from '../contexts/wallet'
import { getLiveOTokens, getLiveOTokensIsSeries } from '../utils/graph'
import { useAsyncMemo } from '../hooks/useAsyncMemo'

export function useLiveOTokens() {
  const { networkId } = useConnectedWallet()
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(true)

  const allOtokens = useAsyncMemo(
    async () => {
      try {
        const result = await getLiveOTokens(networkId, toast)
        setIsLoading(false)
        return result ? result : []
      } catch (error) {
        setIsLoading(false)
        return []
      }
    },
    [],
    [networkId, toast],
  )

  return { isLoading, allOtokens }
}

export function useOTokenInSeries(underlying: string | undefined, strike: string | undefined) {
  const { networkId } = useConnectedWallet()
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(true)

  const allOtokens = useAsyncMemo(
    async () => {
      try {
        const result =
          underlying && strike
            ? await getLiveOTokensIsSeries(networkId, underlying, strike, toast)
            : await getLiveOTokens(networkId, toast)
        setIsLoading(false)
        return result ? result : []
      } catch (error) {
        setIsLoading(false)
        return []
      }
    },
    [],
    [networkId, toast],
  )

  return { isLoading, allOtokens }
}
