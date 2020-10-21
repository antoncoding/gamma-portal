import React, { useContext, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom';

import { DataView, useToast, TransactionBadge } from '@aragon/ui'
import BigNumber from 'bignumber.js'

import { walletContext } from '../../contexts/wallet'

import { getVaultHistory } from '../../utils/graph'
import SectionTitle from '../../components/SectionHeader'
import TokenAddress from '../../components/TokenAddress'
import { timeSince } from '../../utils/math'
import {ActionBadgeFromId} from '../../components/ActionBadge'
import {SubgraphVaultAction} from '../../types'
import useAsyncMemo from '../../hooks/useAsyncMemo';
import { toTokenAmount } from '../../utils/math';

export default function VaultHistory() {

  const [isLoading, setIsLoading] = useState(true)
  
  const { networkId } = useContext(walletContext)
  const { owner, vaultId } = useParams()
  const toast = useToast()

  const history = useAsyncMemo(async () => {
    const { burnShortActions, depositCollateralActions, depositLongActions, mintShortActions, withdrawCollateralActions, withdrawLongActions } = await getVaultHistory(networkId, owner, vaultId, toast)
    const allEntry = [...burnShortActions, ...depositCollateralActions, ...depositLongActions, ...mintShortActions, ...withdrawCollateralActions, ...withdrawLongActions]
      .sort((a, b) => a.timestamp >= b.timestamp ? -1 : 1)
    setIsLoading(false)
    return allEntry
  }, [], [])

  const renderRow = useCallback((entry: SubgraphVaultAction) => {
    const hash = entry.transactionHash
    const badge = <ActionBadgeFromId id={entry.id} />
    const assetToken = entry.oToken ? entry.oToken : entry.asset
    const assetDecimals = assetToken.decimals ? assetToken.decimals : 8
    const amount = toTokenAmount(new BigNumber(entry.amount ? entry.amount : 0), assetDecimals).toString()
    const timestamp = new BigNumber(entry.timestamp).times(1000).toNumber()
    return [
      <TransactionBadge transaction={hash} networkType={networkId === 1 ? 'main' : 'rinkeby'} />,
      badge,
      amount,
      <TokenAddress token={assetToken}/>,
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
      />
    </>
  )
}
