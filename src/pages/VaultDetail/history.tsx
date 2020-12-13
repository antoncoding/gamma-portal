import React, { useContext, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom';

import { DataView, useToast, TransactionBadge } from '@aragon/ui'
import BigNumber from 'bignumber.js'

import { walletContext } from '../../contexts/wallet'

import ActionBadgeFromId from '../../components/ActionBadge'
import SectionTitle from '../../components/SectionHeader'
import TokenAddress from '../../components/TokenAddress'

import { getVaultHistory } from '../../utils/graph'
import { timeSince } from '../../utils/math'
import { toTokenAmount } from '../../utils/math';

import {SubgraphVaultAction} from '../../types'
import useAsyncMemo from '../../hooks/useAsyncMemo';

import { VAULT_HISTORY } from '../../constants/dataviewContents'

export default function VaultHistory() {

  const [isLoading, setIsLoading] = useState(true)
  
  const { networkId } = useContext(walletContext)
  const { owner, vaultId } = useParams()
  const toast = useToast()

  const history = useAsyncMemo(async () => {
    const historyData = await getVaultHistory(networkId, owner, vaultId, toast)
    if (historyData === null) {
      setIsLoading(false)
      return []
    }
      
    const allEntry = [
        ...historyData.burnShortActions, 
        ...historyData.depositCollateralActions,
        ...historyData.depositLongActions,
        ...historyData.mintShortActions,
        ...historyData.withdrawCollateralActions, 
        ...historyData.withdrawLongActions,
        ...historyData.settleActions
      ]
      .sort((a, b) => a.timestamp >= b.timestamp ? -1 : 1)
    setIsLoading(false)
    return allEntry
  }, [], [])

  const renderRow = useCallback((entry: SubgraphVaultAction) => {
    const hash = entry.transactionHash
    const badge = <ActionBadgeFromId id={entry.id} />
    const assetToken = entry.oToken 
      ? entry.id.includes('SETTLE') 
        ? entry.oToken.collateralAsset // if it's a settle action, show payout in collateral asset
        : entry.oToken : entry.asset ? entry.asset : null
    const assetDecimals = assetToken ? assetToken.decimals ? assetToken.decimals : 8 : 8
    const amount = toTokenAmount(new BigNumber(entry.amount ? entry.amount : 0), assetDecimals).toString()
    const timestamp = new BigNumber(entry.timestamp).times(1000).toNumber()
    return [
      <TransactionBadge transaction={hash} networkType={networkId === 1 ? 'main' : networkId === 42 ? 'kovan' :'rinkeby'} />,
      badge,
      amount === '0' ? '' : amount,
      assetToken ? <TokenAddress token={assetToken}/> : '',
      timeSince(timestamp)
    ]
  }, [networkId])

  return (
    <>
      <SectionTitle title='History' />
      <DataView
        entriesPerPage={5}
        entries={history}
        mode="table"
        status={isLoading ? 'loading' : 'default'}
        fields={['tx', 'action', 'amount', 'asset', 'timestamp']}
        renderEntry={renderRow}
        emptyState={VAULT_HISTORY}
      />
    </>
  )
}
