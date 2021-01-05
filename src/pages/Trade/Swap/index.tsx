import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import ReactGA from 'react-ga'
import { Header, SyncIndicator } from '@aragon/ui'
import TradePanel from '../OrderBookTrade/TradePanel'

import { TradeAction } from '../../../constants'
import { useLiveOTokens } from '../../../hooks'
import { SubgraphOToken } from '../../../types'
import { useOrderbook } from '../../../contexts/orderbook'
import OTokenAutoComplete from '../../../components/OTokenAutoComplete'

export default function Swap() {
  useEffect(() => {
    ReactGA.pageview('trade/swap/')
  })

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
      <div style={{ width: '20%', minWidth: '200', paddingBottom: '10px' }}>
        <OTokenAutoComplete
          oTokens={allOtokens}
          selectedOToken={selectedOToken}
          setSelectedOToken={setSelectedOToken}
        />
      </div>
      <TradePanel selectedOToken={selectedOToken} action={action} setAction={setAction} />
      <SyncIndicator visible={isLoading || loadingOrderbook} children={'Syncing order book... 🍕'} />
    </>
  )
}
