import React, { useContext, useMemo, useState, useCallback } from 'react'
import { Button, DataView, TextInput } from '@aragon/ui'
import BigNumber from 'bignumber.js'

import { walletContext } from '../../contexts/wallet'
import { Controller } from '../../utils/contracts/controller'
import { SubgraphVault } from '../../types'
import SectionTitle from '../../components/SectionHeader'
import CustomIdentityBadge from '../../components/CustomIdentityBadge'
import Status from '../../components/DataViewStatusEmpty'
import { ZERO_ADDR } from '../../constants/addresses'

type VaultSectionProps = { account: string, isLoading: boolean, vaults: SubgraphVault[] }

export default function VaultSection({ account, vaults, isLoading }: VaultSectionProps ) {

  const { web3, networkId, user } = useContext(walletContext)

  const controller = useMemo(() => new Controller(web3, networkId, user), [networkId, user, web3])

  async function openVault() {
    await controller.openVault(account)
  }

  const renderRow = useCallback((vault: SubgraphVault) => {
    const collateralAsset = vault.collateralAsset ? vault.collateralAsset : ZERO_ADDR
    const longAsset = vault.longOToken ? vault.longOToken.id : ZERO_ADDR
    const shortAsset = vault.shortOToken ? vault.shortOToken.id : ZERO_ADDR
    const collateralAmount = vault.collateralAmount ? vault.collateralAmount : '0'
    const longAmount = vault.longAmount ? vault.longAmount : '0'
    const shortAmount = vault.shortAmount ? vault.shortAmount : '0'
    return [
      <CustomIdentityBadge shorten={true} entity={collateralAsset} />,
      collateralAmount,
      <CustomIdentityBadge shorten={true} entity={longAsset} />,
      new BigNumber(longAmount).div(1e8).toString(),
      <CustomIdentityBadge shorten={true} entity={shortAsset} />,
      new BigNumber(shortAmount).div(1e8).toString(),
    ]
  }, [])

  return (
    <>
      <SectionTitle title="Vaults" />
      <Button label={"Open new Vault"} onClick={() => openVault()} />
      <br/><br/>
      <DataView
        status={isLoading ? 'loading' : 'default'}
        fields={['Collateral', 'amount', 'Long', 'amount', 'Short', 'amount']}
        statusEmpty={<Status label={"No operator set"} />}
        entries={vaults}
        renderEntry={renderRow}
      />
    </>
  )
}
