import React, { useState, useEffect } from 'react'
import ReactGA from 'react-ga'
import { Col, Row } from 'react-grid-system'
import TradeHeader from './Header'
import OptionChain from './OptionChain'
import MintPanel from './MintPanel'
import Orderbook from './Orderbook'
import UserOrders from './UserOrders'
import TradePanel from './TradePanel'
import PriceChart from './PriceChart'

import CheckBoxWithLabel from '../../../components/CheckBoxWithLabel'
import { SubgraphOToken } from '../../../types'
import { TradeAction, SHOW_MINE_KEY, OC_MODE_KEY, OptionChainMode, eth } from '../../../constants'
import { useTokenPrice } from '../../../hooks'
import { getPreference } from '../../../utils/storage'

export default function TradePage() {
  useEffect(() => {
    ReactGA.pageview('trade/orderbook/')
  }, [])
  const [selectedUnderlying, setSelectedUnderlying] = useState(eth)
  const [selectedOToken, setSelectedOToken] = useState<SubgraphOToken | null>(null)
  const [oTokens, setOTokens] = useState<SubgraphOToken[]>([])
  const [action, setAction] = useState<TradeAction>(TradeAction.Buy)

  const [showMyOrder, setShowMyOrder] = useState(getPreference(SHOW_MINE_KEY, 'false') === 'true')
  const [optionChainMode, setOptionChainMode] = useState<OptionChainMode>(
    getPreference(OC_MODE_KEY, OptionChainMode.All) as OptionChainMode,
  )
  const [mintPanelOpened, setMintPanelOpened] = useState(false)

  const spotPrice = useTokenPrice(selectedUnderlying.id, 10)

  return (
    <>
      <TradeHeader
        underlying={selectedUnderlying}
        spotPrice={spotPrice}
        setOTokens={setOTokens}
        setSelectedUnderlying={setSelectedUnderlying}
        optionChainMode={optionChainMode}
        setOptionChainMode={setOptionChainMode}
      />
      <OptionChain
        mode={optionChainMode}
        spotPrice={spotPrice}
        oTokens={oTokens}
        selectedOToken={selectedOToken}
        setSelectedOToken={setSelectedOToken}
      />
      <Row style={{ display: 'flex', paddingTop: '15px' }}>
        <Col sm={12} md={4}>
          <Orderbook selectedOToken={selectedOToken} action={action} />
          {showMyOrder && <UserOrders selectedOToken={selectedOToken} />}
          <div style={{ display: 'flex' }}>
            <CheckBoxWithLabel
              checked={showMyOrder}
              setChecked={setShowMyOrder}
              storageKey={SHOW_MINE_KEY}
              label={`Show My Orders`}
            />
          </div>
        </Col>
        <Col sm={12} md={8}>
          <TradePanel compact={true} selectedOToken={selectedOToken} action={action} setAction={setAction} />
          {selectedOToken && <PriceChart selectedOToken={selectedOToken} />}
        </Col>
      </Row>
      <MintPanel oToken={selectedOToken} opened={mintPanelOpened} onClose={() => setMintPanelOpened(false)} />
    </>
  )
}
