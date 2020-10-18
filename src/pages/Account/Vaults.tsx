import React, { useContext, useMemo, useCallback } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, DataView } from '@aragon/ui'

import { walletContext } from '../../contexts/wallet'
import { Controller } from '../../utils/contracts/controller'
import { SubgraphVault } from '../../types'
import SectionTitle from '../../components/SectionHeader'
import Status from '../../components/DataViewStatusEmpty'
import { OpynTokenAmount } from '../../components/OpynTokenAmount'


type VaultSectionProps = { account: string, isLoading: boolean, vaults: SubgraphVault[] }

export default function VaultSection({ account, vaults, isLoading }: VaultSectionProps ) {
  const { web3, networkId, user } = useContext(walletContext)

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
      <SectionTitle title="Vaults" />
      <Button label={"Open new Vault"} onClick={() => openVault()} />
      <br/><br/>
      <DataView
        status={isLoading ? 'loading' : 'default'}
        fields={['Collateral', 'Long', 'Short', '']}
        statusEmpty={<Status label={"No vaults"} />}
        entries={vaults}
        renderEntry={renderRow}
      />
      
    </>
  )
}
