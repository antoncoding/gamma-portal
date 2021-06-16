import React, { useMemo, useCallback, useState, useEffect } from 'react'
import ReactGA from 'react-ga'
import { useHistory, useParams } from 'react-router-dom'
import { Button, DataView, Tag, Help } from '@aragon/ui'
import useAsyncMemo from '../../../hooks/useAsyncMemo'
import { getAccount } from '../../../utils/graph'
import Header from '../../../components/Header'
import { useConnectedWallet } from '../../../contexts/wallet'
import { SubgraphVault } from '../../../types'
import SectionTitle from '../../../components/SectionHeader'
import OpynTokenAmount from '../../../components/OpynTokenAmount'
import CustomIdentityBadge from '../../../components/CustomIdentityBadge'
import StyledContainer from '../../../components/StyledContainer'
import { VAULTS } from '../../../constants/dataviewContents'
import { useController } from '../../../hooks/useController'
import { useExpiryPriceData } from '../../../hooks/useExpiryPriceData'
import { isSettlementAllowed } from '../../../utils/others'
import { useCustomToast } from '../../../hooks'

export default function AccountVaults() {
  const { networkId, user } = useConnectedWallet()
  const { account } = useParams()
  useEffect(() => {
    ReactGA.pageview('/account/vaults')
  }, [])
  const [isLoading, setIsLoading] = useState(true)

  const toast = useCustomToast()

  const vaults = useAsyncMemo(
    async () => {
      if (!account) return
      const result = await getAccount(networkId, account, toast.error)
      setIsLoading(false)
      return result ? result.vaults.sort((v1, v2) => (Number(v1.vaultId) > Number(v2.vaultId) ? 1 : -1)) : []
    },
    [],
    [networkId, account],
  )

  // get oracle data to determine if a vault is ready to settle
  const { allOracleAssets } = useExpiryPriceData()

  // for batch settle
  const vaultsToSettle = useMemo(() => {
    if (!vaults) return []
    return vaults.filter(vault => {
      return vault.shortOToken
        ? isSettlementAllowed(vault.shortOToken, allOracleAssets)
        : vault.longOToken
        ? isSettlementAllowed(vault.longOToken, allOracleAssets)
        : false
    })
  }, [vaults, allOracleAssets])

  const { settleBatch, latestVaultId } = useController()

  const batchSettle = useCallback(async () => {
    const vaultIds = vaultsToSettle.map(vault => Number(vault.vaultId))
    await settleBatch(user, vaultIds, user)
  }, [settleBatch, user, vaultsToSettle])

  const history = useHistory()
  const goToEmptyVault = useCallback(() => {
    const newVaultId = latestVaultId + 1
    history.push(`/vault/${account}/${newVaultId}`)
  }, [account, latestVaultId, history])

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
    <StyledContainer>
      <Header
        primary="Vaults"
        secondary={
          vaultsToSettle.length > 0 && (
            <Button disabled={vaultsToSettle.length === 0} onClick={batchSettle}>
              Settle Vaults <Tag> {vaultsToSettle.length} </Tag>{' '}
            </Button>
          )
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
      <Button label={'Open Empty Vault'} onClick={goToEmptyVault} />
    </StyledContainer>
  )
}
