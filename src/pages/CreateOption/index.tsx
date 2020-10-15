import React, { useState, useEffect, useContext, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { Header, TextInput, Button, DropDown, useToast } from '@aragon/ui'
import LabelText from '../../components/LabelText'
import Warning from '../../components/Warning'
import { walletContext } from '../../contexts/wallet'
import { useAsyncMemo } from '../../hooks/useAsyncMemo'
import { OTokenFactory } from '../../utils/contracts/factory'
import { fromTokenAmount } from '../../utils/math'
import { getWhitelistedProducts } from '../../utils/graph'
import SectionTitle from '../../components/SectionHeader'

import TokenAddress from '../../components/TokenAddress'

export default function CreateOption() {

  const { networkId, web3, user } = useContext(walletContext)
  const toast = useToast()
  const [selectedProductIndex, setSelectedProductIndex] = useState(-1)
  
  const [strikePriceReadable, setStrikePriceReadable] = useState<BigNumber>(new BigNumber(250))
  const [expiryTimestamp, setExpiryTimestamp] = useState<BigNumber>(new BigNumber(1606809600))
  const [hasExpiryWarning, setHasWarning] = useState<boolean>(false)
  const [warning, setWarning] = useState<string>('')

  const allProducts = useAsyncMemo(async () => {
    const products = await getWhitelistedProducts(networkId, toast)
    if (products === null) return []

    return products.map(product => {
      const type = product.isPut ? 'Put' : 'Call'
      const optionName = `${product.underlying.symbol}-${product.strike.symbol} ${type} ${product.collateral.symbol} Collateral`
      return {
        label: optionName,
        ...product
      }
    })
  }, [], [])

  // make sure expiry to be UTC 0800
  useEffect(() => {
    if ((expiryTimestamp.minus(28800)).mod(86400).isGreaterThan(0)) {
      setHasWarning(true)
      setWarning('Expiry time need to be 08:00 AM UTC')
    } else {
      setHasWarning(false)
    }
  }, [expiryTimestamp])

  const strikePrice = useMemo(() => fromTokenAmount(new BigNumber(strikePriceReadable), 8), [strikePriceReadable])

  async function createOToken() {
    const factory = new OTokenFactory(web3, networkId, user)
    if (selectedProductIndex === -1) {
      toast('Please select a product')
      return
    }
    const underlying = allProducts[selectedProductIndex].underlying
    const strike = allProducts[selectedProductIndex].strike
    const collateral = allProducts[selectedProductIndex].collateral
    const isPut = allProducts[selectedProductIndex].isPut
    
    await factory.createOToken(underlying.id, strike.id, collateral.id, strikePrice, expiryTimestamp, isPut)
  }

  return (
    <>
      <Header primary="Create new oToken" />
      <SectionTitle title="Choose a product" />
      <DropDown
        items={allProducts ? allProducts.map(p => p.label) : []}
        selected={selectedProductIndex}
        onChange={setSelectedProductIndex}
      />
      <br/><br/>
      <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '3%' }}>

        <div style={{ width: '20%', marginRight: '5%' }}>
          <LabelText label='Underlying' />
          <TokenAddress token={allProducts[selectedProductIndex] ? allProducts[selectedProductIndex].underlying : null} />
        </div>

        <div style={{ width: '20%', marginRight: '5%' }}>
          <LabelText label='Strike' />
          <TokenAddress token={allProducts[selectedProductIndex] ? allProducts[selectedProductIndex].strike : null} />
        </div>

        <div style={{ width: '20%', marginRight: '5%' }}>
          <LabelText label='Collateral' />
          <TokenAddress token={allProducts[selectedProductIndex] ? allProducts[selectedProductIndex].collateral : null} />
        </div>

        <div style={{ width: '20%', marginRight: '5%' }}>
          <LabelText label="Type" />
          {allProducts[selectedProductIndex] ? allProducts[selectedProductIndex].isPut ? "Put" : "Call": 'Put'}
        </div>

      </div>
      <SectionTitle title="Details" />


      <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '1%' }}>

        <div style={{ width: '30%' }}>
          <LabelText label='Strike Price' />
          <TextInput type="number" value={strikePriceReadable} onChange={(e) => setStrikePriceReadable(new BigNumber(e.target.value))} wide />
        </div>

        <div style={{ width: '30%', marginLeft: '5%' }}>
          <LabelText label='Expiry Timestamp' />
          <TextInput type="number" value={expiryTimestamp} onChange={(e) => setExpiryTimestamp(new BigNumber(e.target.value))} wide />
          <Warning text={warning} show={hasExpiryWarning} />
        </div>

        <div style={{ width: '30%', marginLeft: '5%' }}>
          <LabelText label='Create' />
          <Button label="Create" wide onClick={createOToken} />
        </div>

      </div>

    </>
  )
}