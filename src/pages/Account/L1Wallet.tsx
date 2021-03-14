import React, { useCallback, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useHistory } from 'react-router-dom'
import { DataView, Button, Split, Tag, Timer } from '@aragon/ui'

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
import { useExpiryPriceData } from '../../hooks/useExpiryPriceData'
import { green, secondary } from '../Trade/OrderBookTrade/StyleDiv'
import { useCustomToast } from '../../hooks'
import { toTokenAmount } from '../../utils/math'

const SHOW_OTM_KEY = 'show-otm'

export default function L1Balances({ account }: { account: string }) {
  const { networkId, user } = useConnectedWallet()
  const [expiredOtokenPage, setExpiredOTokenPage] = useState(0)
  const [otokenPage, setOTokenPage] = useState(0)
  const toast = useCustomToast()

  // whether to show OTM expired oTokens
  const [showOTM, setShowOTM] = useState(getPreference(SHOW_OTM_KEY, 'false') === 'true')

  const history = useHistory()

  const { balances, isLoading: isLoadingBalance } = useOTokenBalances(account, networkId)

  const { allOracleAssets } = useExpiryPriceData()

  const { redeemBatch } = useController()

  const redeemToken = useCallback(
    async (token: string, amount: BigNumber) => {
      if (user !== account) return toast.error('Connected account is not the owner.')

      await redeemBatch(user, [token], [amount])
    },
    [user, account, toast, redeemBatch],
  )

  const { expiredEntries, nonExpiredEntries } = useMemo(() => {
    if (!balances) {
      return {
        expiredEntries: [],
        nonExpiredEntries: [],
      }
    }
    const expiredEntries = balances.filter(({ token }) => isExpired(token))
    const nonExpiredEntries = balances.filter(({ token }) => !isExpired(token))
    return { nonExpiredEntries, expiredEntries }
  }, [balances])

  const expiredOTokensToShow = useMemo(() => {
    if (!expiredEntries) return []
    // don't apply any filter if showOTM is checked
    if (showOTM) return expiredEntries

    return expiredEntries.filter(({ token }) => {
      const asset = allOracleAssets.find(a => a.asset.id === token.underlyingAsset.id)
      if (!asset) return true // show the entry if we don't know the payout status

      const expiryPrice = asset && asset.prices.find(p => p.expiry === token.expiryTimestamp)?.price
      if (!expiryPrice) return true

      return isITM(token, expiryPrice)
    })
  }, [expiredEntries, showOTM, allOracleAssets])

  const hasExpiredToken = useMemo(() => expiredEntries.length > 0, [expiredEntries])

  // const tokensExpired = useMemo(() => entries.filter(e => isExpired(e.token)), [entries])
  const tokensToRedeem = useMemo(
    () =>
      expiredEntries
        .filter(e => isSettlementAllowed(e.token, allOracleAssets))
        // onnly redeem otokens that's ITM
        .filter(({ token }) => {
          const asset = allOracleAssets.find(a => a.asset.id === token.underlyingAsset.id)
          const price = asset && asset.prices.find(p => p.expiry === token.expiryTimestamp)?.price
          return price !== undefined && isITM(token, price)
        }),
    [expiredEntries, allOracleAssets],
  )

  const redeemAll = useCallback(async () => {
    if (user !== account) return toast.error('Connected account is not the owner.')
    const tokens = tokensToRedeem.map(t => t.token.id)
    const amounts = tokensToRedeem.map(b => b.balance)
    await redeemBatch(user, tokens, amounts)
  }, [user, account, tokensToRedeem, redeemBatch, toast])

  const renderExpiredRow = useCallback(
    ({ token, balance }: OTokenBalance) => {
      let hasPrice = false
      let expiredITM = false
      let payout: BigNumber = new BigNumber(0)
      let expiryPrice: string | undefined = undefined

      const asset = allOracleAssets.find(a => a.asset.id === token.underlyingAsset.id)
      if (asset) {
        expiryPrice = asset.prices.find(p => p.expiry === token.expiryTimestamp)?.price
        hasPrice = expiryPrice !== undefined
        if (expiryPrice !== undefined) {
          expiredITM = isITM(token, expiryPrice)
          payout = getExpiryPayout(token, balance.toString(), expiryPrice)
        }
      }

      return [
        <OpynTokenAmount chainId={networkId} token={token} amount={balance.toString()} />,
        secondary(`${toTokenAmount(token.strikePrice, 8).integerValue().toString()} USD`),
        secondary(expiryPrice ? `${toTokenAmount(expiryPrice, 8).toFixed(4)} USD` : '-'),
        <>
          {getPayoutText(payout)} {secondary(`${token.collateralAsset.symbol}`)}{' '}
        </>,
        <Button
          label="Redeem"
          onClick={() => redeemToken(token.id, balance)}
          disabled={!isSettlementAllowed(token, allOracleAssets) || !hasPrice || !expiredITM}
        />,
      ]
    },
    [networkId, redeemToken, allOracleAssets],
  )

  const renderNotExpiredRow = useCallback(
    ({ token, balance }: OTokenBalance) => {
      return [
        <OpynTokenAmount chainId={networkId} token={token} amount={balance.toString()} />,
        secondary(`${toTokenAmount(token.strikePrice, 8).integerValue().toString()} USD`),
        <Timer end={new Date(Number(token.expiryTimestamp) * 1000)} format="Mdhm" />,
        <Button label="Trade" onClick={() => history.push(`/trade/swap/${token.id}`)} />,
      ]
    },
    [networkId, history],
  )

  return (
    <>
      {expiredEntries.length > 0 && (
        <DataView
          status={isLoadingBalance ? 'loading' : 'default'}
          heading={
            <Split
              primary={<SectionTitle title="Expired oTokens" />}
              secondary={
                hasExpiredToken && (
                  <div style={{ float: 'right' }}>
                    <Button onClick={redeemAll} disabled={tokensToRedeem.length === 0}>
                      Redeem Batch
                      <span style={{ paddingLeft: '7px' }}>
                        <Tag>{tokensToRedeem.length}</Tag>
                      </span>
                    </Button>
                    <CheckBoxWithLabel
                      storageKey={SHOW_OTM_KEY}
                      checked={showOTM}
                      setChecked={setShowOTM}
                      label={'Show OTM options'}
                    />
                  </div>
                )
              }
            />
          }
          fields={['balance', 'strike', 'settlement price', 'Payout', '']}
          emptyState={OTOKENS}
          entries={expiredOTokensToShow.sort((a, b) => sortByExpiryThanStrike(a.token, b.token)) || []}
          renderEntry={renderExpiredRow}
          entriesPerPage={5}
          page={expiredOtokenPage}
          onPageChange={setExpiredOTokenPage}
        />
      )}

      <DataView
        status={isLoadingBalance ? 'loading' : 'default'}
        heading={<SectionTitle title="oTokens" />}
        fields={['balance', 'strike', 'Expiry', '']}
        emptyState={OTOKENS}
        entries={nonExpiredEntries.sort((a, b) => sortByExpiryThanStrike(a.token, b.token)) || []}
        renderEntry={renderNotExpiredRow}
        entriesPerPage={5}
        page={otokenPage}
        onPageChange={setOTokenPage}
      />
    </>
  )
}

function getPayoutText(payout: BigNumber): JSX.Element {
  const payoutText = payout.gt(0) ? green(payout.toFixed(4)) : secondary(payout.toFixed(4))
  return <div style={{ paddingRight: '5px' }}> {payoutText} </div>
}
