import { useEffect, useState, useMemo } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { ZeroXEndpoint, OrderType } from '../constants'
import { useConnectedWallet } from '../contexts/wallet'
import { OrderWithMetaData, SubgraphOToken, OTokenOrderBook } from '../types'
import { categorizeOrder, getBasePairAskAndBids, sortBids, sortAsks, isValid } from '../utils/0x-utils'

export function use0xOrderBooks(oTokens: SubgraphOToken[], completeCallback?: any) {
  const { networkId } = useConnectedWallet()

  const wsUrl = useMemo(() => ZeroXEndpoint[networkId].ws, [networkId])

  const [isLoading, setIsLoading] = useState(true)

  const [orderBooksBasic, setOrderBooksBasic] = useState<OTokenOrderBook[]>([])

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    wsUrl,
    {
      share: true,
      onError: event => {
        console.log(event)
      },
      shouldReconnect: closeEvent => true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
    },
    true,
  )

  // fetch initial bids and asks when oTokens are ready
  useEffect(() => {
    async function refreshOrders() {
      if (oTokens.length === 0) return []
      setIsLoading(true)
      const result = await getBasePairAskAndBids(oTokens, networkId)
      setIsLoading(false)
      if (typeof completeCallback === 'function') completeCallback()
      return result
    }
    refreshOrders().then((orders: OTokenOrderBook[]) => {
      setOrderBooksBasic(orders)
    })
  }, [oTokens, networkId, completeCallback])

  useEffect(() => {
    // subscribe to order changes
    if (readyState === ReadyState.OPEN) return
    const config = JSON.stringify({
      type: 'subscribe',
      channel: 'orders',
      requestId: Date.now().toString(),
    })
    sendMessage(config)
  }, [readyState, sendMessage])

  // filter out invalid orders every 5 sec
  useEffect(() => {
    const interval = setInterval(() => {
      const orderBooksCopy = [...orderBooksBasic]
      for (let orderbook of orderBooksCopy) {
        // const { bids, asks } = orderbook
        orderbook.bids = orderbook.bids.filter(order => isValid(order))
        orderbook.asks = orderbook.asks.filter(order => isValid(order))
      }
      setOrderBooksBasic([...orderBooksCopy])
    }, 5000)
    return () => clearInterval(interval)
  }, [orderBooksBasic])

  const [lastUpdatedMsg, setLastUpdatedMsg] = useState<any>(null)

  // update bids and asks array when receive new orders
  useEffect(() => {
    if (!lastMessage || !lastMessage.data) return
    if (lastMessage === lastUpdatedMsg) return

    const orderbooksCopy = [...orderBooksBasic]

    const data = JSON.parse(lastMessage.data)
    const orders: OrderWithMetaData[] = data.payload
    let hasOTokenOrder = false
    const otokenAddrs = oTokens.map(token => token.id)
    for (const orderInfo of orders) {
      const { type, token } = categorizeOrder(networkId, otokenAddrs, orderInfo)
      if (type === OrderType.BID) {
        // const otoken = oTokens.find(o => o.id === token);
        // console.log(`token ${otoken?.symbol} Bid coming in ${JSON.stringify(orderInfo)} `);
        hasOTokenOrder = true
        const orderBookForThisOToken = orderbooksCopy.find(ob => ob.id === token)
        if (orderBookForThisOToken) {
          const bids = orderBookForThisOToken.bids
          const existingBidIdx = bids.findIndex(bid => bid.metaData.orderHash === orderInfo.metaData.orderHash)
          if (existingBidIdx !== -1) {
            orderBookForThisOToken.bids[existingBidIdx] = orderInfo
          } else {
            orderBookForThisOToken.bids.push(orderInfo)
            orderBookForThisOToken.bids = orderBookForThisOToken.bids.sort(sortBids)
          }
          orderBookForThisOToken.bids = orderBookForThisOToken.bids.filter(isValid)
        } else {
          // no orderbook for this oToken
          if (orderInfo.metaData.remainingFillableTakerAssetAmount !== '0') {
            const bids = [orderInfo]
            orderbooksCopy.push({ bids, asks: [], id: token })
          }
        }
      } else if (type === OrderType.ASK) {
        // const otoken = oTokens.find(o => o.id === token);
        // console.log(`token ${otoken?.symbol} Ask coming in ${JSON.stringify(orderInfo)} `);
        hasOTokenOrder = true
        const orderBookForThisOToken = orderbooksCopy.find(ob => ob.id === token)
        if (orderBookForThisOToken) {
          const asks = orderBookForThisOToken.asks
          const existingAskIdx = asks.findIndex(ask => ask.metaData.orderHash === orderInfo.metaData.orderHash)
          if (existingAskIdx !== -1) {
            orderBookForThisOToken.asks[existingAskIdx] = orderInfo
          } else {
            orderBookForThisOToken.asks.push(orderInfo)
            orderBookForThisOToken.asks = orderBookForThisOToken.asks.sort(sortAsks)
          }
          orderBookForThisOToken.asks = orderBookForThisOToken.asks.filter(isValid)
        } else {
          // no orderbook for this oToken
          if (orderInfo.metaData.remainingFillableTakerAssetAmount !== '0') {
            const asks = [orderInfo]
            orderbooksCopy.push({ asks, bids: [], id: token })
          }
        }
      }
    }
    setLastUpdatedMsg(lastMessage)
    if (hasOTokenOrder) setOrderBooksBasic(orderbooksCopy)
  }, [lastUpdatedMsg, lastMessage, orderBooksBasic, oTokens, networkId])

  return { orderBooks: orderBooksBasic, isLoading }
}
