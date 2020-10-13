import React, { useContext, useMemo, useState, useCallback } from 'react'
import { useHistory } from 'react-router-dom';

import { Button, DataView } from '@aragon/ui'
import BigNumber from 'bignumber.js'

import { walletContext } from '../../contexts/wallet'
import { Controller } from '../../utils/contracts/controller'
import { SubgraphVault } from '../../types'
import SectionTitle from '../../components/SectionHeader'
import CustomIdentityBadge from '../../components/CustomIdentityBadge'
import Status from '../../components/DataViewStatusEmpty'
import { ZERO_ADDR, addressese, tokens } from '../../constants/addresses'
import { useTokenBySymbol} from '../../hooks/useToken'
import { toTokenAmount, fromTokenAmount } from '../../utils/math'

type VaultSectionProps = { account: string, isLoading: boolean, vaults: SubgraphVault[] }

export default function VaultSection({ account, vaults, isLoading }: VaultSectionProps ) {

  const { web3, networkId, user } = useContext(walletContext)

  const controller = useMemo(() => new Controller(web3, networkId, user), [networkId, user, web3])
  const history =  useHistory()
  const openVault = useCallback(async() => {
    await controller.openVault(account)
  }, [account, controller])

  const USDC = useTokenBySymbol('USDC', networkId)

  const simpleAddCollateral = useCallback(async() => {
    const vaultId = new BigNumber(1)
    const collateral = USDC ? USDC.address : ZERO_ADDR
    await controller.simpleAddCollateral(account, vaultId, account, collateral, new BigNumber(1e6))
  }, [USDC, controller, account])

  // const simpleAddLong = useCallback(async() => {
  //   await controller.simpleAddLong()
  // }, [controller])

  // const simpleMint = useCallback(async () =>  {
  //   await controller.simpleMint()
  // }, [controller])

  const renderRow = useCallback((vault: SubgraphVault, index) => {
    const collateralAsset = vault.collateralAsset ? vault.collateralAsset : ZERO_ADDR
    const longAsset = vault.longOToken ? vault.longOToken.id : ZERO_ADDR
    const shortAsset = vault.shortOToken ? vault.shortOToken.id : ZERO_ADDR
    const collateralAmount = vault.collateralAmount ? vault.collateralAmount : '0'
    const longAmount = vault.longAmount ? vault.longAmount : '0'
    const shortAmount = vault.shortAmount ? vault.shortAmount : '0'
    return [
      <CustomIdentityBadge shorten={true} entity={collateralAsset} />,
      toTokenAmount(new BigNumber(collateralAmount), USDC? USDC.decimals: 6).toString(),
      <CustomIdentityBadge shorten={true} entity={longAsset} />,
      toTokenAmount(new BigNumber(longAmount), 8).toString(),
      <CustomIdentityBadge shorten={true} entity={shortAsset} />,
      toTokenAmount(new BigNumber(shortAmount), 8).toString(),
      <Button label={"Detail"} onClick={()=>{ history.push(`/vault/${account}/${index + 1}`);}} />
    ]
  }, [USDC, account, history])

  return (
    <>
      <SectionTitle title="Vaults" />
      <Button label={"Open new Vault"} onClick={() => openVault()} />
      <br/><br/>
      <DataView
        status={isLoading ? 'loading' : 'default'}
        fields={['Collateral', 'amount', 'Long', 'amount', 'Short', 'amount', '']}
        statusEmpty={<Status label={"No vaults"} />}
        entries={vaults}
        renderEntry={renderRow}
      />
      
    </>
  )
}
