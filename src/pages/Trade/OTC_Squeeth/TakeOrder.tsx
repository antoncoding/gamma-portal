import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { TextInput, Button, Timer, IconUnlock, LoadingRing } from '@aragon/ui'
import BigNumber from 'bignumber.js'
import { SignedOrder, Token } from '../../../types'
import { getPrimaryPaymentToken, Errors, Spenders, ZERO_ADDR } from '../../../constants'

import SectionHeader from '../../../components/SectionHeader'
import LabelText from '../../../components/LabelText'
import TokenBalanceEntry from '../../../components/TokenBalanceEntry'

import { useConnectedWallet } from '../../../contexts/wallet'
import { toTokenAmount } from '../../../utils/math'
import { use0xExchange } from '../../../hooks/use0xExchange'
import WarningText from '../../../components/Warning'
import { useUserAllowance } from '../../../hooks/useAllowance'
import { useCustomToast } from '../../../hooks'
import { squeeth, weth } from './constants'

type TakerOrderProps = {
  squeethBalance: BigNumber
  paymentTokenBalance: BigNumber
}

export default function TakerOrder({ squeethBalance, paymentTokenBalance }: TakerOrderProps) {
  const { getProtocolFee, fillOrder } = use0xExchange()

  const { networkId, user } = useConnectedWallet()

  const paymentToken = useMemo(() => getPrimaryPaymentToken(networkId), [networkId])

  const toast = useCustomToast()

  const [encodedOrder, setEncodedOrder] = useState('')

  const [order, setOrder] = useState<null | SignedOrder>(null)

  const [makerAsset, setMakerAsset] = useState<Token | null>(null)
  const [takerAsset, setTakerAsset] = useState<Token | null>(null)

  const [isApproving, setIsApproving] = useState(false)

  // const payFeeWithWeth = useMemo(() => getPreference(ZEROX_PROTOCOL_FEE_KEY, FeeTypes.ETH) === FeeTypes.WETH, [])

  const takerAssetBalance = useMemo(
    () =>
      takerAsset
        ? takerAsset.id.toLowerCase() === squeeth.id
          ? squeethBalance
          : paymentTokenBalance
        : new BigNumber(0),
    [takerAsset, paymentTokenBalance, squeethBalance],
  )

  const balanceError = order
    ? takerAssetBalance.gte(order.takerAmount)
      ? Errors.NO_ERROR
      : Errors.INSUFFICIENT_BALANCE
    : Errors.NO_ERROR

  useEffect(() => {
    if (encodedOrder === '') return
    try {
      const order: SignedOrder = JSON.parse(new Buffer(encodedOrder, 'base64').toString())
      setOrder(order)
      // asset is either oToken or usdc
      const makerAsset = order.makerToken.toLowerCase() === squeeth.id ? squeeth : 
      order.makerToken.toLowerCase() === weth.id ? weth : undefined
  
      const takerAsset = order.takerToken.toLowerCase() === squeeth.id ? squeeth : 
      order.takerToken.toLowerCase() === weth.id ? weth : undefined

      if (!makerAsset || !takerAsset) throw new Error('Not an Squeeth Order') 
      setMakerAsset(makerAsset)
      setTakerAsset(takerAsset)
    } catch (error) {
      toast.error('Decode order failed (Not a suqeeth / weth order)')
    }
  }, [encodedOrder, paymentTokenBalance, paymentToken, toast])

  // denominated in eth
  const protocolFee = useMemo(() => (order ? getProtocolFee([order]) : new BigNumber(0)), [getProtocolFee, order])
  // const hasEnoughWeth = useMemo(() => wethBalance.gt(fromTokenAmount(protocolFee, 18)), [protocolFee, wethBalance])

  // get taker asset allowance
  const { approve, allowance } = useUserAllowance(takerAsset?.id || paymentToken.id, Spenders.ZeroXExchange)

  const needApprove = useMemo(() => (order ? new BigNumber(order.takerAmount).gt(allowance) : false), [
    order,
    allowance,
  ])

  const handleFillOrder = useCallback(async () => {
    if (!order) return toast.error('No order selected')
    await fillOrder(order, new BigNumber(order.takerAmount))
  }, [fillOrder, order, toast])

  const takable = useMemo(() => (order ? order.taker === ZERO_ADDR || order.taker.toLowerCase() === user : true), [
    order,
    user,
  ])

  const approveOToken = useCallback(async () => {
    if (!order) return toast.error('No order selected')
    setIsApproving(true)
    try {
      await approve(new BigNumber(order.takerAmount))
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsApproving(false)
    }
  }, [approve, order, toast])

  return (
    <>
      <SectionHeader title="Order" />
      <span style={{ opacity: 0.9, fontSize: 15 }}> Paste the order string you get from the order maker. </span>
      <TextInput wide onChange={event => setEncodedOrder(event.target.value)} />
      <WarningText show={!takable} text="You cannot take this order" />

      {order && (
        <>
          <SectionHeader title="Detail" />

          <TokenBalanceEntry
            label="I Get"
            amount={toTokenAmount(order.makerAmount, makerAsset?.decimals || 8).toString()}
            symbol={makerAsset?.symbol || ''}
          />

          <TokenBalanceEntry
            label="I Pay"
            amount={toTokenAmount(order.takerAmount, takerAsset?.decimals || 8).toString()}
            symbol={takerAsset?.symbol || ''}
          />
          <WarningText show={balanceError !== Errors.NO_ERROR} text={balanceError} />

          <div style={{ display: 'flex', paddingTop: '5px' }}>
            <LabelText label={'Expires in'} minWidth={'150px'} />
            <Timer end={new Date(Number(order.expiry) * 1000)} />
          </div>

          {order.takerTokenFeeAmount !== '0' && (
            <TokenBalanceEntry
              label="Taker Fee"
              amount={toTokenAmount(order.takerTokenFeeAmount, takerAsset?.decimals || 8).toString()}
              symbol={takerAsset?.symbol || ''}
            />
          )}

          <TokenBalanceEntry label="Protocol Fee" amount={protocolFee.toString()} symbol={'ETH'} />

          <br />
          <div style={{ display: 'flex' }}>
            <Button
              disabled={balanceError !== Errors.NO_ERROR || needApprove || !takable}
              mode="strong"
              label="Complete Trade"
              onClick={handleFillOrder}
            />

            {needApprove && (
              <Button
                label="approve"
                mode="positive"
                display="icon"
                icon={isApproving ? <LoadingRing /> : <IconUnlock />}
                onClick={approveOToken}
              />
            )}
          </div>
        </>
      )}
    </>
  )
}
