import React, { useContext, useMemo, useState, useCallback } from 'react'
import { useHistory, useParams } from 'react-router-dom';

import { Button, DataView, useToast, Tag, Header, IconCirclePlus, IconCircleMinus } from '@aragon/ui'
import BigNumber from 'bignumber.js'

import { walletContext } from '../../contexts/wallet'
import { Controller } from '../../utils/contracts/controller'
import { SubgraphVault } from '../../types'
import { getVault } from '../../utils/graph'
import SectionTitle from '../../components/SectionHeader'
import CustomIdentityBadge from '../../components/CustomIdentityBadge'
import Status from '../../components/DataViewStatusEmpty'
import { ZERO_ADDR, addressese, tokens, emptyToken } from '../../constants/addresses'
import { useTokenBySymbol, useTokenByAddress } from '../../hooks/useToken'
import { toTokenAmount, fromTokenAmount } from '../../utils/math'

import useAsyncMemo from '../../hooks/useAsyncMemo';

export default function VaultDetail() {

  const [isLoading, setIsLoading] = useState(true)

  const { web3, networkId, user } = useContext(walletContext)
  const { owner, vaultId } = useParams()
  const toast = useToast()

  const vaultDetail = useAsyncMemo(async () => {
    const result = await getVault(networkId, owner, vaultId, toast)
    setIsLoading(false)
    return result
  }, null, [networkId, owner, toast, vaultId])

  const controller = useMemo(() => new Controller(web3, networkId, user), [networkId, user, web3])

  const isAuthorized = useMemo(() => {
    if (vaultDetail === null) return false
    else if (owner === user) return true
    else return vaultDetail.owner.operators.map(o => o.operator.id).includes(user)
  }, [vaultDetail, owner, user])


  const collateralToken = useTokenByAddress(vaultDetail && vaultDetail.collateralAsset ? vaultDetail.collateralAsset : ZERO_ADDR, networkId)

  const addOwnCollateral = useCallback(async () => {
    const vaultId = new BigNumber(1)
    await controller.addOwnCollateral(user, vaultId, user, collateralToken.address, new BigNumber(1e6))
  }, [controller, user, collateralToken])

  const renderRow = useCallback(({ label, symbol, asset, amount, decimals }) => {
    return [
      <div style={{opacity: 0.8}}> {label} </div>,
      asset
        ? <CustomIdentityBadge shorten={true} entity={asset} label={symbol} />
        : <CustomIdentityBadge shorten={true} entity={ZERO_ADDR} label={emptyToken.symbol} />,
      amount
        ? toTokenAmount(new BigNumber(amount), decimals).toString()
        : 0,
      <>
        <Button icon={<IconCirclePlus />} />
        <Button icon={<IconCircleMinus />} /> 
      </>
    ]
  }, [])

  return (
    <>
      <Header primary="Vault Detail" secondary={isAuthorized && <Tag mode="new">My vault</Tag>} />
      <DataView
        mode="table"
        status={isLoading ? 'loading' : 'default'}
        fields={['type', 'asset', 'amount', '', '']}
        statusEmpty={<Status label={"No vaults"} />}
        entries={[
          { label: 'Collateral', decimals: collateralToken.decimals, symbol: collateralToken.symbol, asset: vaultDetail?.collateralAsset, amount: vaultDetail?.collateralAmount },
          { label: 'Long', decimals: 8, symbol: vaultDetail?.longOToken?.symbol, asset: vaultDetail?.longOToken?.id, amount: vaultDetail?.longAmount },
          { label: 'Short', decimals: 8, symbol: vaultDetail?.shortOToken?.symbol, asset: vaultDetail?.shortOToken?.id, amount: vaultDetail?.shortAmount }
        ]}
        renderEntry={renderRow}
      />

    </>
  )
}
