import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Row, Col } from 'react-grid-system'
import BigNumber from 'bignumber.js'
import {
  Button,
  TextInput,
  IconArrowRight,
  IconUnlock,
  LinkBase,
  TextCopy,
  EthIdenticon,
  LoadingRing,
} from '@aragon/ui'

import { toTokenAmount, fromTokenAmount } from '../../../utils/math'

import { TradeAction, Errors, DeadlineUnit, Spenders } from '../../../constants'
import { ZERO_ADDR } from '../../../constants/addresses'

import WETHIcon from '../../../imgs/ETH.png'
import SQTHIcon from '../../../imgs/osqueeth.svg'

import { use0xExchange } from '../../../hooks/use0xExchange'
import { useUserAllowance } from '../../../hooks/useAllowance'

import EditOrderDeadlineModal from '../../../components/EditOrderDeadlineModal'

import WarningText from '../../../components/Warning'
import TokenBalanceEntry from '../../../components/TokenBalanceEntry'
import LabelText from '../../../components/LabelText'
import SectionHeader from '../../../components/SectionHeader'
import Comment from '../../../components/Comment'
import { useCustomToast } from '../../../hooks'
import { squeeth, weth } from './constants'

type TradeDetailProps = {
  squeethBalance: BigNumber
  paymentTokenBalance: BigNumber
}

export default function MakeOrderDetailSimple({ paymentTokenBalance, squeethBalance }: TradeDetailProps) {
  const toast = useCustomToast()
  const [action, setAction] = useState<TradeAction>(TradeAction.Buy)

  const [inputTokenAmount, setInputTokenAmount] = useState<BigNumber>(new BigNumber(0))
  const [outputTokenAmount, setOutputTokenAmount] = useState<BigNumber>(new BigNumber(0))

  const [takerAddress, setTakerAddress] = useState<string>(ZERO_ADDR)

  const [isApprovingPaymentToken, setApprovingPaymentToken] = useState(false)
  const [isApprovingSqueeth, setIsApprovingOToken] = useState(false)

  const paymentToken = weth

  const { createOrder } = use0xExchange()

  const [encodedOrder, setSignedOrder] = useState<null | string>(null)

  const [deadline, setDeadline] = useState<number>(20)

  const [finalDeadlineUnit, setFinalDeadlineUnit] = useState<DeadlineUnit>(DeadlineUnit.Minutes)

  const [error, setError] = useState(Errors.NO_ERROR)

  const inputToken = useMemo(() => (action === TradeAction.Buy ? paymentToken : squeeth), [
    paymentToken,
    action,
  ])

  const outputToken = useMemo(() => (action === TradeAction.Buy ? squeeth : paymentToken), [
    paymentToken,
    action,
  ])

  const inputTokenBalance = useMemo(() => (action === TradeAction.Buy ? paymentTokenBalance : squeethBalance), [
    action,
    paymentTokenBalance,
    squeethBalance,
  ])
  const outputTokenBalance = useMemo(() => (action === TradeAction.Buy ? squeethBalance : paymentTokenBalance), [
    action,
    squeethBalance,
    paymentTokenBalance,
  ])

  const [needApproveInputToken, setNeedApprove] = useState(true)
  const { allowance: usdcAllowance, approve: approveUSDC } = useUserAllowance(paymentToken.id, Spenders.ZeroXExchange)
  const { allowance: oTokenAllowance, approve: approveOTokenZX } = useUserAllowance(
    squeeth.id,
    Spenders.ZeroXExchange,
  )

  const approveUSDCAndFee = useCallback(async () => {
    setApprovingPaymentToken(true)
    try {
      if (action === TradeAction.Buy) {
        const rawInputAmount = fromTokenAmount(inputTokenAmount, inputToken.decimals)
        await approveUSDC(rawInputAmount)
      }
    } catch {
      setApprovingPaymentToken(false)
    }
  }, [action, inputToken, inputTokenAmount, approveUSDC])

  const approveOToken = useCallback(async () => {
    setIsApprovingOToken(true)
    try {
      const rawInputAmount = fromTokenAmount(inputTokenAmount, inputToken.decimals)
      await approveOTokenZX(rawInputAmount)
    } catch {
      setIsApprovingOToken(false)
    }
  }, [inputTokenAmount, inputToken, approveOTokenZX])

  const inputIcon = useMemo(
    () =>
      action === TradeAction.Buy ? (
        <img alt="inputtoken" width={25} src={WETHIcon} />
      ) : (
        <img alt="inputtoken" width={25} src={SQTHIcon} />
      ),
    [action],
  )

  const outputIcon = useMemo(
    () =>
      action === TradeAction.Buy ? (
        <img alt="inputtoken" width={25} src={SQTHIcon} />
      ) : (
        <img alt="outputtoken" width={25} src={WETHIcon} />
      ),
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
    const inputBalance = action === TradeAction.Buy ? paymentTokenBalance : squeethBalance
    const rawInputAmount = fromTokenAmount(inputTokenAmount, inputToken.decimals).integerValue()
    if (rawInputAmount.gt(inputBalance)) setError(Errors.INSUFFICIENT_BALANCE)
    else if (error === Errors.INSUFFICIENT_BALANCE) setError(Errors.NO_ERROR)
  }, [paymentTokenBalance, squeethBalance, inputToken, inputTokenAmount, action, error])

  // check has enough input allowance
  useEffect(() => {
    const inputRawAmount = fromTokenAmount(inputTokenAmount, inputToken.decimals)
    if (action === TradeAction.Buy) {
      setNeedApprove(usdcAllowance.lt(inputRawAmount))
    } else {
      setNeedApprove(oTokenAllowance.lt(inputRawAmount))
    }
  }, [action, oTokenAllowance, usdcAllowance, inputTokenAmount, inputToken])

  const createEncodedOrder = useCallback(async () => {
    const deadlineInSec = getDeadlineInSec(deadline, finalDeadlineUnit)
    const makerAssetAmount = fromTokenAmount(inputTokenAmount, inputToken.decimals).integerValue()
    const takerAssetAmount = fromTokenAmount(outputTokenAmount, outputToken.decimals).integerValue()
    const expiry = Date.now() / 1000 + deadlineInSec
    const order = await createOrder(
      inputToken.id,
      outputToken.id,
      // paymentToken.id,
      makerAssetAmount,
      takerAssetAmount,
      // makerFee,
      expiry,
      takerAddress,
    )
    const objJsonStr = JSON.stringify(order)
    const encodedOrder = Buffer.from(objJsonStr).toString('base64')
    setSignedOrder(encodedOrder)
    toast.success('Order successfully created')
  }, [
    toast,
    finalDeadlineUnit,
    createOrder,
    deadline,
    // makerFee,
    inputToken.decimals,
    inputToken.id,
    inputTokenAmount,
    outputToken.decimals,
    outputToken.id,
    outputTokenAmount,
    takerAddress,
    // paymentToken.id,
  ])

  return (
    <>
      <Comment text="Side" padding={15} />
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
      <Comment text="Amount" padding={15} />
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

      <Comment text="Taker Address" padding={15} />
      <Row>
        <Col xl={5} lg={5} md={6} sm={8}>
          <TextInput
            type="string"
            value={takerAddress}
            adornment={<EthIdenticon address={takerAddress} scale={1} radius={3} soften={0.7} />}
            adornmentPosition="end"
            onChange={event => setTakerAddress(event.target.value)}
            wide
          />
        </Col>
      </Row>

      <SectionHeader title="Detail" />
      <TokenBalanceEntry label="Price" amount={price.toFixed(4)} symbol={`${paymentToken.symbol} / ${squeeth.symbol}`} />
      <TokenBalanceEntry label="Maker Fee" amount={'0'} symbol={paymentToken.symbol} />

      <div style={{ display: 'flex' }}>
        <LabelText label={'Deadline'} minWidth={'150px'} />
        <div style={{ paddingRight: '5px' }}>{deadline.toString()}</div>
        <div style={{ opacity: 0.7, paddingRight: '15px' }}> {finalDeadlineUnit.toString()} </div>
        <EditOrderDeadlineModal setDeadline={setDeadline} setFinalDeadlineUnit={setFinalDeadlineUnit} />
      </div>

      <br />

      <div style={{ display: 'flex' }}>
        <Button
          disabled={
            needApproveInputToken || error !== Errors.NO_ERROR || inputTokenAmount.isZero() || inputTokenAmount.isNaN()
            // needApproveUSDCForFee // need to enable maker fee
          }
          label={'Generate Order'}
          mode="strong"
          onClick={createEncodedOrder}
        />
        {/* Need to enable usdc in the following: it's a buy or sell nned approve USDC for fee */}
        {action === TradeAction.Buy && needApproveInputToken && (
          <Button
            label="approve-fee"
            icon={isApprovingPaymentToken ? <LoadingRing /> : <IconUnlock />}
            display="icon"
            onClick={approveUSDCAndFee}
          />
        )}

        {/* Need to enable oToken if it's a sell order. */}
        {action === TradeAction.Sell && needApproveInputToken && (
          <Button
            label="approve-otoken"
            icon={isApprovingSqueeth ? <LoadingRing /> : <IconUnlock />}
            display="icon"
            onClick={approveOToken}
          />
        )}

        <br />
      </div>

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
