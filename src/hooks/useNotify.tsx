import { useCallback, useMemo } from 'react'

import { createNotify } from '../utils/notify'
import { networkIdToTxUrl } from '../constants'
import { useConnectedWallet } from '../contexts/wallet'

export function useNotify() {
  const { networkId } = useConnectedWallet()
  const notify = useMemo(() => createNotify(networkId), [networkId])

  const notifyCallback = useCallback(
    hash => {
      const { emitter } = notify.hash(hash)
      emitter.on('all', transaction => {
        return {
          onclick: () => window.open(`${networkIdToTxUrl[networkId]}/${transaction.hash}`),
        }
      })
    },
    [networkId, notify],
  )

  return { notifyCallback }
}
