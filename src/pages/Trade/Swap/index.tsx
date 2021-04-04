import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Col, Row } from 'react-grid-system'
import ReactGA from 'react-ga'
import { SyncIndicator } from '@aragon/ui'
import TradePanel from '../OrderBookTrade/TradePanel'

import { TradeAction } from '../../../constants'
import { useLiveOTokens } from '../../../hooks'
import { SubgraphOToken } from '../../../types'
import { useOrderbook } from '../../../contexts/orderbook'
import OTokenAutoComplete from '../../../components/OTokenAutoComplete'
import { Header } from '../../../components/Header'

export default function Swap() {
  useEffect(() => {
    ReactGA.pageview('trade/swap/')
  }, [])

  const history = useHistory()

  const { otoken } = useParams()

  const { allOtokens, isLoading } = useLiveOTokens()

  const [selectedOToken, setSelectedOToken] = useState<null | SubgraphOToken>(null)

  useEffect(() => {
    const token = allOtokens.find(o => o.id === otoken)
    setSelectedOToken(token ? token : null)
  }, [allOtokens, otoken])

  useEffect(() => {
    if (selectedOToken) history.push(`/trade/swap/${selectedOToken.id}`)
  }, [selectedOToken, history])

  const [action, setAction] = useState(TradeAction.Buy)

  const { isLoading: loadingOrderbook } = useOrderbook()

  return (
    <>
      <Header primary={'Swap'} />
      <Row>
        <Col lg={4} md={6} sm={12}>
          <OTokenAutoComplete
            oTokens={allOtokens}
            selectedOToken={selectedOToken}
            setSelectedOToken={setSelectedOToken}
          />
        </Col>
      </Row>
      <br />
      <TradePanel selectedOToken={selectedOToken} action={action} setAction={setAction} />
      <SyncIndicator visible={isLoading || loadingOrderbook} children={'Syncing order book... 🍕'} />
    </>
  )
}
