import { useCallback, useMemo } from 'react'

import { createNotify } from '../utils/notify'
import { networkIdToExplorer } from '../constants'
import { useConnectedWallet } from '../contexts/wallet'

export function useNotify() {
  const { networkId } = useConnectedWallet()
  const notify = useMemo(() => createNotify(networkId), [networkId])

  const notifyCallback = useCallback(
    hash => {
      const { emitter } = notify.hash(hash)
      emitter.on('all', transaction => {
        return {
          onclick: () => window.open(`${networkIdToExplorer[networkId]}/tx/${transaction.hash}`),
        }
      })
    },
    [networkId, notify],
  )

  return { notifyCallback }
}
