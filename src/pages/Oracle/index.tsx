import React, { useState, useEffect, useMemo } from 'react'
import { Header, DataView, DropDown, useToast, Tag, Help } from '@aragon/ui'
import BigNumber from 'bignumber.js'
import LabelText from '../../components/LabelText'
import CustomIdentityBadge from '../../components/CustomIdentityBadge'
import { useConnectedWallet } from '../../contexts/wallet'
import { useAsyncMemo } from '../../hooks/useAsyncMemo'
import { expiryToDate, toTokenAmount } from '../../utils/math'
import { getOracleAssetsAndPricers } from '../../utils/graph'
import SectionTitle from '../../components/SectionHeader'

import { SubgraphPriceEntry } from '../../types'
// import { CTokenPricer, USDCPricer, CLPricer } from '../../utils/contracts/pricers'
import { pricerMap } from './config'
import { ZERO_ADDR } from '../../constants/addresses'
import { PRICE_SUBMISSION } from '../../constants/dataviewContents'

export default function Oracle() {
  const { networkId } = useConnectedWallet()
  const toast = useToast()
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(-1)
  const [assetHistory, setAssetHistory] = useState<SubgraphPriceEntry[]>([])
  // const [isSearchingID, setIsSearching] = useState(false)

  // const [expiryIdxToSubmit, setExpiryIdxToSubmit] = useState(-1)

  const allOracleAssets = useAsyncMemo(
    async () => {
      const assets = await getOracleAssetsAndPricers(networkId, toast)
      setIsLoadingHistory(false)
      if (assets && assets.length > 0) setSelectedAssetIndex(0)
      return assets === null ? [] : assets
    },
    [],
    [],
  )

  // const allOTokens = useAsyncMemo(async () => {
  //   const oTokens = await getOTokens(networkId, toast)
  //   return oTokens === null ? [] : oTokens
  // }, [], [])

  // const unsetExpiries = useMemo(() => {
  //   const alreadySet = assetHistory.map(entry => Number(entry.expiry))
  //   const unique = new Set(allOTokens
  //     .map(o => Number(o.expiryTimestamp))
  //     .filter(expiry => expiry < Date.now() / 1000)
  //     .filter(expiry => !alreadySet.includes(expiry)))
  //   return Array.from(unique)

  // }, [assetHistory, allOTokens])

  const haveValidSelection = useMemo(() => allOracleAssets.length > 0 && selectedAssetIndex !== -1, [
    allOracleAssets,
    selectedAssetIndex,
  ])

  // update ths history array
  useEffect(() => {
    if (!haveValidSelection) return
    setAssetHistory(allOracleAssets[selectedAssetIndex].prices)
  }, [selectedAssetIndex, allOracleAssets, haveValidSelection])

  // const setPrice = useCallback(
  //   () => {
  //     const selectedAsset = allOracleAssets[selectedAssetIndex].asset
  //     const pricer = allOracleAssets[selectedAssetIndex].pricer.id
  //     if(web3 === null) {
  //       toast('Please connect wallet first')
  //       return
  //     }
  //     if (pricerMap[selectedAsset.symbol] === PricerTypes.CTokenPricer) {
  //       const contract = new CTokenPricer(web3, pricer , networkId, user)
  //       return contract.setPrice(unsetExpiries[expiryIdxToSubmit].toString())
  //     } else if (pricerMap[selectedAsset.symbol] === PricerTypes.USDCPricer) {
  //       const contract = new USDCPricer(web3, pricer, networkId, user)
  //       return contract.setPrice(unsetExpiries[expiryIdxToSubmit].toString())
  //     } else {
  //       const contract = new CLPricer(web3, pricer, networkId, user)
  //       toast('Fetching Data from Chainlink Oracle, this could take a while...')
  //       return contract.setPrice(unsetExpiries[expiryIdxToSubmit].toString(), toast, setIsSearching)
  //     }
  //   },
  //   [allOracleAssets, selectedAssetIndex, expiryIdxToSubmit, networkId, user, web3, unsetExpiries, toast],
  // )

  return (
    <>
      <Header primary="Oracle" />
      In Opyn v2, we need on-chain prices for underlying, strike and collateral assets to settle oTokens.
      <SectionTitle title="Choose an Asset" />
      <DropDown
        items={allOracleAssets ? allOracleAssets.map(p => p.asset.symbol) : []}
        selected={selectedAssetIndex}
        onChange={setSelectedAssetIndex}
      />
      <SectionTitle title="Asset Detail" />
      <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '3%' }}>
        <div style={{ width: '30%' }}>
          <LabelText label="Pricer" />
          <CustomIdentityBadge
            label={haveValidSelection ? pricerMap[allOracleAssets[selectedAssetIndex].asset.symbol] : 'Unknown'}
            entity={haveValidSelection ? allOracleAssets[selectedAssetIndex].pricer.id : ZERO_ADDR}
          />
        </div>

        <div style={{ width: '30%' }}>
          <div style={{ display: 'flex' }}>
            <LabelText label="Locking Period" />
            <Help hint={'What is locking period'}>
              Period of time after expiry that price submission will not be accepted.
            </Help>
          </div>
          <div style={{ paddingTop: '3%' }}>
            {haveValidSelection ? Number(allOracleAssets[selectedAssetIndex].pricer.lockingPeriod) / 60 : 0} Minutes
          </div>
        </div>

        <div style={{ width: '30%' }}>
          <div style={{ display: 'flex' }}>
            {' '}
            <LabelText label="Dispute Period" />{' '}
            <Help hint={'What is dispute period'}>
              Period of time after price submission that the price can be overrided by the disputer.
            </Help>{' '}
          </div>
          <div style={{ paddingTop: '3%' }}>
            {haveValidSelection ? Number(allOracleAssets[selectedAssetIndex].pricer.disputePeriod) / 60 : 0} Minutes
          </div>
        </div>
      </div>
      {/* <SectionTitle title="Submit Price" />

      <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '3%' }}>
        <div style={{ width: '30%' }}>
          <DropDown 
            placeholder={unsetExpiries.length > 0 ? 'Choose Expiry' : 'No unset expiry'}
            disabled={unsetExpiries.length===0}
            items={unsetExpiries ? unsetExpiries.map(expiry => expiryToDate(expiry)) : []}
            selected={expiryIdxToSubmit}
            onChange={setExpiryIdxToSubmit}
          />
        </div>

        <div style={{ width: '30%' }}>
          <LabelText label=' ' /> 
          <Button 
            disabled={!haveValidSelection || expiryIdxToSubmit === -1}
            label={isSearchingID ? 'Checking Oracle...' : 'Set Price'}
            onClick={setPrice}
            icon={isSearchingID ? <LoadingRing /> : null}
          />
        </div>
      </div> */}
      <SectionTitle title="Price Submissions" />
      <DataView
        status={isLoadingHistory ? 'loading' : 'default'}
        fields={['Expiry', 'Price', 'Submitted Timestamp', 'Submitted By']}
        emptyState={PRICE_SUBMISSION}
        entriesPerPage={8}
        entries={assetHistory.sort((a, b) => (Number(a.expiry) > Number(b.expiry) ? -1 : 1))}
        renderEntry={({ expiry, reportedTimestamp, price, isDisputed }: SubgraphPriceEntry) => {
          const tag = isDisputed ? <Tag mode="new"> Disputer </Tag> : <Tag> Pricer </Tag>
          return [
            expiryToDate(expiry),
            `${toTokenAmount(new BigNumber(price), 8).toString()} USD`,
            reportedTimestamp,
            tag,
          ]
        }}
      />
    </>
  )
}
