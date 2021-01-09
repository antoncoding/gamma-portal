import React, { useMemo, useState, useCallback, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { Button, TextInput, IconArrowRight, IconUnlock } from '@aragon/ui'
import EditOrderDeadlineModal from './EditOrderDeadlineModal'
import { SubgraphOToken, OTokenBalance } from '../../../types'

import { toTokenAmount, fromTokenAmount } from '../../../utils/math'

import { TradeAction, Errors, DeadlineUnit } from '../../../constants'
import { useConnectedWallet } from '../../../contexts/wallet'
import { getUSDC, addresses } from '../../../constants/addresses'

import oETHIcon from '../../../imgs/oETH.svg'
import USDCIcon from '../../../imgs/USDC.png'
import { use0xExchange } from '../../../hooks/use0xExchange'
import { useUserAllowance } from '../../../hooks/useAllowance'
import { simplifyOTokenSymbol } from '../../../utils/others'
import WarningText from '../../../components/Warning'
import TokenBalanceEntry from '../../../components/TokenBalanceEntry'
import LabelText from '../../../components/LabelText'

type MarketTicketProps = {
  action: TradeAction
  selectedOToken: SubgraphOToken
  oTokenBalances: OTokenBalance[] | null
  usdcBalance: BigNumber
  inputTokenAmount: BigNumber
  setInputTokenAmount: React.Dispatch<React.SetStateAction<BigNumber>>
  outputTokenAmount: BigNumber
  setOutputTokenAmount: React.Dispatch<React.SetStateAction<BigNumber>>
}

export default function LimitTicket({
  action,
  selectedOToken,
  oTokenBalances,
  usdcBalance,
  inputTokenAmount,
  setInputTokenAmount,
  outputTokenAmount,
  setOutputTokenAmount,
}: MarketTicketProps) {
  const { networkId } = useConnectedWallet()

  const paymentToken = useMemo(() => getUSDC(networkId), [networkId])

  const { createOrder, broadcastOrder } = use0xExchange()

  const [deadline, setDeadline] = useState<number>(20)

  const [finalDeadlineUnit, setFinalDeadlineUnit] = useState<DeadlineUnit>(DeadlineUnit.Minutes)

  const [error, setError] = useState(Errors.NO_ERROR)

  const oTokenBalance = oTokenBalances?.find(b => b.token.id === selectedOToken.id)?.balance ?? new BigNumber(0)

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
  const { allowance: usdcAllowance, approve: approveUSDC } = useUserAllowance(
    paymentToken.id,
    addresses[networkId].zeroxERCProxy,
  )
  const { allowance: oTokenAllowance, approve: approveOToken } = useUserAllowance(
    selectedOToken.id,
    addresses[networkId].zeroxERCProxy,
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

  const createAndPost = useCallback(async () => {
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

    await broadcastOrder(order)
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
    broadcastOrder,
  ])

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
          <WarningText show={error !== Errors.NO_ERROR} text={error} />
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
      <br />
      <TokenBalanceEntry label="Price" amount={price.toFixed(4)} symbol="USDC / oToken" />
      <TokenBalanceEntry
        label="Maker Fee"
        amount={toTokenAmount(makerFee, inputToken.decimals).toString()}
        symbol={inputToken.symbol}
      />

      <div style={{ display: 'flex', paddingTop: '5px' }}>
        <LabelText label={'Deadline'} minWidth={'150px'} />
        <div style={{ paddingRight: '5px' }}>{deadline.toString()}</div>
        <div style={{ opacity: 0.7, paddingRight: '15px' }}> {finalDeadlineUnit.toString()} </div>
        <EditOrderDeadlineModal setDeadline={setDeadline} setFinalDeadlineUnit={setFinalDeadlineUnit} />
      </div>

      <br />
      <TokenBalanceEntry
        label="oToken Balance"
        amount={toTokenAmount(oTokenBalance, 8).toString()}
        symbol={simplifyOTokenSymbol(selectedOToken.symbol)}
      />
      <TokenBalanceEntry
        label="USDC Balance"
        amount={toTokenAmount(usdcBalance, paymentToken.decimals).toString()}
        symbol={paymentToken.symbol}
      />

      <div style={{ display: 'flex', paddingTop: '20px' }}>
        <Button
          disabled={needApprove || error !== Errors.NO_ERROR || inputTokenAmount.isZero() || inputTokenAmount.isNaN()}
          label={action === TradeAction.Buy ? 'Create Bid Order' : 'Create Ask Order'}
          mode={action === TradeAction.Buy ? 'positive' : 'negative'}
          onClick={createAndPost}
        />
        {needApprove && <Button label="approve" icon={<IconUnlock />} display="icon" onClick={approve} />}
      </div>
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
