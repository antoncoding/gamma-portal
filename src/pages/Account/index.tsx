import React, { useContext, useState } from 'react'
import { Header, useToast } from '@aragon/ui'
import { useParams } from 'react-router-dom';
import { walletContext } from '../../contexts/wallet'

import { getAccount } from '../../utils/graph'

import VaultSection from '../AccountVaults'
import useAsyncMemo from '../../hooks/useAsyncMemo';

export default function Account() {

  const { account } = useParams()
  const { networkId } = useContext(walletContext)

  const [isLoading, setIsLoading] = useState(true)

  const toast = useToast()

  const accountData = useAsyncMemo(async () => {
    if (!account) return
    const result = await getAccount(networkId, account, toast)
    setIsLoading(false)
    return result
  }, null, [networkId, account])

  return (
    <>
      <Header primary="Account Overview" />
      
    </>
  )
}