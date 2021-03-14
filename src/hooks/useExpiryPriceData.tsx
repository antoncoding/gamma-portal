import { useState } from 'react'
import { useConnectedWallet } from '../contexts/wallet'
import { useAsyncMemo } from './useAsyncMemo'
import { useCustomToast } from './useCustomToast'
import { getOracleAssetsAndPricers } from '../utils/graph'

export function useExpiryPriceData() {
  const { networkId } = useConnectedWallet()
  const [isLoading, setIsLoading] = useState(true)

  const toast = useCustomToast()

  const allOracleAssets = useAsyncMemo(
    async () => {
      setIsLoading(true)
      const assets = await getOracleAssetsAndPricers(networkId, toast.error)
      setIsLoading(false)
      return assets === null ? [] : assets
    },
    [],
    [networkId],
  )

  return { allOracleAssets, isLoading }
}
