import React, {useContext, useMemo, useState} from 'react'
import { Header, Button, useToast } from '@aragon/ui'
import { useParams } from 'react-router-dom';
import { walletContext} from '../../contexts/wallet'
import { Controller } from '../../utils/contracts/controller'
import { getAccount } from '../../utils/graph'
import SectionTitle from '../../components/SectionHeader'

import OperatorSection from './Operators'

import useAsyncMemo from '../../hooks/useAsyncMemo';

export default function Account() {

  const { account } = useParams()
  const { web3, networkId, user } = useContext(walletContext)

  const [isLoading, setIsLoading] = useState(true)

  const toast = useToast()
  const controller = useMemo(() => new Controller(web3, networkId, user), [networkId, user, web3])

  const accountData = useAsyncMemo(async() => {
    const result = await getAccount(networkId, account, toast )
    setIsLoading(false)
    return result
  }, null, [networkId, account])

  const operatorRelations = useMemo(()=> accountData && accountData.operators ? accountData.operators : [], [accountData])

  async function openVault() {
    await controller.openVault(account)
  }

  return (
    <>
      <Header primary="Account Overview"/>
      <OperatorSection account={account} operatorRelations={operatorRelations} isLoading={isLoading}/>
      <br/> <br/>
      <SectionTitle title="Vaults"/>
      <Button label={"Open new Vault"} onClick={() => openVault()} />
    </>
  )
}