import { providers } from 'ethers'
import { useEffect, useState } from 'react'
import { networkToProvider } from '../constants'
import { useConnectedWallet } from '../contexts/wallet'

export function useENS() {
  const { user, networkId } = useConnectedWallet()

  const [ensName, setENSName] = useState<string | null>(null)

  // reset name when refreshed
  useEffect(() => {
    setENSName(null)
  }, [user])

  useEffect(() => {
    async function resolveENS() {
      if (user) {
        const provider = await new providers.JsonRpcProvider(networkToProvider[networkId])
        const name = await provider.lookupAddress(user)
        if (name) setENSName(name)
      }
    }
    resolveENS()
  }, [user, networkId])

  return { ensName }
}
