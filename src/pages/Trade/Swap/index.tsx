import React, { useState, useMemo, useEffect } from 'react'
import ReactGA from 'react-ga'
import { Header, _AutoComplete as AutoComplete, SyncIndicator } from '@aragon/ui'
import TradePanel from '../OrderBookTrade/TradePanel'

// import Header from '../OrderBookTrade/Header'
import { TradeAction } from '../../../constants'
import { useLiveOTokens } from '../../../hooks'
import { SubgraphOToken } from '../../../types'
import { simplifyOTokenSymbol } from '../../../utils/others'
import { useOrderbook } from '../../../contexts/orderbook'

export default function Swap() {
  useEffect(() => {
    ReactGA.pageview('trade/swap/')
  })

  const [searchTerm, setSearchTerm] = useState('')

  const [selectedOToken, setSelectedOToken] = useState<null | SubgraphOToken>(null)

  const [action, setAction] = useState(TradeAction.Buy)

  const { allOtokens, isLoading } = useLiveOTokens()
  const { isLoading: loadingOrderbook } = useOrderbook()

  const symbols = useMemo(() => allOtokens.map(o => simplifyOTokenSymbol(o.symbol)), [allOtokens])

  return (
    <>
      <Header primary={'Swap'} />
      <div style={{ width: '20%', minWidth: '200', paddingBottom: '10px' }}>
        <AutoComplete
          items={symbols.filter(name => searchTerm && name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)}
          onChange={setSearchTerm}
          onSelect={(value: string) => {
            setSearchTerm(value)
            setSelectedOToken(allOtokens.find(o => simplifyOTokenSymbol(o.symbol) === value) as SubgraphOToken)
          }}
          wide
          value={searchTerm ? searchTerm : selectedOToken ? simplifyOTokenSymbol(selectedOToken?.symbol) : ''}
          placeholder="Search 01JAN21 or 800P"
        />
      </div>
      <TradePanel selectedOToken={selectedOToken} action={action} setAction={setAction} />
      <SyncIndicator visible={isLoading || loadingOrderbook} children={'Syncing order book... 🍕'} />
    </>
  )
}
