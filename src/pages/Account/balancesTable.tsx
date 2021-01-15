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
import { getOracleAssetsAndPricers } from '../../utils/graph'
import useAsyncMemo from '../../hooks/useAsyncMemo'
import { toTokenAmount } from '../../utils/math'
import { green, secondary } from '../Trade/OrderBookTrade/StyleDiv'

export default function AccountBalances({ account }: { account: string }) {
  const { networkId, user } = useConnectedWallet()

  const toast = useToast()

  const history = useHistory()

  const { balances, isLoading: isLoadingBalance } = useOTokenBalances(account, networkId)

  const allOracleAssets = useAsyncMemo(
    async () => {
      const assets = await getOracleAssetsAndPricers(networkId, toast)
      return assets === null ? [] : assets
    },
    [],
    [],
  )

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
    ({ token, balance }: OTokenBalance) => {
      const expired = isExpired(token)

      let payout: null | BigNumber = null
      if (expired) {
        const asset = allOracleAssets.find(a => a.asset.id === token.underlyingAsset.id)
        if (asset) {
          const priceRecord = asset.prices.find(p => p.expiry === token.expiryTimestamp)
          if (priceRecord) {
            const expiryPrice = priceRecord.price
            if (token.isPut) {
              payout = BigNumber.max(
                toTokenAmount(new BigNumber(token.strikePrice).minus(new BigNumber(expiryPrice)), 8).times(
                  toTokenAmount(balance, 8),
                ),
                0,
              )
            } else {
              payout = BigNumber.max(
                toTokenAmount(new BigNumber(expiryPrice).minus(token.strikePrice), 8).times(toTokenAmount(balance, 8)),
                0,
              ).div(toTokenAmount(token.strikePrice, 8))
            }
          }
        }
      }

      const button = expired ? (
        <Button label="Redeem" onClick={() => redeemToken(token.id, balance)} disabled={!isSettlementAllowed(token)} />
      ) : (
        <Button label="Trade" onClick={() => history.push(`/trade/swap/${token.id}`)} />
      )
      return [
        <OpynTokenAmount chainId={networkId} token={token} amount={balance.toString()} />,
        payout !== null ? (
          <>
            {' '}
            {getPayoutText(payout)} {secondary(token.collateralAsset.symbol)}{' '}
          </>
        ) : (
          '-'
        ),
        button,
      ]
    },
    [networkId, redeemToken, history, allOracleAssets],
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
        fields={['balance', 'Payout', '']}
        emptyState={OTOKENS}
        entries={entries.sort((a, b) => sortByExpiryThanStrike(a.token, b.token)) || []}
        renderEntry={renderRow}
      />
    </>
  )
}

function getPayoutText(payout: BigNumber): JSX.Element {
  const payoutText = payout.gt(0) ? green(payout.toFixed(4)) : secondary(payout.toFixed(4))
  return payoutText
}
