import React, { useState, useEffect, useContext, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { Header, TextInput, Switch, Button } from '@aragon/ui'
import LabelText from '../../components/LabelText'
import Warning from '../../components/Warning'

import { walletContext } from '../../contexts/wallet'
import useToken from '../../hooks/useToken'

import {OTokenFactory} from '../../utils/contracts/factory'

export default function CreateOption() {

  const { networkId, web3, user } = useContext(walletContext)

  const USDC = useToken('USDC', networkId)
  const WETH = useToken('WETH', networkId)

  const [underlying, setUnderlying] = useState<string>(WETH)
  const [strike, setStrike] = useState<string>(USDC)
  const [collateral, setCollateral] = useState<string>(USDC)
  const [strikePrice, setStrikePrice] = useState<BigNumber>(new BigNumber(250))
  // const [expiryDate, setExpiryDate] = useState<Date>(new Date(1606809600).toISOString().slice(0, 10))
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

  async function createOToken()  {
      const factory = new OTokenFactory(web3, networkId, user)
      await factory.createOToken(underlying.address, strike.address, collateral.address, strikePrice, expiryTimestamp, isPut)
    }

  return (
    <>
      <Header primary="Create new oToken" />
      <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '3%' }}>

        <div style={{ width: '30%', marginRight: '5%' }}>
          <LabelText label='underlying' />
          <TextInput type="text" readOnly value={underlying.address} wide />
        </div>

        <div style={{ width: '30%' }}>
          <LabelText label='strike' />
          <TextInput type="text" readOnly value={strike.address} wide />
        </div>

        <div style={{ width: '30%', marginLeft: '5%' }}>
          <LabelText label='collateral' />
          <TextInput type="text" readOnly value={collateral.address} wide />
        </div>

      </div>

      <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '1%' }}>

        <div style={{ width: '30%', marginRight: '5%' }}>
          <LabelText label="Is Put" />
          <Switch checked={isPut} onChange={setIsPut} />
        </div>

        <div style={{ width: '30%' }}>
          <LabelText label='Strike price' />
          <TextInput type="number" value={strikePrice} onChange={(e) => setStrikePrice(new BigNumber(e.target.value))} wide />
        </div>

        <div style={{ width: '30%', marginLeft: '5%' }}>
          <LabelText label='Expiry Timestamp' />
          <TextInput type="number" value={expiryTimestamp} onChange={(e) => setExpiryTimestamp(new BigNumber(e.target.value))} wide />
          <Warning text={warning} show={hasExpiryWarning} />
        </div>

      </div>

      <div style={{ display: 'flex', alignItems: 'center', paddingTop: '2%' }}>
      <Button label="Create" wide onClick={createOToken}/>
      </div>

    </>
  )
}