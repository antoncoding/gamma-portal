import React, { useState, useEffect } from 'react'
import TradeHeader from './Header'
import Board from './Board'
import MintPanel from './MintPanel'
import Orderbook from './Orderbook'
import TradePanel from './TradePanel'

import { SubgraphOToken, OrderWithMetaData } from '../../types'
import SectionTitle from '../../components/SectionHeader'
import { TradeAction } from '../../constants'

export default function TradePage() {
  const [selectedOToken, setSelectedOToken] = useState<SubgraphOToken | null>(null)
  const [oTokens, setOTokens] = useState<SubgraphOToken[]>([])
  const [action, setAction] = useState<TradeAction>(TradeAction.Buy)

  const [mintPanelOpened, setMintPanelOpened] = useState(false)

  const [selectedOrders, setSelectedOrders] = useState<OrderWithMetaData[]>([])

  // reset selected orders when oToken change
  useEffect(() => {
    setSelectedOrders([])
  }, [selectedOToken])

  return (
    <>
      <TradeHeader setOTokens={setOTokens} />
      <Board oTokens={oTokens} selectedOToken={selectedOToken} setSelectedOToken={setSelectedOToken} />
      <div style={{ display: 'flex' }}>
        <div style={{ width: '40%' }}>
          <SectionTitle title="Order Book" />
          <Orderbook
            selectedOToken={selectedOToken}
            setSelectedOrders={setSelectedOrders}
            setAction={setAction}
            action={action}
          />
        </div>
        <div style={{ paddingLeft: '15px', width: '60%' }}>
          <SectionTitle title="Make Orders" />
          <TradePanel
            selectedOToken={selectedOToken}
            setSelectedOrders={setSelectedOrders}
            selectedOrders={selectedOrders}
            action={action}
            setAction={setAction}
          />
        </div>
      </div>
      <MintPanel oToken={selectedOToken} opened={mintPanelOpened} onClose={() => setMintPanelOpened(false)} />
    </>
  )
}
