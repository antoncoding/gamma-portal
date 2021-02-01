import { useConnectedWallet } from '../contexts/wallet'
import { useAsyncMemo } from '../hooks/useAsyncMemo'
import { getERC20s } from '../utils/graph'
import { SubgraphToken } from '../types'
import { useCustomToast } from './useCustomToast'

export function useProtocolAssets(): { assets: SubgraphToken[] } {
  const { networkId } = useConnectedWallet()
  const toast = useCustomToast()

  const assets = useAsyncMemo(
    async () => {
      const assets = await getERC20s(networkId, toast.error)
      if (assets === null) return []

      return assets
    },
    [],
    [networkId],
  )

  return { assets }
}
