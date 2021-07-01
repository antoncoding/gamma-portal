import React, { useEffect, useState, useCallback, useMemo } from 'react'
import ReactGA from 'react-ga'
import { Button, DataView, SyncIndicator, Info } from '@aragon/ui'

import { useConnectedWallet } from '../../../contexts/wallet'
import Header from '../../../components/Header'
import CustomIdentityBadge from '../../../components/CustomIdentityBadge'
import StyledContainer from '../../../components/StyledContainer'
import { regular } from '../../../pages/Trade/OrderBookTrade/StyleDiv'
import { LIQ_CALL_VAULT_STATE, LIQ_PUT_VAULT_STATE } from '../../../constants/dataviewContents'

import { useLiquidationStatus } from '../../../hooks'
import OpynTokenAmount from '../../../components/OpynTokenAmount'
import { getWeth, SupportedNetworks } from '../../../constants'
import BigNumber from 'bignumber.js'
import { useController } from '../../../hooks/useController'

export default function Liquidation() {
  useEffect(() => {
    ReactGA.pageview('protocol/liquidation/')
  }, [])

  const { networkId } = useConnectedWallet()

  const [page, setPage] = useState(0)

  const { vaults, isSyncing, isInitializing } = useLiquidationStatus(getWeth(networkId), 30)

  const putVaults = useMemo(() => vaults.filter(vault => vault.shortOToken?.isPut), [vaults])

  const callVaults = useMemo(() => vaults.filter(vault => !vault.shortOToken?.isPut), [vaults])

  const { liquidate } = useController()

  const handleLiquidate = useCallback(
    async (vaultOwner: string, vaultId: string, amount: string, roundId: string) => {
      await liquidate(vaultOwner, vaultId, amount, roundId)
    },
    [liquidate],
  )

  const renderVaultRow = useCallback(
    vault => {
      const collateralAmount = vault.collateralAmount ? vault.collateralAmount : '0'
      const shortAmount = vault.shortAmount as string
      return [
        <CustomIdentityBadge entity={vault.owner.id} />,
        <OpynTokenAmount token={vault.collateralAsset} amount={collateralAmount} chainId={networkId} />,
        ratioComponent(vault.collatRatio),
        liquidationPrice(vault.liquidationPrice),
        <OpynTokenAmount token={vault.shortOToken} amount={shortAmount} chainId={networkId} />,
        <Button
          disabled={!vault.isLiquidatable}
          label={'Liquidate'}
          onClick={async () => {
            await handleLiquidate(vault.owner.id, vault.vaultId, shortAmount, vault.round.roundIdHex)
          }}
        />,
      ]
    },
    [networkId, handleLiquidate],
  )

  return (
    <StyledContainer>
      <Header primary={'Liquidation'} />
      {networkId !== SupportedNetworks.Mainnet ? (
        <Info> This monitor is only available on Mainnet </Info>
      ) : (
        <div>
          <DataView
            heading={'Call vaults'}
            status={isInitializing ? 'loading' : 'default'}
            emptyState={LIQ_CALL_VAULT_STATE}
            fields={['owner', 'collateral', 'ratio', 'Liq price', 'short', '']}
            entries={callVaults}
            renderEntry={renderVaultRow}
            entriesPerPage={4}
            page={page}
            onPageChange={setPage}
          />

          <DataView
            heading={'Put vaults'}
            status={isInitializing ? 'loading' : 'default'}
            emptyState={LIQ_PUT_VAULT_STATE}
            fields={['owner', 'collateral', 'ratio', 'Liq price', 'short', '']}
            entries={putVaults}
            renderEntry={renderVaultRow}
            entriesPerPage={4}
            page={page}
            onPageChange={setPage}
          />
          <SyncIndicator visible={isSyncing} children={'Syncing Oracle Data 🍣'} />
        </div>
      )}
    </StyledContainer>
  )
}

const ratioComponent = (ratio: BigNumber) => {
  const percentage = ratio.times(100)
  return regular(`${percentage.toFixed(1)}%`)
}

const liquidationPrice = (price: BigNumber) => {
  return regular(`$${price.toFixed(0)}`)
}
