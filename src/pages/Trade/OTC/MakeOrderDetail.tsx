import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Row, Col } from 'react-grid-system'
import BigNumber from 'bignumber.js'
import { Button, TextInput, IconArrowRight, IconUnlock, LinkBase, TextCopy } from '@aragon/ui'
import { SubgraphOToken } from '../../../types'

import { toTokenAmount, fromTokenAmount } from '../../../utils/math'

import { TradeAction, Errors, DeadlineUnit, Spenders } from '../../../constants'
import { useConnectedWallet } from '../../../contexts/wallet'
import { getUSDC } from '../../../constants/addresses'

import oETHIcon from '../../../imgs/oETH.svg'
import USDCIcon from '../../../imgs/USDC.png'
import { use0xExchange } from '../../../hooks/use0xExchange'
import { useUserAllowance } from '../../../hooks/useAllowance'

import EditOrderDeadlineModal from '../OrderBookTrade/EditOrderDeadlineModal'

import WarningText from '../../../components/Warning'
import TokenBalanceEntry from '../../../components/TokenBalanceEntry'
import LabelText from '../../../components/LabelText'
import SectionHeader from '../../../components/SectionHeader'
import Comment from '../../../components/Comment'

type TradeDetailProps = {
  oTokenBalance: BigNumber
  selectedOToken: SubgraphOToken
  usdcBalance: BigNumber
}

export default function MakeOrderDetail({ selectedOToken, usdcBalance, oTokenBalance }: TradeDetailProps) {
  const { networkId } = useConnectedWallet()

  const [action, setAction] = useState<TradeAction>(TradeAction.Buy)

  const [inputTokenAmount, setInputTokenAmount] = useState<BigNumber>(new BigNumber(0))
  const [outputTokenAmount, setOutputTokenAmount] = useState<BigNumber>(new BigNumber(0))

  const paymentToken = useMemo(() => getUSDC(networkId), [networkId])

  const { createOrder } = use0xExchange()

  const [encodedOrder, setSignedOrder] = useState<null | string>(null)

  const [deadline, setDeadline] = useState<number>(20)

  const [finalDeadlineUnit, setFinalDeadlineUnit] = useState<DeadlineUnit>(DeadlineUnit.Minutes)

  const [error, setError] = useState(Errors.NO_ERROR)

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

  const inputTokenBalance = useMemo(() => (action === TradeAction.Buy ? usdcBalance : oTokenBalance), [
    action,
    usdcBalance,
    oTokenBalance,
  ])
  const outputTokenBalance = useMemo(() => (action === TradeAction.Buy ? oTokenBalance : usdcBalance), [
    action,
    oTokenBalance,
    usdcBalance,
  ])

  const [needApprove, setNeedApprove] = useState(true)
  const { allowance: usdcAllowance, approve: approveUSDC } = useUserAllowance(paymentToken.id, Spenders.ZeroXERC20Proxy)
  const { allowance: oTokenAllowance, approve: approveOToken } = useUserAllowance(
    selectedOToken.id,
    Spenders.ZeroXERC20Proxy,
  )

  const approve = useCallback(() => {
    const rawInputAmount = fromTokenAmount(inputTokenAmount, inputToken.decimals)
    if (action === TradeAction.Buy) approveUSDC(rawInputAmount)
    else approveOToken(rawInputAmount)
  }, [inputTokenAmount, inputToken, action, approveUSDC, approveOToken])

  const inputIcon = useMemo(
    () => <img alt="inputtoken" width={25} src={action === TradeAction.Buy ? USDCIcon : oETHIcon} />,
    [action],
  )

  const outputIcon = useMemo(
    () => <img alt="outputtoken" width={25} src={action === TradeAction.Buy ? oETHIcon : USDCIcon} />,
    [action],
  )

  const handleInputChange = useCallback(
    event => {
      try {
        const newAmount = new BigNumber(event.target.value)
        setInputTokenAmount(newAmount)
      } catch {}
    },
    [setInputTokenAmount],
  )

  const handleOuputChange = useCallback(
    event => {
      try {
        const newAmount = new BigNumber(event.target.value)
        setOutputTokenAmount(newAmount)
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

  // check balance error
  useEffect(() => {
    // if (error !== Errors.NO_ERROR || error !== Errors.INSUFFICIENT_BALANCE) return
    const inputBalance = action === TradeAction.Buy ? usdcBalance : oTokenBalance
    const rawInputAmount = fromTokenAmount(inputTokenAmount, inputToken.decimals).integerValue()
    if (rawInputAmount.gt(inputBalance)) setError(Errors.INSUFFICIENT_BALANCE)
    else if (error === Errors.INSUFFICIENT_BALANCE) setError(Errors.NO_ERROR)
  }, [usdcBalance, oTokenBalance, inputToken, inputTokenAmount, action, error])

  const makerFee = useMemo(
    () =>
      action === TradeAction.Buy
        ? fromTokenAmount(new BigNumber(1), inputToken.decimals).integerValue()
        : new BigNumber(0),
    [action, inputToken],
  )

  // check has enough input allowance
  useEffect(() => {
    const inputRawAmount = fromTokenAmount(inputTokenAmount, inputToken.decimals)
    if (action === TradeAction.Buy) {
      const fee = fromTokenAmount(new BigNumber(1), inputToken.decimals)
      setNeedApprove(usdcAllowance.lt(inputRawAmount.plus(fee)))
    } else {
      setNeedApprove(oTokenAllowance.lt(inputRawAmount))
    }
  }, [action, oTokenAllowance, usdcAllowance, inputTokenAmount, inputToken])

  const createOrderAndPost = useCallback(async () => {
    const deadlineInSec = getDeadlineInSec(deadline, finalDeadlineUnit)
    const makerAssetAmount = fromTokenAmount(inputTokenAmount, inputToken.decimals).integerValue()
    const takerAssetAmount = fromTokenAmount(outputTokenAmount, outputToken.decimals).integerValue()
    const expiry = Date.now() / 1000 + deadlineInSec
    const order = await createOrder(
      inputToken.id,
      outputToken.id,
      inputToken.id,
      makerAssetAmount,
      takerAssetAmount,
      makerFee,
      expiry,
    )
    const objJsonStr = JSON.stringify(order)
    const encodedOrder = Buffer.from(objJsonStr).toString('base64')
    console.log(`encodedOrder`, encodedOrder)
    setSignedOrder(encodedOrder)
  }, [
    finalDeadlineUnit,
    createOrder,
    deadline,
    makerFee,
    inputToken.decimals,
    inputToken.id,
    inputTokenAmount,
    outputToken.decimals,
    outputToken.id,
    outputTokenAmount,
  ])

  return (
    <>
      <SectionHeader title="Side" />
      <Row>
        <Col>
          <Button
            label="Buy"
            onClick={() => setAction(TradeAction.Buy)}
            mode={action === TradeAction.Buy ? 'positive' : 'normal'}
          />
          <Button
            label="Sell"
            onClick={() => setAction(TradeAction.Sell)}
            mode={action === TradeAction.Sell ? 'negative' : 'normal'}
          />
        </Col>
      </Row>

      {/* Input Output Amount Row */}
      <SectionHeader title="Amount" />
      <Row>
        <Col xl={3} lg={4} md={4} sm={5}>
          <TextInput
            type="number"
            adornment={inputIcon}
            adornmentPosition="end"
            value={inputTokenAmount.toNumber()}
            onChange={handleInputChange}
          />
          <LinkBase
            style={{ fontSize: 12, opacity: 0.7 }}
            onClick={() => {
              setInputTokenAmount(toTokenAmount(inputTokenBalance, inputToken.decimals))
            }}
          >
            {' '}
            Balance: {toTokenAmount(inputTokenBalance, inputToken.decimals).toFixed(4)}
          </LinkBase>
          <WarningText show={error !== Errors.NO_ERROR} text={error} />
        </Col>
        <Col lg={1} xl={1} style={{ paddingTop: '10px' }}>
          <IconArrowRight size="medium" />
        </Col>
        <Col xl={3} lg={4} md={4} sm={5}>
          <TextInput
            type="number"
            adornment={outputIcon}
            adornmentPosition="end"
            value={outputTokenAmount.toFixed()}
            onChange={handleOuputChange}
          />
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            {' '}
            Balance: {toTokenAmount(outputTokenBalance, outputToken.decimals).toFixed(4)}{' '}
          </div>
        </Col>
      </Row>

      <SectionHeader title="Detail" />
      <TokenBalanceEntry label="Price" amount={price.toFixed(4)} symbol="USDC / oToken" />
      <TokenBalanceEntry
        label="Maker Fee"
        amount={toTokenAmount(makerFee, inputToken.decimals).toString()}
        symbol={inputToken.symbol}
      />

      <div style={{ display: 'flex' }}>
        <LabelText label={'Deadline'} minWidth={'150px'} />
        <div style={{ paddingRight: '5px' }}>{deadline.toString()}</div>
        <div style={{ opacity: 0.7, paddingRight: '15px' }}> {finalDeadlineUnit.toString()} </div>
        <EditOrderDeadlineModal setDeadline={setDeadline} setFinalDeadlineUnit={setFinalDeadlineUnit} />
      </div>

      <br />
      <Button
        disabled={needApprove || error !== Errors.NO_ERROR || inputTokenAmount.isZero() || inputTokenAmount.isNaN()}
        label={'Generate Order'}
        mode={action === TradeAction.Buy ? 'positive' : 'negative'}
        onClick={createOrderAndPost}
      />
      {needApprove && <Button label="approve" icon={<IconUnlock />} display="icon" onClick={approve} />}
      <br />

      {encodedOrder && (
        <>
          <SectionHeader title="Result" />
          <Comment padding={0} text="Send the following string to the taker." />
          <TextCopy value={encodedOrder} />
        </>
      )}
    </>
  )
}

function getDeadlineInSec(deadline: number, type: DeadlineUnit) {
  switch (type) {
    case DeadlineUnit.Seconds:
      return deadline
    case DeadlineUnit.Minutes:
      return deadline * 60
    case DeadlineUnit.Hours:
      return deadline * 3600
    case DeadlineUnit.Days:
      return deadline * 86400
  }
}
