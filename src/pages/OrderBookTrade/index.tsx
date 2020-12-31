import React, { useState, useEffect } from 'react'

import TradeHeader from './Header'
import Board from './Board'
import MintPanel from './MintPanel'
import Orderbook from './Orderbook'

import { SubgraphOToken, OrderWithMetaData } from '../../types'
import SectionTitle from '../../components/SectionHeader'
import { useOrderbook } from '../../contexts/orderbook'
import { TradeAction } from '../../constants'

export default function TradePage() {
  const [selectedOToken, setSelectedOToken] = useState<SubgraphOToken | null>(null)
  const [oTokens, setOTokens] = useState<SubgraphOToken[]>([])
  const [action, setAction] = useState<TradeAction>(TradeAction.Buy)

  const [mintPanelOpened, setMintPanelOpened] = useState(false)

  const [selectedOrders, setSelectedOrders] = useState<OrderWithMetaData[]>([])

  const { orderbooks } = useOrderbook()

  // reset selected orders when oToken change
  useEffect(() => {
    setSelectedOrders([])
  }, [selectedOToken])

  return (
    <>
      <TradeHeader setOTokens={setOTokens} />
      <Board oTokens={oTokens} selectedOToken={selectedOToken} setSelectedOToken={setSelectedOToken} />
      <SectionTitle title="Book" />
      <div style={{ display: 'flex' }}>
        <div style={{ width: '70%' }}>
          <Orderbook
            selectedOToken={selectedOToken}
            setSelectedOrders={setSelectedOrders}
            selectedOrders={selectedOrders}
            setAction={setAction}
            action={action}
          />
        </div>
        <div style={{ width: '30%' }}></div>
      </div>
      <MintPanel oToken={selectedOToken} opened={mintPanelOpened} onClose={() => setMintPanelOpened(false)} />
    </>
  )
}
