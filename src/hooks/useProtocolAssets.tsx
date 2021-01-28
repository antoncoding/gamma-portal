import { useToast } from '@aragon/ui'
import { useConnectedWallet } from '../contexts/wallet'
import { useAsyncMemo } from '../hooks/useAsyncMemo'
import { getERC20s } from '../utils/graph'
import { SubgraphToken } from '../types'

export function useProtocolAssets(): { assets: SubgraphToken[] } {
  const { networkId } = useConnectedWallet()
  const toast = useToast()

  const assets = useAsyncMemo(
    async () => {
      const assets = await getERC20s(networkId, toast)
      if (assets === null) return []

      return assets
    },
    [],
    [networkId],
  )

  return { assets }
}
