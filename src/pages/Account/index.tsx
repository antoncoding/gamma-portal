import React, { useContext, useMemo, useState } from 'react'
import { Header, useToast, Layout } from '@aragon/ui'
import { useParams } from 'react-router-dom';
import { walletContext } from '../../contexts/wallet'

import { getAccount } from '../../utils/graph'

import OperatorSection from './Operators'
import VaultSection from './Vaults'
import useAsyncMemo from '../../hooks/useAsyncMemo';

export default function Account() {

  const { account } = useParams()
  const { networkId } = useContext(walletContext)

  const [isLoading, setIsLoading] = useState(true)

  const toast = useToast()

  const accountData = useAsyncMemo(async () => {
    const result = await getAccount(networkId, account, toast)
    setIsLoading(false)
    return result
  }, null, [networkId, account])

  const operatorRelations = useMemo(() => accountData && accountData.operators ? accountData.operators : [], [accountData])

  return (
    <>

      <Layout>
        <Header primary="Account Overview" />
        <OperatorSection account={account} operatorRelations={operatorRelations} isLoading={isLoading} />
        <br /> <br />
        <VaultSection
          account={account}
          vaults={accountData && accountData.vaults ? accountData.vaults : []}
          isLoading={isLoading}
        />
      </Layout>
      />

    </>
  )
}