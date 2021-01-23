import React, { useMemo, useCallback, useState } from 'react'

import { DataView, Timer } from '@aragon/ui'
import { SubgraphOToken, OrderWithMetaData } from '../../../types'
import { useOrderbook } from '../../../contexts/orderbook'
import { getAskPrice, getBidPrice, getRemainingAmounts } from '../../../utils/0x-utils'
import { green, red } from './StyleDiv'
import { toTokenAmount } from '../../../utils/math'
import { generateNoOrderContent, NO_TOKEN_SELECTED } from '../../../constants/dataviewContents'
import { TradeAction } from '../../../constants'
import { simplifyOTokenSymbol } from '../../../utils/others'

type OrderbookProps = {
  selectedOToken: SubgraphOToken | null
  action: TradeAction
  showBoth: boolean
}

export default function Orderbook({ showBoth, selectedOToken, action }: OrderbookProps) {
  const [askPage, setAskPage] = useState(0)
  const [bidPage, setBidPage] = useState(0)

  const { orderbooks } = useOrderbook()

  const thisBook = useMemo(
    () => (selectedOToken ? orderbooks.find(book => book.id === selectedOToken.id) : undefined),
    [selectedOToken, orderbooks],
  )

  const bids = thisBook?.bids ?? []
  const asks = thisBook?.asks ?? []

  const renderAskRow = useCallback(
    (order: OrderWithMetaData) => [
      red(getAskPrice(order.order, 8, 6).toFixed(4)),
      toTokenAmount(getRemainingAmounts(order).remainingMakerAssetAmount, 8).toFixed(2),
      <Timer format="ms" showIcon end={new Date(Number(order.order.expirationTimeSeconds) * 1000)} />,
    ],
    [],
  )

  const renderBidRow = useCallback(
    (order: OrderWithMetaData) => [
      green(getBidPrice(order.order, 6, 8).toFixed(4)),
      toTokenAmount(order.metaData.remainingFillableTakerAssetAmount, 8).toFixed(2),
      <Timer format="ms" showIcon end={new Date(Number(order.order.expirationTimeSeconds) * 1000)} />,
    ],
    [],
  )

  return (
    <div>
      {(action === TradeAction.Buy || showBoth) && (
        <DataView
          emptyState={
            selectedOToken
              ? generateNoOrderContent('asks', simplifyOTokenSymbol(selectedOToken?.symbol))
              : NO_TOKEN_SELECTED
          }
          entriesPerPage={6}
          page={askPage}
          onPageChange={setAskPage}
          entries={asks}
          tableRowHeight={40}
          renderSelectionCount={x => `${x} Orders Selected`}
          fields={['ask price', 'amount', 'expiration']}
          renderEntry={renderAskRow}
        />
      )}
      {(action === TradeAction.Sell || showBoth) && (
        <DataView
          emptyState={
            selectedOToken
              ? generateNoOrderContent('bids', simplifyOTokenSymbol(selectedOToken?.symbol))
              : NO_TOKEN_SELECTED
          }
          entriesPerPage={6}
          page={bidPage}
          onPageChange={setBidPage}
          entries={bids}
          tableRowHeight={40}
          renderSelectionCount={x => `${x} Orders Selected`}
          fields={['bid price', 'amount', 'expiration']}
          renderEntry={renderBidRow}
        />
      )}
    </div>
  )
}
