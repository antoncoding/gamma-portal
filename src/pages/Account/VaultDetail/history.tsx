import React, { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'

import { DataView, TransactionBadge } from '@aragon/ui'
import BigNumber from 'bignumber.js'

import { useConnectedWallet } from '../../../contexts/wallet'

import ActionBadgeFromId from '../../../components/ActionBadge'
import SectionTitle from '../../../components/SectionHeader'
import TokenAddress from '../../../components/TokenAddress'

import { getVaultHistory } from '../../../utils/graph'
import { timeSince } from '../../../utils/math'
import { toTokenAmount } from '../../../utils/math'

import { SubgraphVaultAction } from '../../../types'
import useAsyncMemo from '../../../hooks/useAsyncMemo'

import { VAULT_HISTORY } from '../../../constants/dataviewContents'
import { useCustomToast } from '../../../hooks'

export default function VaultHistory({ id }: { id: number }) {
  const [isLoading, setIsLoading] = useState(true)

  const { networkId } = useConnectedWallet()
  const { owner, vaultId } = useParams()
  const toast = useCustomToast()

  const history = useAsyncMemo(
    async () => {
      const historyData = await getVaultHistory(networkId, owner, vaultId, toast.error)
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
        ...historyData.settleActions,
      ].sort((a, b) => (a.timestamp >= b.timestamp ? -1 : 1))
      setIsLoading(false)
      return allEntry
    },
    [],
    [id],
  )

  const renderRow = useCallback(
    (entry: SubgraphVaultAction) => {
      const hash = entry.transactionHash
      const badge = <ActionBadgeFromId id={entry.id} />

      let assetToken: { id: string; symbol: string; decimals: number } | null = entry.asset

      if (entry.id.includes('SETTLE')) {
        assetToken = entry.short ? entry.short.collateralAsset : null
      } else {
        assetToken = entry.oToken ? entry.oToken : entry.asset
      }

      const assetDecimals = assetToken ? (assetToken.decimals ? assetToken.decimals : 8) : 8
      const amount = toTokenAmount(new BigNumber(entry.amount ? entry.amount : 0), assetDecimals).toString()
      const timestamp = new BigNumber(entry.timestamp).times(1000).toNumber()
      return [
        <TransactionBadge
          transaction={hash}
          networkType={networkId === 1 ? 'main' : networkId === 42 ? 'kovan' : 'rinkeby'}
        />,
        badge,
        amount === '0' ? '' : amount,
        assetToken ? <TokenAddress token={assetToken} /> : '',
        timeSince(timestamp),
      ]
    },
    [networkId],
  )

  return (
    <>
      <SectionTitle title="History" />
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
