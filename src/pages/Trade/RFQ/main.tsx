import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { Row, Col } from 'react-grid-system'
import BigNumber from 'bignumber.js'
import { Button, TextInput, IconArrowRight, IconUnlock, Timer, LoadingRing } from '@aragon/ui'

import { SubgraphOToken, OTokenBalance, IndicativeQuote } from '../../../types'
import { toTokenAmount, fromTokenAmount } from '../../../utils/math'
import { TradeAction, Errors, Spenders } from '../../../constants'
import { useConnectedWallet } from '../../../contexts/wallet'
import { getPrimaryPaymentToken } from '../../../constants/addresses'
import OTokenIcon from '../../../components/OTokenIcon'
import USDCImgUrl from '../../../imgs/USDC.png'
import { use0xExchange } from '../../../hooks/use0xExchange'
import { useRFQ } from '../../../hooks/useRFQ'
import { useUserAllowance } from '../../../hooks/useAllowance'
import { simplifyOTokenSymbol } from '../../../utils/others'
import WarningText from '../../../components/Warning'
import LabelText from '../../../components/LabelText'
import TokenBalanceEntry from '../../../components/TokenBalanceEntry'

enum Updates {
  Input,
  Output,
}

type MarketTicketProps = {
  action: TradeAction
  selectedOToken: SubgraphOToken
  oTokenBalances: OTokenBalance[] | null
  usdBalance: BigNumber
  wethBalance: BigNumber
  inputTokenAmount: BigNumber
  setInputTokenAmount: React.Dispatch<React.SetStateAction<BigNumber>>
  outputTokenAmount: BigNumber
  setOutputTokenAmount: React.Dispatch<React.SetStateAction<BigNumber>>
}

export default function RFQMain({
  action,
  selectedOToken,
  oTokenBalances,
  usdBalance,
  // wethBalance,
  inputTokenAmount,
  setInputTokenAmount,
  outputTokenAmount,
  setOutputTokenAmount,
}: MarketTicketProps) {
  const { networkId } = useConnectedWallet()

  const paymentToken = useMemo(() => getPrimaryPaymentToken(networkId), [networkId])

  const [isFinalized, setIsFinalized] = useState(false)
  const [isFilling, setIsFilling] = useState(false)

  const { fillRFQOrder } = use0xExchange()

  // what was the last amount user adjust
  const [lastUpdate, setLastUpdate] = useState<Updates>(Updates.Input)

  const [error, setError] = useState(Errors.NO_ERROR)

  const oTokenBalance = useMemo(
    () => oTokenBalances?.find(b => b.token.id === selectedOToken.id)?.balance ?? new BigNumber(0),
    [oTokenBalances, selectedOToken],
  )

  const inputToken = useMemo(() => (action === TradeAction.Buy ? paymentToken : selectedOToken), [
    paymentToken,
    selectedOToken,
    action,
  ])

  const outputToken = useMemo(() => (action === TradeAction.Buy ? selectedOToken : paymentToken), [
    paymentToken,
    selectedOToken,
    action,
  ])

  const [needApprove, setNeedApprove] = useState(true)
  const [isApproving, setIsApproving] = useState(false)

  const { allowance: usdcAllowance, approve: approveUSDC } = useUserAllowance(paymentToken.id, Spenders.ZeroXExchange)
  const { allowance: oTokenAllowance, approve: approveOToken } = useUserAllowance(
    selectedOToken.id,
    Spenders.ZeroXExchange,
  )

  const approve = useCallback(async () => {
    setIsApproving(true)
    const rawInputAmount = fromTokenAmount(inputTokenAmount, inputToken.decimals)
    if (action === TradeAction.Buy) await approveUSDC(rawInputAmount)
    else await approveOToken(rawInputAmount)
    setIsApproving(false)
  }, [inputTokenAmount, inputToken, action, approveUSDC, approveOToken])

  const inputIcon = useMemo(
    () =>
      action === TradeAction.Buy ? (
        <img alt="inputtoken" width={25} src={USDCImgUrl} />
      ) : (
        <OTokenIcon otoken={selectedOToken} width={25} />
      ),
    [action, selectedOToken],
  )

  const outputIcon = useMemo(
    () =>
      action === TradeAction.Buy ? (
        <OTokenIcon otoken={selectedOToken} width={25} />
      ) : (
        <img alt="outputtoken" width={25} src={USDCImgUrl} />
      ),
    [action, selectedOToken],
  )

  const protocolFee = useMemo(() => {
    return new BigNumber(0)
  }, [])

  const {
    rfqOrder,
    indicativeQuote,
    isRequestingFirm,
    isRequestingIndicative,
    requestFirmQuote,
    requestIndicativeQuote,
  } = useRFQ(
    action === TradeAction.Buy ? selectedOToken : paymentToken,
    action === TradeAction.Buy ? paymentToken : selectedOToken,
    action,
  )

  const handleInputChange = useCallback(
    event => {
      try {
        const newAmount = new BigNumber(event.target.value)
        setInputTokenAmount(newAmount)
        setLastUpdate(Updates.Input)
      } catch {}
    },
    [setInputTokenAmount],
  )

  const handleOuputChange = useCallback(
    event => {
      try {
        const newAmount = new BigNumber(event.target.value)
        setOutputTokenAmount(newAmount)
        setLastUpdate(Updates.Output)
      } catch {}
    },
    [setOutputTokenAmount],
  )

  const price = useMemo(() => {
    if (action === TradeAction.Sell) {
      return inputTokenAmount.isZero() || inputTokenAmount.isNaN()
        ? new BigNumber(0)
        : outputTokenAmount.div(inputTokenAmount)
    } else {
      return outputTokenAmount.isZero() || outputTokenAmount.isNaN()
        ? new BigNumber(0)
        : inputTokenAmount.div(outputTokenAmount)
    }
  }, [inputTokenAmount, action, outputTokenAmount])

  // refetch indicative quote upon input change
  useEffect(() => {
    if (lastUpdate !== Updates.Input) return
    // fix input, recalculate output
    const rawInputAmount = fromTokenAmount(inputTokenAmount, inputToken.decimals).integerValue().toString()
    requestIndicativeQuote(undefined, rawInputAmount)
  }, [inputTokenAmount, inputToken, requestIndicativeQuote, lastUpdate])

  useEffect(() => {
    if (lastUpdate !== Updates.Output) return
    // fix output, update input
    const rawOutputAmount = fromTokenAmount(outputTokenAmount, outputToken.decimals).integerValue().toString()
    requestIndicativeQuote(rawOutputAmount, undefined)
  }, [outputToken, requestIndicativeQuote, lastUpdate, outputTokenAmount])

  useEffect(() => {
    if (error !== Errors.NO_ERROR && error !== Errors.INSUFFICIENT_BALANCE) return
    const inputBalance = action === TradeAction.Buy ? usdBalance : oTokenBalance
    const rawInputAmount = fromTokenAmount(inputTokenAmount, inputToken.decimals).integerValue()
    if (rawInputAmount.gt(inputBalance)) setError(Errors.INSUFFICIENT_BALANCE)
    else if (error === Errors.INSUFFICIENT_BALANCE) setError(Errors.NO_ERROR)
  }, [usdBalance, oTokenBalance, inputToken, inputTokenAmount, action, error])

  // update input / output box when indicativeQuote updated
  useEffect(() => {
    if (lastUpdate !== Updates.Output) return
    if (!indicativeQuote) return
    if (isFinalized && !rfqOrder) return
    const quote = (isFinalized ? rfqOrder : indicativeQuote) as IndicativeQuote
    // update input
    const rawOutputAmount = fromTokenAmount(outputTokenAmount, outputToken.decimals).integerValue().toString()
    if (rawOutputAmount === quote.makerAmount) {
      const takerAmount = toTokenAmount(quote.takerAmount, inputToken.decimals)
      setInputTokenAmount(takerAmount)
    }
  }, [
    isFinalized,
    rfqOrder,
    indicativeQuote,
    lastUpdate,
    inputToken.decimals,
    outputToken.decimals,
    outputTokenAmount,
    setInputTokenAmount,
  ])

  useEffect(() => {
    if (lastUpdate !== Updates.Input) return
    if (!indicativeQuote) return
    if (isFinalized && !rfqOrder) return
    const quote = (isFinalized ? rfqOrder : indicativeQuote) as IndicativeQuote

    // fix input, recalculate output
    const rawInputAmount = fromTokenAmount(inputTokenAmount, inputToken.decimals).integerValue().toString()
    if (rawInputAmount === quote.takerAmount) {
      const makerAmount = toTokenAmount(quote.makerAmount, outputToken.decimals)
      setOutputTokenAmount(makerAmount)
    }
  }, [
    isFinalized,
    rfqOrder,
    indicativeQuote,
    lastUpdate,
    inputToken.decimals,
    inputTokenAmount,
    outputToken.decimals,
    setOutputTokenAmount,
  ])

  const finalizedQuote = useCallback(async () => {
    if (lastUpdate === Updates.Input) {
      // fix input, recalculate output
      const rawInputAmount = fromTokenAmount(inputTokenAmount, inputToken.decimals).integerValue().toString()
      await requestFirmQuote(undefined, rawInputAmount)
    } else {
      // fix output, update input
      const rawOutputAmount = fromTokenAmount(outputTokenAmount, outputToken.decimals).integerValue().toString()
      await requestFirmQuote(rawOutputAmount, undefined)
    }
    setIsFinalized(true)
  }, [requestFirmQuote, lastUpdate, inputTokenAmount, outputTokenAmount, outputToken, inputToken])

  // fill rfq order
  const fill = useCallback(async () => {
    setIsFilling(true)
    try {
      await fillRFQOrder(rfqOrder, fromTokenAmount(inputTokenAmount, inputToken.decimals).integerValue())
    } finally {
      setIsFilling(false)
    }
  }, [fillRFQOrder, rfqOrder, inputTokenAmount, inputToken])

  // check has enough input
  useEffect(() => {
    const inputRawAmount = fromTokenAmount(inputTokenAmount, inputToken.decimals)
    if (action === TradeAction.Buy) {
      setNeedApprove(usdcAllowance.lt(inputRawAmount))
    } else {
      setNeedApprove(oTokenAllowance.lt(inputRawAmount))
    }
  }, [action, oTokenAllowance, usdcAllowance, inputTokenAmount, inputToken])

  const closestExpry = useMemo(() => {
    return rfqOrder ? rfqOrder.expiry : '0'
  }, [rfqOrder])

  return (
    <>
      <Row>
        <Col sm={12} md={5}>
          <TextInput
            disabled={isFinalized}
            type="number"
            adornment={inputIcon}
            adornmentPosition="end"
            value={inputTokenAmount.toNumber()}
            onChange={handleInputChange}
            wide
          />
          <WarningText show={error !== Errors.NO_ERROR} text={error} />
        </Col>
        <Col sm={1} md={1} style={{ padding: '10px' }}>
          <IconArrowRight size="medium" />
        </Col>
        <Col sm={12} md={5}>
          <TextInput
            disabled={isFinalized}
            type="number"
            adornment={outputIcon}
            adornmentPosition="end"
            value={outputTokenAmount.toFixed()}
            onChange={handleOuputChange}
            wide
          />
        </Col>
      </Row>
      <br />
      <TokenBalanceEntry
        label="Avg. Price"
        isLoading={isRequestingIndicative}
        amount={price.toFixed(4)}
        symbol={paymentToken.symbol}
      />
      <TokenBalanceEntry label="Protocol Fee" amount={protocolFee.toString()} symbol={'ETH'} />

      <br />
      <TokenBalanceEntry
        label="oToken Balance"
        amount={toTokenAmount(oTokenBalance, 8).toString()}
        symbol={simplifyOTokenSymbol(selectedOToken.symbol)}
      />
      <TokenBalanceEntry
        label="USD Balance"
        amount={toTokenAmount(usdBalance, paymentToken.decimals).toString()}
        symbol={paymentToken.symbol}
      />
      <br />

      <div style={{ display: 'flex', paddingTop: '5px' }}>
        <LabelText label={'Expires in'} minWidth={'150px'} />
        {isFinalized ? <Timer end={new Date(parseInt(closestExpry) * 1000)} /> : <> - </>}
      </div>

      <div style={{ display: 'flex', paddingTop: '20px' }}>
        {isFinalized ? (
          <>
            <Button
              disabled={
                needApprove || error !== Errors.NO_ERROR || inputTokenAmount.isZero() || inputTokenAmount.isNaN()
              }
              mode={action === TradeAction.Buy ? 'positive' : 'negative'}
              onClick={fill}
            >
              {' '}
              {isFilling ? <LoadingRing /> : action === TradeAction.Buy ? 'Confirm Buy' : 'Confirm Sell'}{' '}
            </Button>{' '}
            <Button label={'Cancel'} onClick={() => setIsFinalized(false)} />{' '}
          </>
        ) : (
          <Button disabled={inputTokenAmount.isZero() || inputTokenAmount.isNaN()} onClick={finalizedQuote}>
            {' '}
            {isRequestingFirm ? <LoadingRing /> : 'Finalize Offer'}{' '}
          </Button>
        )}

        {needApprove && (
          <Button
            label="approve"
            icon={isApproving ? <LoadingRing /> : <IconUnlock />}
            display="icon"
            onClick={approve}
          />
        )}
      </div>
    </>
  )
}
