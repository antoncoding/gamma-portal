import React, { useMemo, useCallback, useState } from 'react'

import { DataView, Timer } from '@aragon/ui'
import { SubgraphOToken, OrderWithMetaData } from '../../types'
import { useOrderbook } from '../../contexts/orderbook'
import { getAskPrice, getBidPrice, getOrderFillRatio, getRemainingAmounts } from '../../utils/0x-utils'
import { green, red } from './StyleDiv'
import { toTokenAmount } from '../../utils/math'
import { generateNoOrderContent, NO_TOKEN_SELECTED } from '../../constants/dataviewContents'
import { TradeAction } from '../../constants'

type OrderbookProps = {
  selectedOToken: SubgraphOToken | null
  action: TradeAction
  setAction: any
  selectedOrders: OrderWithMetaData[]
  setSelectedOrders: React.Dispatch<React.SetStateAction<OrderWithMetaData[]>>
}

export default function Orderbook({
  selectedOToken,
  action,
  selectedOrders,
  setAction,
  setSelectedOrders,
}: OrderbookProps) {
  const [askPage, setAskPage] = useState(0)
  const [bidPage, setBidPage] = useState(0)

  const [selectedAskIdxs, setSelectedAskIdxs] = useState<number[]>([])

  const [selectedBidIdxs, setSelectedBidIdxs] = useState<number[]>([])

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
      toTokenAmount(getRemainingAmounts(order).remainingMakerAssetAmount, 8).toFixed(4),
      `${getOrderFillRatio(order)}%`,
      <Timer format="ms" showIcon end={new Date(Number(order.order.expirationTimeSeconds) * 1000)} />,
    ],
    [],
  )

  const renderBidRow = useCallback(
    (order: OrderWithMetaData) => [
      green(getBidPrice(order.order, 6, 8).toFixed(4)),
      toTokenAmount(order.metaData.remainingFillableTakerAssetAmount, 8).toFixed(4),
      `${getOrderFillRatio(order)}%`,
      <Timer format="ms" showIcon end={new Date(Number(order.order.expirationTimeSeconds) * 1000)} />,
    ],
    [],
  )

  // user wants to buy will click on asks
  const onSelectAskEntry = useCallback(
    (entries, indexes) => {
      setSelectedOrders(entries)
      setSelectedAskIdxs(indexes)
      setSelectedBidIdxs([])
      if (action === TradeAction.Sell) {
        setAction(TradeAction.Buy)
      }
    },
    [action, setAction, setSelectedOrders],
  )

  // user wants to sell will click on bids
  const onSelectBidEntry = useCallback(
    (entries, indexes) => {
      setSelectedOrders(entries)
      setSelectedBidIdxs(indexes)
      setSelectedAskIdxs([])
      if (action === TradeAction.Buy) {
        setAction(TradeAction.Sell)
      }
    },
    [action, setAction, setSelectedOrders],
  )

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ minWidth: 450, width: '50%' }}>
        <DataView
          emptyState={selectedOToken ? generateNoOrderContent('asks', selectedOToken?.symbol) : NO_TOKEN_SELECTED}
          entriesPerPage={5}
          page={askPage}
          onPageChange={setAskPage}
          entries={asks}
          tableRowHeight={40}
          onSelectEntries={onSelectAskEntry}
          // If other operation reset selected orders, should change selected accordingly
          selection={selectedAskIdxs}
          renderSelectionCount={x => `${x} Orders Selected`}
          fields={['price', 'amount', 'filled', 'expiration']}
          renderEntry={renderAskRow}
        />
      </div>
      <div style={{ minWidth: 450, width: '50%' }}>
        <DataView
          emptyState={selectedOToken ? generateNoOrderContent('bids', selectedOToken?.symbol) : NO_TOKEN_SELECTED}
          entriesPerPage={5}
          page={bidPage}
          onPageChange={setBidPage}
          entries={bids}
          tableRowHeight={40}
          onSelectEntries={onSelectBidEntry}
          // If other operation reset selected orders, should change selected accordingly
          selection={selectedBidIdxs}
          renderSelectionCount={x => `${x} Orders Selected`}
          fields={['price', 'amount', 'filled', 'expiration']}
          renderEntry={renderBidRow}
        />
      </div>
    </div>
  )
}
