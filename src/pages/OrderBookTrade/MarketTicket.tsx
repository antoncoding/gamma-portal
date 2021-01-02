import React, { useMemo, useState, useCallback, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { Button, TextInput, IconArrowRight } from '@aragon/ui'
import { SubgraphOToken, SignedOrder } from '../../types'

import { calculateOrderInput, calculateOrderOutput } from '../../utils/0x-utils'
import { toTokenAmount, fromTokenAmount } from '../../utils/math'

import { TradeAction, Errors } from '../../constants'

import { useConnectedWallet } from '../../contexts/wallet'

import { getUSDC, addresses } from '../../constants/addresses'

import oETHIcon from '../../imgs/oETH.svg'
import USDCIcon from '../../imgs/USDC.png'
import { useOrderbook } from '../../contexts/orderbook'
import { use0xExchange } from '../../hooks/use0xExchange'
import LabelText from '../../components/LabelText'
import { useUserAllowance } from '../../hooks/useAllowance'

enum Updates {
  Input,
  Output,
}

type MarketTicketProps = {
  action: TradeAction
  selectedOToken: SubgraphOToken
}

export default function MarketTicket({ action, selectedOToken }: MarketTicketProps) {
  const { networkId } = useConnectedWallet()

  const paymentToken = useMemo(() => getUSDC(networkId), [networkId])

  const { fillOrders, getProtocolFee } = use0xExchange()

  // what was the last amount user adjust
  const [lastUpdate, setLastUpdate] = useState<Updates>(Updates.Input)

  const [error, setError] = useState(Errors.NO_ERROR)

  const [ordersToFill, setOrdersToFill] = useState<SignedOrder[]>([])
  const [amountsToFill, setAmountsToFill] = useState<BigNumber[]>([])

  const [inputTokenAmount, setInputTokenAmount] = useState(new BigNumber(0))
  const [outputTokenAmount, setOutputTokenAmount] = useState(new BigNumber(0))

  const { orderbooks } = useOrderbook()

  const { id, bids, asks } = useMemo(() => {
    const target = orderbooks.find(b => b.id === selectedOToken.id)
    return target ? target : { id: '', bids: [], asks: [] }
  }, [orderbooks, selectedOToken.id])

  const inputToken = useMemo(() => (action === TradeAction.Buy ? paymentToken : selectedOToken), [
    paymentToken,
    selectedOToken,
    action,
  ])

  const { allowance } = useUserAllowance(inputToken.id, addresses[networkId].zeroxERCProxy)

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

  const protocolFee = useMemo(() => {
    return getProtocolFee(ordersToFill.length)
  }, [getProtocolFee, ordersToFill])

  // when buy/sell is click, reset a few things
  useEffect(() => {
    setOrdersToFill([])
    setAmountsToFill([])
    setError(Errors.NO_ERROR)
    setInputTokenAmount(new BigNumber(0))
    setOutputTokenAmount(new BigNumber(0))
  }, [action])

  const handleInputChange = useCallback(event => {
    try {
      const newAmount = new BigNumber(event.target.value)
      setInputTokenAmount(newAmount)
    } catch {}
  }, [])

  const handleOuputChange = useCallback(event => {
    try {
      const newAmount = new BigNumber(event.target.value)
      setOutputTokenAmount(newAmount)
      setLastUpdate(Updates.Output)
    } catch {}
  }, [])

  // update numbers accordingly when 1. orderbook change, 2. user update either intput or output
  useEffect(() => {
    if (id === '') return
    if (lastUpdate !== Updates.Input) return
    // fix input, recalculate output
    const orders = action === TradeAction.Buy ? asks : bids
    const rawInputAmount = fromTokenAmount(inputTokenAmount, inputToken.decimals)

    const { error, ordersToFill, amounts, sumOutput: rawOutput } = calculateOrderOutput(orders, rawInputAmount)
    const outputTokenAmount = toTokenAmount(rawOutput, outputToken.decimals)
    setOutputTokenAmount(outputTokenAmount)
    setError(error)
    setAmountsToFill(amounts)
    setOrdersToFill(ordersToFill)
  }, [asks, bids, inputTokenAmount, inputToken, outputToken, action, lastUpdate, id])

  // triggered when output token amount is updaed
  useEffect(() => {
    if (!id) return
    if (lastUpdate !== Updates.Output) return
    const orders = action === TradeAction.Buy ? asks : bids
    const rawOutputAmount = fromTokenAmount(outputTokenAmount, outputToken.decimals)

    const { error, ordersToFill, amounts, sumInput: rawInput } = calculateOrderInput(orders, rawOutputAmount)
    const inputTokenAmount = toTokenAmount(rawInput, inputToken.decimals)
    setInputTokenAmount(inputTokenAmount)
    setError(error)
    setAmountsToFill(amounts)
    setOrdersToFill(ordersToFill)
  }, [id, action, inputToken.decimals, lastUpdate, asks, bids, outputToken.decimals, outputTokenAmount])

  const fill = useCallback(async () => {
    await fillOrders(ordersToFill, amountsToFill)
  }, [fillOrders, ordersToFill, amountsToFill])

  return (
    <>
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
      <div style={{ display: 'flex', paddingTop: '10px' }}>
        <LabelText label="Protocol Fee" />
        {protocolFee.toString()} ETH
      </div>
      <div style={{ display: 'flex', paddingTop: '10px' }}>
        <Button
          label={action === TradeAction.Buy ? 'Confirm Buy' : 'Confirm Sell'}
          mode={action === TradeAction.Buy ? 'positive' : 'negative'}
          onClick={fill}
        />
      </div>
    </>
  )
}
