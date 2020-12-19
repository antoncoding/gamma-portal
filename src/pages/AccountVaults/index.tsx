import React, { useMemo, useCallback, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button, DataView, useToast, Header, Tag, Help } from '@aragon/ui'
import useAsyncMemo from '../../hooks/useAsyncMemo'
import { getAccount } from '../../utils/graph'

import { useConnectedWallet } from '../../contexts/wallet'
import { Controller } from '../../utils/contracts/controller'
import { SubgraphVault } from '../../types'
import SectionTitle from '../../components/SectionHeader'
import OpynTokenAmount from '../../components/OpynTokenAmount'
import CustomIdentityBadge from '../../components/CustomIdentityBadge'
import { VAULTS } from '../../constants/dataviewContents'

export default function AccountVaults() {
  const { web3, networkId, user } = useConnectedWallet()
  const { account } = useParams()

  const [isLoading, setIsLoading] = useState(true)

  const toast = useToast()

  const vaults = useAsyncMemo(
    async () => {
      if (!account) return
      const result = await getAccount(networkId, account, toast)
      setIsLoading(false)
      return result ? result.vaults.sort((v1, v2) => (Number(v1.vaultId) > Number(v2.vaultId) ? 1 : -1)) : []
    },
    [],
    [networkId, account],
  )

  // for batch settle
  const vaultsToSettle = useMemo(() => {
    if (!vaults) return []
    return vaults.filter(vault => {
      return vault.shortOToken
        ? Number(vault.shortOToken.expiryTimestamp) * 1000 < Date.now()
        : vault.longOToken
        ? Number(vault.longOToken.expiryTimestamp) * 1000 < Date.now()
        : false
    })
  }, [vaults])

  const controller = useMemo(() => new Controller(web3, networkId, user), [networkId, user, web3])

  const batchSettle = useCallback(async () => {
    const vaultIds = vaultsToSettle.map(vault => Number(vault.vaultId))
    await controller.settleBatch(user, vaultIds, user)
  }, [controller, user, vaultsToSettle])

  const history = useHistory()
  const openVault = useCallback(async () => {
    await controller.openVault(account)
  }, [account, controller])

  const renderRow = useCallback(
    (vault: SubgraphVault, index) => {
      const collateralAmount = vault.collateralAmount ? vault.collateralAmount : '0'
      const longAmount = vault.longAmount ? vault.longAmount : '0'
      const shortAmount = vault.shortAmount ? vault.shortAmount : '0'
      return [
        <OpynTokenAmount token={vault.collateralAsset} amount={collateralAmount} chainId={networkId} />,
        <OpynTokenAmount token={vault.longOToken} amount={longAmount} chainId={networkId} />,
        <OpynTokenAmount token={vault.shortOToken} amount={shortAmount} chainId={networkId} />,
        <Button
          label={'Detail'}
          onClick={() => {
            history.push(`/vault/${account}/${vault.vaultId}`)
          }}
        />,
      ]
    },
    [account, history, networkId],
  )

  return (
    <>
      <Header
        primary="Vaults"
        secondary={
          <Button disabled={vaultsToSettle.length === 0} onClick={batchSettle}>
            {vaultsToSettle.length === 0 ? (
              'No expired vaults'
            ) : (
              <>
                {' '}
                Settle Vaults <Tag> {vaultsToSettle.length} </Tag>{' '}
              </>
            )}
          </Button>
        }
      />
      <>
        {' '}
        <span style={{ paddingRight: 20 }}> Mange Vaults for </span>{' '}
        <CustomIdentityBadge entity={account} shorten={false} />{' '}
      </>

      <SectionTitle title="Existing Vaults" />
      <DataView
        status={isLoading ? 'loading' : 'default'}
        fields={[
          'Collateral',
          <div style={{ display: 'flex' }}>
            {' '}
            <span style={{ paddingRight: '8px' }}> Long </span>{' '}
            <Help hint={'What is Long oToken?'}> the oToken you put into a vault to create a spread. </Help>{' '}
          </div>,
          <div style={{ display: 'flex' }}>
            {' '}
            <span style={{ paddingRight: '8px' }}> Short </span>{' '}
            <Help hint={'What is Short oToken?'}>
              {' '}
              the oToken you minted by putting down collateral. Or the short position you create.{' '}
            </Help>{' '}
          </div>,
          '',
        ]}
        emptyState={VAULTS}
        entries={vaults}
        renderEntry={renderRow}
      />
      <br />
      <SectionTitle title="Open New" />
      <Button label={'Open Empty Vault'} onClick={() => openVault()} />
    </>
  )
}
