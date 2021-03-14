import React, { useCallback, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useHistory } from 'react-router-dom'
import { DataView, Button, Split, Tag } from '@aragon/ui'

import SectionTitle from '../../components/SectionHeader'
import OpynTokenAmount from '../../components/OpynTokenAmount'
import CheckBoxWithLabel from '../../components/CheckBoxWithLabel'

import { useOTokenBalances } from '../../hooks/useOTokenBalances'

import { useConnectedWallet } from '../../contexts/wallet'
import { OTokenBalance } from '../../types'
import { sortByExpiryThanStrike, isExpired, isSettlementAllowed, isITM, getExpiryPayout } from '../../utils/others'
import { getPreference } from '../../utils/storage'

import { OTOKENS } from '../../constants/dataviewContents'

import { useController } from '../../hooks/useController'
import { getOracleAssetsAndPricers } from '../../utils/graph'
import useAsyncMemo from '../../hooks/useAsyncMemo'
import { green, secondary } from '../Trade/OrderBookTrade/StyleDiv'
import { useCustomToast } from '../../hooks'

const SHOW_OTM_KEY = 'show-otm'

export default function L1Balances({ account }: { account: string }) {
  const { networkId, user } = useConnectedWallet()
  const [page, setPage] = useState(0)
  const toast = useCustomToast()

  // whether to show OTM expired oTokens
  const [showOTM, setShowOTM] = useState(getPreference(SHOW_OTM_KEY, 'false') === 'true')

  const history = useHistory()

  const { balances, isLoading: isLoadingBalance } = useOTokenBalances(account, networkId)

  const allOracleAssets = useAsyncMemo(
    async () => {
      const assets = await getOracleAssetsAndPricers(networkId, toast.error)
      return assets === null ? [] : assets
    },
    [],
    [],
  )

  const { redeemBatch } = useController()

  const redeemToken = useCallback(
    async (token: string, amount: BigNumber) => {
      if (user !== account) return toast.error('Connected account is not the owner.')

      await redeemBatch(user, [token], [amount])
    },
    [user, account, toast, redeemBatch],
  )

  const entries = useMemo(() => {
    if (!balances) return []
    // don't apply any filter if showOTM is checked
    if (showOTM) return balances

    return balances.filter(({ token }) => {
      const expired = isExpired(token)
      if (!expired) return true

      const asset = allOracleAssets.find(a => a.asset.id === token.underlyingAsset.id)
      if (!asset) return true // show the entry if we don't know the payout status

      const expiryPrice = asset && asset.prices.find(p => p.expiry === token.expiryTimestamp)?.price
      if (!expiryPrice) return true

      return isITM(token, expiryPrice)
    })
  }, [balances, showOTM, allOracleAssets])

  const hasExpiredToken = useMemo(() => entries.find(e => isExpired(e.token)), [entries])

  // const tokensExpired = useMemo(() => entries.filter(e => isExpired(e.token)), [entries])
  const tokensToRedeem = useMemo(
    () =>
      entries
        .filter(e => isSettlementAllowed(e.token))
        // onnly redeem otokens that's ITM
        .filter(({ token }) => {
          const asset = allOracleAssets.find(a => a.asset.id === token.underlyingAsset.id)
          const price = asset && asset.prices.find(p => p.expiry === token.expiryTimestamp)?.price
          return price !== undefined && isITM(token, price)
        }),
    [entries, allOracleAssets],
  )

  const redeemAll = useCallback(async () => {
    if (user !== account) return toast.error('Connected account is not the owner.')
    const tokens = tokensToRedeem.map(t => t.token.id)
    const amounts = tokensToRedeem.map(b => b.balance)
    await redeemBatch(user, tokens, amounts)
  }, [user, account, tokensToRedeem, redeemBatch, toast])

  const renderRow = useCallback(
    ({ token, balance }: OTokenBalance) => {
      const expired = isExpired(token)
      let hasPrice = false
      let expiredITM = false
      let payout: null | BigNumber = null
      if (expired) {
        const asset = allOracleAssets.find(a => a.asset.id === token.underlyingAsset.id)
        if (asset) {
          const expiryPrice = asset && asset.prices.find(p => p.expiry === token.expiryTimestamp)?.price
          hasPrice = expiryPrice !== undefined
          if (expiryPrice) {
            expiredITM = isITM(token, expiryPrice)
            payout = getExpiryPayout(token, balance.toString(), expiryPrice)
          }
        }
      }

      const button = expired ? (
        <Button
          label="Redeem"
          onClick={() => redeemToken(token.id, balance)}
          disabled={!isSettlementAllowed(token) || !hasPrice || !expiredITM}
        />
      ) : (
        <Button label="Trade" onClick={() => history.push(`/trade/swap/${token.id}`)} />
      )
      return [
        <OpynTokenAmount chainId={networkId} token={token} amount={balance.toString()} />,
        payout !== null ? (
          <>
            {getPayoutText(payout)} {secondary(`${token.collateralAsset.symbol}`)}{' '}
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
        primary={<SectionTitle title="My Wallet" />}
        secondary={
          hasExpiredToken && (
            <div style={{ float: 'right' }}>
              <Button onClick={redeemAll} disabled={tokensToRedeem.length === 0}>
                Redeem Batch
                <span style={{ paddingLeft: '7px' }}>
                  <Tag>{tokensToRedeem.length}</Tag>
                </span>
              </Button>
            </div>
          )
        }
      />

      <CheckBoxWithLabel
        storageKey={SHOW_OTM_KEY}
        checked={showOTM}
        setChecked={setShowOTM}
        label={'Show OTM options'}
      />

      <DataView
        status={isLoadingBalance ? 'loading' : 'default'}
        fields={['balance', 'Payout', '']}
        emptyState={OTOKENS}
        entries={entries.sort((a, b) => sortByExpiryThanStrike(a.token, b.token)) || []}
        renderEntry={renderRow}
        page={page}
        onPageChange={setPage}
      />
    </>
  )
}

function getPayoutText(payout: BigNumber): JSX.Element {
  const payoutText = payout.gt(0) ? green(payout.toFixed(4)) : secondary(payout.toFixed(4))
  return <div style={{ paddingRight: '5px' }}> {payoutText} </div>
}
