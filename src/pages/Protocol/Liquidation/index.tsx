import React, { useEffect, useState, useCallback, useMemo } from 'react'
import ReactGA from 'react-ga'
import { Button, DataView, SyncIndicator, Info, useTheme, Split } from '@aragon/ui'

import { useConnectedWallet } from '../../../contexts/wallet'
import Header from '../../../components/Header'
import CustomIdentityBadge from '../../../components/CustomIdentityBadge'
import StyledContainer from '../../../components/StyledContainer'
import { regular, red, green } from '../../../components/StyleDiv'
import { LIQ_CALL_VAULT_STATE, LIQ_PUT_VAULT_STATE } from '../../../constants/dataviewContents'

import { useLiquidationStatus } from '../../../hooks'
import OpynTokenAmount from '../../../components/OpynTokenAmount'
import { getWeth, SupportedNetworks, getPrimaryPaymentToken } from '../../../constants'
import BigNumber from 'bignumber.js'
import { useController } from '../../../hooks/useController'

export default function Liquidation() {
  useEffect(() => {
    ReactGA.pageview('protocol/liquidation/')
  }, [])

  const { networkId } = useConnectedWallet()

  const [putPage, setPutPage] = useState(0)
  const [callPage, setCallPage] = useState(0)

  const weth = useMemo(() => getWeth(networkId), [networkId])

  const { vaults, isSyncing, isInitializing, spotPrice } = useLiquidationStatus(weth, 30)

  const putVaults = useMemo(
    () =>
      vaults
        .filter(vault => vault.shortOToken?.isPut)
        .sort((a, b) => (a.liquidationPrice.gt(b.liquidationPrice) ? -1 : 1)),
    [vaults],
  )

  const callVaults = useMemo(
    () =>
      vaults
        .filter(vault => !vault.shortOToken?.isPut)
        .sort((a, b) => (a.liquidationPrice.gt(b.liquidationPrice) ? 1 : -1)),
    [vaults],
  )

  const totalCollateralPut = useMemo(
    () => putVaults.reduce((prev, curr) => prev.plus(new BigNumber(curr.collateralAmount as string)), new BigNumber(0)),
    [putVaults],
  )

  const totalCollateralCalls = useMemo(
    () =>
      callVaults.reduce((prev, curr) => prev.plus(new BigNumber(curr.collateralAmount as string)), new BigNumber(0)),
    [callVaults],
  )

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
        <VaultHealth liqPrice={vault.liquidationPrice} spotPrice={spotPrice} isPut={vault.shortOToken?.isPut} />,
        <OpynTokenAmount token={vault.collateralAsset} amount={collateralAmount} chainId={networkId} />,
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
    [networkId, handleLiquidate, spotPrice],
  )

  return (
    <StyledContainer>
      <Header primary={'Liquidation'} secondary={`ETH Price $${spotPrice}`} />
      {networkId !== SupportedNetworks.Mainnet ? (
        <Info> This monitor is only available on Mainnet </Info>
      ) : (
        <div>
          <DataView
            heading={
              <Split
                primary="Call Vaults"
                secondary={
                  <OpynTokenAmount
                    token={getWeth(networkId)}
                    amount={totalCollateralCalls.toString()}
                    chainId={networkId}
                  />
                }
              />
            }
            status={isInitializing ? 'loading' : 'default'}
            emptyState={LIQ_CALL_VAULT_STATE}
            fields={['owner', 'statue', 'collateral', 'Liq price', 'short', '']}
            entries={callVaults}
            renderEntry={renderVaultRow}
            entriesPerPage={5}
            page={callPage}
            onPageChange={setCallPage}
            tableRowHeight={45}
          />

          <DataView
            heading={
              <Split
                primary="Put Vaults"
                secondary={
                  <OpynTokenAmount
                    token={getPrimaryPaymentToken(networkId)}
                    amount={totalCollateralPut.toString()}
                    chainId={networkId}
                  />
                }
              />
            }
            status={isInitializing ? 'loading' : 'default'}
            emptyState={LIQ_PUT_VAULT_STATE}
            fields={['owner', 'status', 'collateral', 'Liq price', 'short', '']}
            entries={putVaults}
            renderEntry={renderVaultRow}
            entriesPerPage={5}
            page={putPage}
            onPageChange={setPutPage}
            tableRowHeight={45}
          />
          <SyncIndicator visible={isSyncing} children={'Syncing Oracle Data 🍣'} />
        </div>
      )}
    </StyledContainer>
  )
}

const liquidationPrice = (price: BigNumber) => {
  return regular(`$${price.toFixed(0)}`)
}

function VaultHealth({ liqPrice, spotPrice, isPut }: { liqPrice: BigNumber; spotPrice: BigNumber; isPut: boolean }) {
  const theme = useTheme()
  if (isPut) {
    if (spotPrice.times(0.9).lt(liqPrice)) return red('Danger')
    else if (spotPrice.times(0.7).lt(liqPrice)) return <div style={{ color: theme.warning }}> Warning </div>
    else return green('Safe')
  } else {
    if (spotPrice.times(1.1).gt(liqPrice)) return red('Danger')
    else if (spotPrice.times(1.4).gt(liqPrice)) return <div style={{ color: theme.warning }}> Warning </div>
    else return green('Safe')
  }
}
