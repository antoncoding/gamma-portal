import React, {useState, useEffect, useContext} from 'react'
import BigNumber from 'bignumber.js'
import { Header, TextInput, Switch } from '@aragon/ui'
import LabelText from '../../components/LabelText'
import addressese from '../../utils/constants'
import { walletContext } from '../../contexts/wallet'
import useToken from '../../hooks/useToken'

export default function CreateOption() {

  const {networkId} = useContext(walletContext)

  const USDC = useToken('USDC', networkId)
  const WETH = useToken('WETH', networkId)

  const [underlying, setUnderlying] = useState<string>(USDC)
  const [strike, setStrike] = useState<string>(WETH)
  const [collateral, setCollateral] = useState<string>(USDC)
  const [strikePrice, setStrikePrice] = useState<BigNumber>(new BigNumber(0))
  const [expiryDate, setExpiryDate] = useState<Date>(new Date(1606809600000).toISOString().slice(0, 10))
  const [expiryTimestamp, setExpiryTimestamp] = useState<number>(0)
  const [isPut, setIsPut] = useState(true)
  
  console.log(`expiry`, new Date().toUTCString())

  // update date to be UTC 0800
  useEffect(() => {
    const timeStamp = expiryTimestamp
  }, [expiryDate, expiryTimestamp])

  useEffect(() => {
    if(isPut) {
      setCollateral(underlying)
    } else {
      setCollateral(strike)
    }
    return () => {}
  }, [isPut, underlying, strike])

  return (
    <>
      <Header primary="Create new oToken" />
      <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '3%' }}>
        
        <div style={{ width: '30%', marginRight: '3%'}}>
          <LabelText label='underlying' />
          <TextInput type="text" readOnly value={underlying.address} wide/>
        </div>

        <div style={{ width: '30%' }}>
          <LabelText label='strike' />
          <TextInput type="text" readOnly value={strike.address} wide/>
        </div>

        <div style={{ width: '30%', marginLeft: '3%', marginRight: '2%' }}>
          <LabelText label='collateral' />
          <TextInput type="text" readOnly value={collateral.address} wide/>
        </div>

      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '1%' }}>
        
      <div style={{ width: '30%', marginRight: '3%'}}>
        <LabelText label="Is Put" />
        <Switch checked={isPut} onChange={setIsPut}/>
        </div>

        <div style={{ width: '30%' }}>
          <LabelText label='Strike price' />
          <TextInput type="number" value={strikePrice} onChange={(e) => setStrikePrice(new BigNumber(e.target.value))} wide/>
        </div>

        <div style={{ width: '30%', marginLeft: '3%', marginRight: '2%' }}>
          <LabelText label='Expiry Timestamp' />
          <TextInput type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} wide/>
        </div>

      </div>
      
      
      
    </>
  )
}