import React, { useState, useEffect, useContext, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { Header, TextInput, Switch, Button } from '@aragon/ui'
import LabelText from '../../components/LabelText'
import Warning from '../../components/Warning'

import { walletContext } from '../../contexts/wallet'
import { useTokenBySymbol } from '../../hooks/useToken'

import { OTokenFactory } from '../../utils/contracts/factory'
import { Token } from '../../types'
import { ZERO_ADDR } from '../../constants/addresses'
import { fromTokenAmount } from '../../utils/math'

export default function CreateOption() {

  const { networkId, web3, user } = useContext(walletContext)

  const USDC = useTokenBySymbol('USDC', networkId)
  const WETH = useTokenBySymbol('WETH', networkId)

  const [underlying, setUnderlying] = useState<Token|null>(WETH)
  const [strike, setStrike] = useState<Token|null>(USDC)
  const [collateral, setCollateral] = useState<Token|null>(USDC)
  const [strikePriceReadable, setStrikePriceReadable] = useState<BigNumber>(new BigNumber(250))
  const [expiryTimestamp, setExpiryTimestamp] = useState<BigNumber>(new BigNumber(1606809600))
  const [isPut, setIsPut] = useState(true)

  const [hasExpiryWarning, setHasWarning] = useState<boolean>(false)
  const [warning, setWarning] = useState<string>('')

  // make sure expiry to be UTC 0800
  useEffect(() => {
    if ((expiryTimestamp.minus(28800)).mod(86400).isGreaterThan(0)) {
      setHasWarning(true)
      setWarning('Expiry time need to be 08:00 AM UTC')
    } else {
      setHasWarning(false)
    }
  }, [expiryTimestamp])

  useEffect(() => {
    if (isPut) {
      setCollateral(strike)
    } else {
      setCollateral(underlying)
    }
    return () => { }
  }, [isPut, underlying, strike])

  const strikePrice = useMemo(() => fromTokenAmount(new BigNumber(strikePriceReadable), 8), [strikePriceReadable])

  async function createOToken() {
    const factory = new OTokenFactory(web3, networkId, user)
    if (!underlying || !strike || !collateral) return 
    await factory.createOToken(underlying.address, strike.address, collateral.address, strikePrice, expiryTimestamp, isPut)
  }

  return (
    <>
      <Header primary="Create new oToken" />
      <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '3%' }}>

        <div style={{ width: '30%', marginRight: '5%' }}>
          <LabelText label='underlying' />
          <TextInput type="text" onChange={setUnderlying} readOnly value={underlying ?  underlying.address : ZERO_ADDR } wide />
        </div>

        <div style={{ width: '30%' }}>
          <LabelText label='strike' />
          <TextInput type="text" onChange={setStrike} readOnly value={strike ? strike.address : ZERO_ADDR} wide />
        </div>

        <div style={{ width: '30%', marginLeft: '5%' }}>
          <LabelText label='collateral' />
          <TextInput type="text" onChange={setCollateral} readOnly value={collateral ? collateral.address : ZERO_ADDR} wide />
        </div>

      </div>

      <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '1%' }}>

        <div style={{ width: '30%', marginRight: '5%' }}>
          <LabelText label="Is Put" />
          <Switch checked={isPut} onChange={setIsPut} />
        </div>

        <div style={{ width: '30%' }}>
          <LabelText label='Strike price' />
          <TextInput type="number" value={strikePriceReadable} onChange={(e) => setStrikePriceReadable(new BigNumber(e.target.value))} wide />
        </div>

        <div style={{ width: '30%', marginLeft: '5%' }}>
          <LabelText label='Expiry Timestamp' />
          <TextInput type="number" value={expiryTimestamp} onChange={(e) => setExpiryTimestamp(new BigNumber(e.target.value))} wide />
          <Warning text={warning} show={hasExpiryWarning} />
        </div>

      </div>

      <div style={{ display: 'flex', alignItems: 'center', paddingTop: '2%' }}>
        <Button label="Create" wide onClick={createOToken} />
      </div>

    </>
  )
}