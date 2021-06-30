import React, { useEffect, useState, useCallback } from 'react'
import ReactGA from 'react-ga'
import { Button, DataView, SyncIndicator } from '@aragon/ui'

import { useConnectedWallet } from '../../../contexts/wallet'
import Header from '../../../components/Header'
import CustomIdentityBadge from '../../../components/CustomIdentityBadge'
import StyledContainer from '../../../components/StyledContainer'

import { useLiquidationStatus } from '../../../hooks'
import OpynTokenAmount from '../../../components/OpynTokenAmount'
import { getWeth } from '../../../constants'

export default function Liquidation() {
  useEffect(() => {
    ReactGA.pageview('protocol/liquidation/')
  }, [])

  const { networkId } = useConnectedWallet()

  const [page, setPage] = useState(0)

  const { vaults, isSyncing } = useLiquidationStatus(getWeth(networkId), 15)

  const renderVaultRow = useCallback(
    vault => {
      const collateralAmount = vault.collateralAmount ? vault.collateralAmount : '0'
      const shortAmount = vault.shortAmount ? vault.shortAmount : '0'
      const ratio = vault.collatRatio.isNegative() ? 'N/A' : `${vault.collatRatio.times(100).toFixed(1)} %`
      return [
        <CustomIdentityBadge entity={vault.owner.id} />,
        <OpynTokenAmount token={vault.collateralAsset} amount={collateralAmount} chainId={networkId} />,
        ratio,
        <OpynTokenAmount token={vault.shortOToken} amount={shortAmount} chainId={networkId} />,
        <Button disabled={!vault.isLiquidatable} label={'Liquidate'} onClick={() => {}} />,
      ]
    },
    [networkId],
  )

  return (
    <StyledContainer>
      <Header primary={'Liquidation'} />

      <DataView
        fields={['owner', 'collateral', 'ratio', 'short', '']}
        entries={vaults}
        renderEntry={renderVaultRow}
        entriesPerPage={8}
        page={page}
        onPageChange={setPage}
      />
      <SyncIndicator visible={isSyncing} children={'Syncing Oracle Data 🍣'} />
    </StyledContainer>
  )
}
