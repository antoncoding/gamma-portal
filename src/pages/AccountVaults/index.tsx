import React, { useContext, useMemo, useCallback, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { Button, DataView, useToast, Header } from '@aragon/ui'
import useAsyncMemo from '../../hooks/useAsyncMemo'
import { getAccount } from '../../utils/graph'

import { walletContext } from '../../contexts/wallet'
import { Controller } from '../../utils/contracts/controller'
import { SubgraphVault } from '../../types'
import SectionTitle from '../../components/SectionHeader'
import Status from '../../components/DataViewStatusEmpty'
import { OpynTokenAmount } from '../../components/OpynTokenAmount'
import CustomIdentityBadge from '../../components/CustomIdentityBadge';


export default function AccountVaults( ) {
  const { web3, networkId, user } = useContext(walletContext)
  const { account } = useParams()

  const [isLoading, setIsLoading] = useState(true)

  const toast = useToast()

  const vaults = useAsyncMemo(async () => {
    if (!account) return
    const result = await getAccount(networkId, account, toast)
    setIsLoading(false)
    return result ? result.vaults : []
  }, [], [networkId, account])

  const controller = useMemo(() => new Controller(web3, networkId, user), [networkId, user, web3])
  const history =  useHistory()
  const openVault = useCallback(async() => {
    await controller.openVault(account)
  }, [account, controller])

  const renderRow = useCallback((vault: SubgraphVault, index) => {
    const collateralAmount = vault.collateralAmount ? vault.collateralAmount : '0'
    const longAmount = vault.longAmount ? vault.longAmount : '0'
    const shortAmount = vault.shortAmount ? vault.shortAmount : '0'
    return [
      <OpynTokenAmount
      token={vault.collateralAsset} 
      amount={collateralAmount} 
      chainId={networkId}
      />,
      <OpynTokenAmount 
        token={vault.longOToken}
        amount={longAmount}
        chainId={networkId}
      />,
      <OpynTokenAmount 
        token={vault.shortOToken}
        amount={shortAmount}
        chainId={networkId}
      />,
      <Button label={"Detail"} onClick={()=>{ history.push(`/vault/${account}/${index + 1}`);}} />
    ]
  }, [account, history, networkId])

  return (
    <>
      <Header primary="Vaults" />
      <>  <span style={{paddingRight: 20}}> Mange Vaults for </span> <CustomIdentityBadge entity={account} shorten={false} /> </>
      
      <SectionTitle title="Existing Vaults"/>
      <DataView
        status={isLoading ? 'loading' : 'default'}
        fields={['Collateral', 'Long', 'Short', '']}
        statusEmpty={<Status label={"No vaults"} />}
        entries={vaults}
        renderEntry={renderRow}
      />
      <br />
      <SectionTitle title="Open New"/>
      <Button label={"Open Empty Vault"} onClick={() => openVault()} /> 
      
    </>
  )
}
