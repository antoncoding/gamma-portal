import React, { useState, useEffect, useMemo, useCallback } from 'react'
import ReactGA from 'react-ga'
import { Row, Col } from 'react-grid-system'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import {
  Header,
  TextInput,
  Button,
  DropDown,
  useToast,
  LoadingRing,
  AddressField,
  Help,
  SyncIndicator,
} from '@aragon/ui'
import LabelText from '../../../components/LabelText'
import Warning from '../../../components/Warning'
import { getNextFriday, fromTokenAmount } from '../../../utils/math'
import SectionTitle from '../../../components/SectionHeader'
import TokenAddress from '../../../components/TokenAddress'
import { ZERO_ADDR } from '../../../constants/addresses'
import WarningText from '../../../components/Warning'
import { useFactory } from '../../../hooks/useFactory'
import { useAllProducts } from '../../../hooks/useAllProducts'

export default function CreateOption() {
  const factory = useFactory()

  useEffect(() => {
    ReactGA.pageview('/protocol/factory/')
  }, [])

  const toast = useToast()
  const [selectedProductIndex, setSelectedProductIndex] = useState(-1)

  const [strikePriceReadable, setStrikePriceReadable] = useState<BigNumber>(new BigNumber(500))
  const [expiryTimestamp, setExpiryTimestamp] = useState<BigNumber>(new BigNumber(getNextFriday()))
  const [hasExpiryWarning, setHasWarning] = useState<boolean>(false)
  const [expiryWarning, setExpiryWarning] = useState<string>('')

  const [isDuplicated, setIsDuplicated] = useState(false)
  const [isCreating, setIsCreating] = useState(Boolean)
  const [targetAddress, setTargetAddress] = useState(ZERO_ADDR)

  const { allProducts } = useAllProducts()

  // make sure expiry to be UTC 0800
  useEffect(() => {
    if (expiryTimestamp.minus(28800).mod(86400).isGreaterThan(0)) {
      setHasWarning(true)
      setExpiryWarning('Expiry time need to be 08:00 AM UTC')
    } else {
      setHasWarning(false)
    }
  }, [expiryTimestamp])

  const strikePrice = useMemo(() => fromTokenAmount(new BigNumber(strikePriceReadable), 8), [strikePriceReadable])

  const createOToken = useCallback(async () => {
    if (selectedProductIndex === -1) {
      toast('Please select a product')
      return
    }
    const underlying = allProducts[selectedProductIndex].underlying
    const strike = allProducts[selectedProductIndex].strike
    const collateral = allProducts[selectedProductIndex].collateral
    const isPut = allProducts[selectedProductIndex].isPut
    setIsCreating(true)
    // check if the option has been created.
    try {
      await factory.createOToken(underlying.id, strike.id, collateral.id, strikePrice, expiryTimestamp, isPut)
    } catch (error) {
    } finally {
      setIsCreating(false)
    }
  }, [factory, allProducts, selectedProductIndex, expiryTimestamp, strikePrice, toast])

  const computeAddress = useCallback(
    async (idx, strikePrice, expiry) => {
      if (idx === -1) {
        return
      }
      const underlying = allProducts[idx].underlying
      const strike = allProducts[idx].strike
      const collateral = allProducts[idx].collateral
      const isPut = allProducts[idx].isPut
      // check if the option has been created.
      const targetAddress = await factory.getTargetOtokenAddress(
        underlying.id,
        strike.id,
        collateral.id,
        strikePrice,
        expiry,
        isPut,
      )
      setTargetAddress(targetAddress)
      const isCreated = await factory.isCreated(underlying.id, strike.id, collateral.id, strikePrice, expiry, isPut)
      setIsDuplicated(isCreated)
    },
    [allProducts, factory],
  )

  // recompute address when input changes
  useEffect(() => {
    computeAddress(selectedProductIndex, strikePrice, expiryTimestamp)
  }, [computeAddress, selectedProductIndex, strikePrice, expiryTimestamp])

  return (
    <>
      <SyncIndicator visible={allProducts.length === 0} children={'Syncing data... 🎄'} />
      <Header primary="oToken Factory" />
      <SectionTitle title="Create new oToken" />
      <DropDown
        disabled={allProducts.length === 0}
        placeholder={allProducts.length === 0 ? <LoadingRing /> : 'Select product'}
        items={allProducts ? allProducts.map(p => p.label) : []}
        selected={selectedProductIndex}
        onChange={setSelectedProductIndex}
      />
      <br />
      <br />
      <Row style={{ paddingBottom: '3%', alignItems: 'center' }}>
        <CellQuarter>
          <LabelText label="Underlying" />
          <TokenAddress
            token={allProducts[selectedProductIndex] ? allProducts[selectedProductIndex].underlying : null}
            nullLabel="N/A"
          />
        </CellQuarter>

        <CellQuarter>
          <LabelText label="Strike" />
          <TokenAddress
            token={allProducts[selectedProductIndex] ? allProducts[selectedProductIndex].strike : null}
            nullLabel="N/A"
          />
        </CellQuarter>

        <CellQuarter>
          <LabelText label="Collateral" />
          <TokenAddress
            token={allProducts[selectedProductIndex] ? allProducts[selectedProductIndex].collateral : null}
            nullLabel="N/A"
          />
        </CellQuarter>

        <CellQuarter>
          <LabelText label="Type" />
          {allProducts[selectedProductIndex] ? (allProducts[selectedProductIndex].isPut ? 'Put' : 'Call') : 'Put'}{' '}
          Option
        </CellQuarter>
        {/* </div> */}
      </Row>
      <SectionTitle title="Details" />

      <Row style={{ alignItems: 'center', paddingBottom: '1%' }}>
        <CellQuarter>
          <LabelText label="Strike Price" />
          <TextInput
            type="number"
            value={strikePriceReadable}
            onChange={e => setStrikePriceReadable(new BigNumber(e.target.value))}
            wide
          />
        </CellQuarter>

        <CellQuarter>
          <LabelText label="Expiry Timestamp" />
          <TextInput
            type="date"
            value={moment.utc(expiryTimestamp.toNumber() * 1000).format('yyyy-MM-DD')}
            onChange={e => {
              const date = moment.utc(e.target.value)
              date.set({ hour: 8 })
              setExpiryTimestamp(new BigNumber(date.unix()))
            }}
            wide
          />
          <Warning text={expiryWarning} show={hasExpiryWarning} />
        </CellQuarter>

        <CellQuarter>
          <div style={{ display: 'flex' }}>
            {' '}
            <LabelText label="Create!" /> <WarningText text="This option has been created" show={isDuplicated} />{' '}
          </div>
          <Button wide disabled={isDuplicated || isCreating || hasExpiryWarning} onClick={createOToken}>
            {' '}
            {isCreating ? (
              <>
                {' '}
                <LoadingRing /> <span style={{ paddingLeft: '5px' }}>Createing </span>{' '}
              </>
            ) : (
              'Create'
            )}{' '}
          </Button>
        </CellQuarter>

        <CellQuarter>
          <div style={{ display: 'flex' }}>
            <LabelText label="Output" />
            <Help hint={'What is this output address'}>
              The address the new oToken will be created at. In Opyn V2, we use CREATE2 opcode to create new oToken
              contracts, so we can predict a contract address before actual deployments.
            </Help>
          </div>
          <AddressField address={targetAddress} />
        </CellQuarter>
      </Row>
    </>
  )
}

function CellQuarter(props) {
  return (
    <Col xs={10} md={3} offset={{ xs: 1, md: 0 }} style={{ paddingBottom: '2%' }}>
      {props.children}
    </Col>
  )
}
