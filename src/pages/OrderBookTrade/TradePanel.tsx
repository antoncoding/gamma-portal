import React, { useMemo, useState, useCallback, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { Box, Button, TextInput, Split, IconArrowRight } from '@aragon/ui'
import { SubgraphOToken, SignedOrder, OTokenOrderBook } from '../../types'

import { calculateOrderInput, calculateOrderOutput } from '../../utils/0x-utils'
import { toTokenAmount, fromTokenAmount } from '../../utils/math'

import { TradeAction, MarketTypes, Errors } from '../../constants'
import { simplifyOTokenSymbol } from '../../utils/others'

import { useConnectedWallet } from '../../contexts/wallet'

import { getUSDC } from '../../constants/addresses'

import oETHIcon from '../../imgs/oETH.svg'
import USDCIcon from '../../imgs/USDC.png'
import { useOrderbook } from '../../contexts/orderbook'

type TradeDetailProps = {
  selectedOToken: SubgraphOToken | null
  action: TradeAction
  setAction: any
}

export default function TradePanel({ selectedOToken, action, setAction }: TradeDetailProps) {
  const [marketType, setMarketType] = useState(MarketTypes.Market)

  const titleText = useMemo(
    () =>
      `${action === TradeAction.Buy ? 'Buy' : 'Sell'} ${
        selectedOToken ? simplifyOTokenSymbol(selectedOToken?.symbol) : 'oToken'
      }`,
    [selectedOToken, action],
  )

  return (
    <Box heading={titleText}>
      <Split
        primary={
          selectedOToken === null ? (
            <> </>
          ) : marketType === MarketTypes.Market ? (
            <MarketTicket action={action} selectedOToken={selectedOToken} />
          ) : (
            <> </>
          )
        }
        secondary={
          <TradeType action={action} setAction={setAction} setMarketType={setMarketType} marketType={marketType} />
        }
      />
    </Box>
  )
}

type MarketTicketProps = {
  action
  selectedOToken: SubgraphOToken
}

function MarketTicket({ action, selectedOToken }: MarketTicketProps) {
  const { networkId } = useConnectedWallet()

  const paymentToken = useMemo(() => getUSDC(networkId), [networkId])

  const [error, setError] = useState(Errors.NO_ERROR)

  const [ordersToFill, setOrdersToFill] = useState<SignedOrder[]>([])
  const [amountsToFill, setAmountsToFill] = useState<BigNumber[]>([])

  const [inputTokenAmount, setInputTokenAmount] = useState(new BigNumber(0))
  const [outputTokenAmount, setOutputTokenAmount] = useState(new BigNumber(0))

  const { orderbooks } = useOrderbook()

  const orderbookForThisToken = useMemo(() => orderbooks.find(b => b.id === selectedOToken.id) as OTokenOrderBook, [
    orderbooks,
    selectedOToken.id,
  ])

  const inputToken = useMemo(() => (action === TradeAction.Buy ? paymentToken : selectedOToken), [
    paymentToken,
    selectedOToken,
    action,
  ])

  const inputIcon = useMemo(
    () => <img alt="inputtoken" width={25} src={action === TradeAction.Buy ? USDCIcon : oETHIcon} />,
    [action],
  )

  const outputToken = useMemo(() => (action === TradeAction.Buy ? selectedOToken : paymentToken), [
    paymentToken,
    selectedOToken,
    action,
  ])

  const outputIcon = useMemo(
    () => <img alt="outputtoken" width={25} src={action === TradeAction.Buy ? oETHIcon : USDCIcon} />,
    [action],
  )

  // when buy/sell is click, reset a few things
  useEffect(() => {
    setOrdersToFill([])
    setAmountsToFill([])
    setError(Errors.NO_ERROR)
    setInputTokenAmount(new BigNumber(0))
    setOutputTokenAmount(new BigNumber(0))
  }, [action])

  const handleInputChange = useCallback(
    event => {
      try {
        const newAmount = new BigNumber(event.target.value)
        const orders = action === TradeAction.Buy ? orderbookForThisToken.asks : orderbookForThisToken.bids
        setInputTokenAmount(newAmount)
        const rawInputAmount = fromTokenAmount(newAmount, inputToken.decimals)

        const { error, ordersToFill, amounts, sumOutput: rawOutput } = calculateOrderOutput(orders, rawInputAmount)
        const outputTokenAmount = toTokenAmount(rawOutput, outputToken.decimals)
        setOutputTokenAmount(outputTokenAmount)
        setError(error)
        setAmountsToFill(amounts)
        setOrdersToFill(ordersToFill)
      } catch {}
    },
    [inputToken, setInputTokenAmount, orderbookForThisToken, action, outputToken.decimals],
  )

  const handleOuputChange = useCallback(
    event => {
      try {
        const newAmount = new BigNumber(event.target.value)
        const orders = action === TradeAction.Buy ? orderbookForThisToken.asks : orderbookForThisToken.bids
        setOutputTokenAmount(newAmount)
        const rawOutputAmount = fromTokenAmount(newAmount, outputToken.decimals)

        const { error, ordersToFill, amounts, sumInput: rawInput } = calculateOrderInput(orders, rawOutputAmount)
        const inputTokenAmount = toTokenAmount(rawInput, inputToken.decimals)
        setInputTokenAmount(inputTokenAmount)
        setError(error)
        setAmountsToFill(amounts)
        setOrdersToFill(ordersToFill)
      } catch {}
    },
    [inputToken, setInputTokenAmount, orderbookForThisToken, action, outputToken.decimals],
  )

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <TextInput
          type="number"
          adornment={inputIcon}
          adornmentPosition="end"
          value={inputTokenAmount.toNumber()}
          onChange={handleInputChange}
        />
      </div>
      <div style={{ padding: '5px' }}>
        <IconArrowRight size="medium" />
      </div>
      <div>
        <TextInput
          type="number"
          adornment={outputIcon}
          adornmentPosition="end"
          value={outputTokenAmount.toFixed()}
          onChange={handleOuputChange}
        />
      </div>
    </div>
  )
}

type TradeTypeProps = {
  action: TradeAction
  setAction: any
  marketType: MarketTypes
  setMarketType: any
}

function TradeType({ action, setAction, marketType, setMarketType }: TradeTypeProps) {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ paddingRight: '20', display: 'flex', marginRight: 0, marginLeft: 'auto' }}>
        <Button
          label={action === TradeAction.Buy ? 'Buy' : 'Sell'}
          mode={action === TradeAction.Buy ? 'positive' : 'negative'}
          onClick={() => (action === TradeAction.Buy ? setAction(TradeAction.Sell) : setAction(TradeAction.Buy))}
        />

        <div style={{ paddingRight: '15px' }}>
          <Button
            label={marketType === MarketTypes.Market ? 'Market' : 'Limit'}
            onClick={() =>
              marketType === MarketTypes.Market ? setMarketType(MarketTypes.Limit) : setMarketType(MarketTypes.Market)
            }
          />
        </div>
      </div>
    </div>
  )
}
