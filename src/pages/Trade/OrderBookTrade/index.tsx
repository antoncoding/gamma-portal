import React, { useState, useEffect } from 'react'
import ReactGA from 'react-ga'
import TradeHeader from './Header'
import Board from './Board'
import MintPanel from './MintPanel'
import Orderbook from './Orderbook'
import BoxPreference from './OrderBoxPreference'
import UserOrders from './UserOrders'
import TradePanel from './TradePanel'

import { SubgraphOToken } from '../../../types'
import { TradeAction, SHOW_BOTH_KEY, SHOW_MINE_KEY } from '../../../constants'
import { useTokenPrice } from '../../../hooks'
import { emptyToken } from '../../../constants/addresses'
import { getPreference } from '../../../utils/storage'

export default function TradePage() {
  useEffect(() => {
    ReactGA.pageview('trade/orderbook/')
  }, [])
  const [selectedUnderlying, setSelectedUnderlying] = useState(emptyToken)
  const [selectedOToken, setSelectedOToken] = useState<SubgraphOToken | null>(null)
  const [oTokens, setOTokens] = useState<SubgraphOToken[]>([])
  const [action, setAction] = useState<TradeAction>(TradeAction.Buy)

  const [showBoth, setShowBoth] = useState(getPreference(SHOW_BOTH_KEY, 'false') === 'true')
  const [showMyOrder, setShowMyOrder] = useState(getPreference(SHOW_MINE_KEY, 'false') === 'true')

  const [mintPanelOpened, setMintPanelOpened] = useState(false)

  const spotPrice = useTokenPrice(selectedUnderlying.id, 10)

  return (
    <>
      <TradeHeader setOTokens={setOTokens} setSelectedUnderlying={setSelectedUnderlying} />
      <Board
        spotPrice={spotPrice}
        oTokens={oTokens}
        selectedOToken={selectedOToken}
        setSelectedOToken={setSelectedOToken}
      />
      <div style={{ display: 'flex', paddingTop: '15px' }}>
        <div style={{ width: '30%' }}>
          <Orderbook selectedOToken={selectedOToken} action={action} showBoth={showBoth} />
          {showMyOrder && <UserOrders selectedOToken={selectedOToken} />}
          <BoxPreference
            action={action}
            showBoth={showBoth}
            setShowBoth={setShowBoth}
            showMine={showMyOrder}
            setShowMine={setShowMyOrder}
          />
        </div>
        <div style={{ paddingLeft: '15px', width: '70%' }}>
          <TradePanel selectedOToken={selectedOToken} action={action} setAction={setAction} />
        </div>
      </div>
      <MintPanel oToken={selectedOToken} opened={mintPanelOpened} onClose={() => setMintPanelOpened(false)} />
    </>
  )
}
