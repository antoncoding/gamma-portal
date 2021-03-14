import { useCallback, useState, useMemo, useEffect } from 'react'
import { useConnectedWallet } from '../contexts/wallet'
import { useCustomToast } from './useCustomToast'

export function useZkSync() {
  const toast = useCustomToast()

  const { networkId, user, web3 } = useConnectedWallet()

  const [latestVaultId, setLatestVaultId] = useState(0)
}
