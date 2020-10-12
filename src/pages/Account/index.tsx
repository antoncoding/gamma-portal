import React, {useContext, useMemo} from 'react'
import { Header, Button, useToast } from '@aragon/ui'
import { useParams } from 'react-router-dom';
import { walletContext} from '../../contexts/wallet'
import { Controller } from '../../utils/contracts/controller'
import { getAccount } from '../../utils/graph'
import useAsyncMemo from '../../hooks/useAsyncMemo';

export default function Account() {

  const { account } = useParams()
  const { web3, networkId, user } = useContext(walletContext)

  const toast = useToast()
  const controller = useMemo(() => new Controller(web3, networkId, user), [networkId, user, web3])

  const accountData = useAsyncMemo(() => getAccount(networkId, account, toast ), null, [networkId, account])

  console.log(accountData)

  async function openVault() {
    await controller.openVault(account)
  }

  return (
    <>
      <Header primary="My Account"/>
      <Header primary="Operators"/>
      <Header primary="Vaults"/>
      <Button label={"Open new Vault"} onClick={() => openVault()} />
    </>
  )
}