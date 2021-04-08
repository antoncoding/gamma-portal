import React, { useState, useEffect } from 'react'
import { Info } from '@aragon/ui'
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
import { TradeAction, SHOW_MINE_KEY, OC_MODE_KEY, TRADE_ACTION_KEY, OptionChainMode, eth, SupportedNetworks } from '../../../constants'
import { useTokenPrice } from '../../../hooks'
import { getPreference, storePreference } from '../../../utils/storage'
import { useConnectedWallet } from '../../../contexts/wallet'

export default function TradePage() {
  useEffect(() => {
    ReactGA.pageview('trade/orderbook/')
  }, [])
  const [selectedUnderlying, setSelectedUnderlying] = useState(eth)
  const [selectedOToken, setSelectedOToken] = useState<SubgraphOToken | null>(null)
  const [oTokens, setOTokens] = useState<SubgraphOToken[]>([])
  const [action, setAction] = useState<TradeAction>(getPreference(TRADE_ACTION_KEY, TradeAction.Buy) as TradeAction)

  const [showMyOrder, setShowMyOrder] = useState(getPreference(SHOW_MINE_KEY, 'false') === 'true')
  const [optionChainMode, setOptionChainMode] = useState<OptionChainMode>(
    getPreference(OC_MODE_KEY, OptionChainMode.All) as OptionChainMode,
  )
  const { networkId } = useConnectedWallet()
  const [mintPanelOpened, setMintPanelOpened] = useState(false)

  const spotPrice = useTokenPrice(selectedUnderlying.id, 10)

  return networkId === SupportedNetworks.Kovan ? (
    <Info mode="error"> 0x V4 doesn't support kovan testnet, please switch network to Ropsten </Info>
  ) : (
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
          <TradePanel
            compact={true}
            selectedOToken={selectedOToken}
            action={action}
            setAction={(action: TradeAction) => {
              setAction(action)
              storePreference(TRADE_ACTION_KEY, action)
            }}
          />
          {selectedOToken && <PriceChart selectedOToken={selectedOToken} />}
        </Col>
      </Row>
      <MintPanel oToken={selectedOToken} opened={mintPanelOpened} onClose={() => setMintPanelOpened(false)} />
    </>
  )
}
