import React, { useContext } from 'react'

import { OTokenOrderBook } from '../types'
import { use0xOrderBooks, useLiveOTokens } from '../hooks'

type zeroXContextProps = {
  orderbooks: OTokenOrderBook[]
  isLoading: boolean
}

const initialContext = {
  orderbooks: [],
  isLoading: false,
}

const zeroXContext = React.createContext<zeroXContextProps>(initialContext)
const useOrderbook = () => useContext(zeroXContext)

const OrderbookProvider = ({ children }) => {
  const { allOtokens: oTokens, isLoading: isLoadingOTokens } = useLiveOTokens()
  const { orderbooks, isLoading: isLoadingOrderBook } = use0xOrderBooks(oTokens)

  return (
    <zeroXContext.Provider
      value={{
        orderbooks,
        isLoading: isLoadingOrderBook || isLoadingOTokens,
      }}
    >
      {children}
    </zeroXContext.Provider>
  )
}

export { OrderbookProvider, useOrderbook }
