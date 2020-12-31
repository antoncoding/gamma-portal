import React, { useContext, useCallback } from 'react'
import BigNumber from 'bignumber.js'

import { OTokenOrderBook } from '../types'
import { useGasPrice } from '../hooks/useGasPrice'
import { use0xOrderBooks, useLiveOTokens } from '../hooks'

const FEE_PERORDER_PER_GWEI = 0.00007

type zeroXContextProps = {
  getProtocolFee: (numbOfOrders: number) => BigNumber
  orderBooks: OTokenOrderBook[]
  isLoading: boolean
}

const initialContext = {
  getProtocolFee: (num: number) => new BigNumber(30).times(num).times(FEE_PERORDER_PER_GWEI),
  orderBooks: [],
  isLoading: false,
}

const zeroXContext = React.createContext<zeroXContextProps>(initialContext)
const useOrderbook = () => useContext(zeroXContext)

const OrderbookProvider = ({ children }) => {
  const { fast } = useGasPrice(10)

  const { allOtokens: oTokens, isLoading: isLoadingOTokens } = useLiveOTokens()
  const { orderBooks, isLoading: isLoadingOrderBook } = use0xOrderBooks(oTokens)

  const getProtocolFee = useCallback(
    (numOfOrders: number) => {
      return fast.times(new BigNumber(numOfOrders)).times(FEE_PERORDER_PER_GWEI)
    },
    [fast],
  )

  return (
    <zeroXContext.Provider
      value={{
        orderBooks,
        isLoading: isLoadingOrderBook || isLoadingOTokens,
        getProtocolFee,
      }}
    >
      {children}
    </zeroXContext.Provider>
  )
}

export { OrderbookProvider, useOrderbook }
