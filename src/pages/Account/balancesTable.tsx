import React, { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { DataView, Button, useToast, Split, Tag } from '@aragon/ui'
import SectionTitle from '../../components/SectionHeader'
import OpynTokenAmount from '../../components/OpynTokenAmount'
import { useOTokenBalances } from '../../hooks/useOTokenBalances'

import { useConnectedWallet } from '../../contexts/wallet'
import { OTokenBalance } from '../../types'
import { sortByExpiryThanStrike, isExpired, isSettlementAllowed } from '../../utils/others'

import { OTOKENS } from '../../constants/dataviewContents'

import BigNumber from 'bignumber.js'
import { useController } from '../../hooks/useController'

export default function AccountBalances({ account }: { account: string }) {
  const { networkId, user } = useConnectedWallet()

  const toast = useToast()

  const history = useHistory()

  const { balances, isLoading: isLoadingBalance } = useOTokenBalances(account, networkId)

  const { redeemBatch } = useController()

  const redeemToken = useCallback(
    async (token: string, amount: BigNumber) => {
      if (user !== account) return toast('Connected account is not the owner.')

      await redeemBatch(user, [token], [amount])
    },
    [user, account, toast, redeemBatch],
  )

  const entries = useMemo(() => (balances ? balances : []), [balances])

  const hasExpiredToken = useMemo(() => entries.find(e => isExpired(e.token)), [entries])

  const tokensExpired = useMemo(() => entries.filter(e => isExpired(e.token)), [entries])
  const tokensToSettle = useMemo(() => entries.filter(e => isSettlementAllowed(e.token)), [entries])

  const redeemAll = useCallback(async () => {
    if (user !== account) return toast('Connected account is not the owner.')
    const tokens = tokensToSettle.map(t => t.token.id)
    const amounts = tokensToSettle.map(b => b.balance)
    await redeemBatch(user, tokens, amounts)
  }, [user, account, tokensToSettle, redeemBatch, toast])

  const renderRow = useCallback(
    (balance: OTokenBalance) => {
      const expired = isExpired(balance.token)
      const button = expired ? (
        <Button
          label="Redeem"
          onClick={() => redeemToken(balance.token.id, balance.balance)}
          disabled={!isSettlementAllowed(balance.token)}
        />
      ) : (
        <Button label="Trade" onClick={() => history.push(`/trade/swap/${balance.token.id}`)} />
      )
      return [
        <OpynTokenAmount chainId={networkId} token={balance.token} amount={balance.balance.toString()} />,
        '-',
        button,
      ]
    },
    [networkId, redeemToken, history],
  )

  return (
    <>
      <Split
        primary={<SectionTitle title="Balances" />}
        secondary={
          hasExpiredToken && (
            <div style={{ float: 'right' }}>
              <Button onClick={redeemAll} disabled={tokensToSettle.length === 0}>
                Redeem Batch
                <span style={{ paddingLeft: '7px' }}>
                  <Tag>{tokensExpired.length}</Tag>
                </span>
              </Button>
            </div>
          )
        }
      />

      <DataView
        status={isLoadingBalance ? 'loading' : 'default'}
        fields={['balance', 'PnL', '']}
        emptyState={OTOKENS}
        entries={entries.sort((a, b) => sortByExpiryThanStrike(a.token, b.token)) || []}
        renderEntry={renderRow}
      />
    </>
  )
}
