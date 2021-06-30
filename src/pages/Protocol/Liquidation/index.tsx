import React, { useEffect, useState, useCallback } from 'react'
import ReactGA from 'react-ga'
import { useHistory } from 'react-router-dom'
import { Button, DataView, Timer, Tag, IconGraph } from '@aragon/ui'

import { useConnectedWallet } from '../../../contexts/wallet'
import Header from '../../../components/Header'
import CustomIdentityBadge from '../../../components/CustomIdentityBadge'
import StyledContainer from '../../../components/StyledContainer'

import { SubgraphOToken, SubgraphVault } from '../../../types'

import { simplifyOTokenSymbol } from '../../../utils/others'

import { useLiquidationStatus } from '../../../hooks'
import OpynTokenAmount from '../../../components/OpynTokenAmount'

export default function Liquidation() {
  useEffect(() => {
    ReactGA.pageview('protocol/liquidation/')
  }, [])

  const [isLoading, setIsLoading] = useState(true)

  const { networkId } = useConnectedWallet()

  const [page, setPage] = useState(0)

  const { vaults } = useLiquidationStatus(15)

  const renderVaultRow = useCallback(
    (vault: SubgraphVault) => {
      const collateralAmount = vault.collateralAmount ? vault.collateralAmount : '0'
      const shortAmount = vault.shortAmount ? vault.shortAmount : '0'
      return [
        <CustomIdentityBadge entity={vault.owner.id} />,
        <OpynTokenAmount token={vault.shortOToken} amount={shortAmount} chainId={networkId} />,
        <OpynTokenAmount token={vault.collateralAsset} amount={collateralAmount} chainId={networkId} />,
        <Button label={'Liquidate'} onClick={() => {}} />,
      ]
    },
    [networkId],
  )

  return (
    <StyledContainer>
      <Header primary={'Liquidation'} />

      <DataView
        status={isLoading ? 'loading' : 'default'}
        fields={['owner', 'short', 'collateral', '']}
        entries={vaults}
        renderEntry={renderVaultRow}
        entriesPerPage={8}
        page={page}
        onPageChange={setPage}
      />
    </StyledContainer>
  )
}
