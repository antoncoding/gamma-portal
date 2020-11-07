import React, { useState, useEffect, useContext } from 'react'
import { Header, DataView, DropDown, useToast, Tag } from '@aragon/ui'
import BigNumber from 'bignumber.js'
import Status from '../../components/DataViewStatusEmpty'
import { walletContext } from '../../contexts/wallet'
import { useAsyncMemo } from '../../hooks/useAsyncMemo'
import { expiryToDate, toTokenAmount } from '../../utils/math'
import { getOracleAssetsAndPricers } from '../../utils/graph'
import SectionTitle from '../../components/SectionHeader'

import { SubgraphPriceEntry } from '../../types'

export default function Oracle() {

  const { networkId } = useContext(walletContext)
  const toast = useToast()
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(-1)
  const [assetHistory, setAssetHistory] = useState<SubgraphPriceEntry[]>([])

  // const [hasExpiryWarning, setHasWarning] = useState<Boolean>(false)
  // const [warning, setWarning] = useState<string>('')

  const allOracleAssets = useAsyncMemo(async () => {
    const assets = await getOracleAssetsAndPricers(networkId, toast)
    setIsLoadingHistory(false)
    return assets === null ? [] : assets
  }, [], [])

  // update ths history array
  useEffect(() => {
    if (allOracleAssets.length === 0 || selectedAssetIndex === -1) return
    setAssetHistory(allOracleAssets[selectedAssetIndex].prices)
  },
  [selectedAssetIndex, allOracleAssets]
  )

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
      <br/><br/>
      <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '3%' }}>

      </div>
      <SectionTitle title="Price Submissions" />
      <DataView
        status={isLoadingHistory ? 'loading' : 'default'}
        fields={['Expiry', 'Price', 'Submitted Timestamp', 'Submitted By']}
        statusEmpty={<Status label={"No submissions"} />}
        entries={assetHistory.sort((a,b) => Number(a.expiry) > Number(b.expiry) ? -1 : 1)}
        renderEntry={({expiry, reportedTimestamp, price, isDisputed}: SubgraphPriceEntry) => {
          const tag = isDisputed ? <Tag mode="new"> Disputer </Tag> : <Tag> Pricer </Tag>
          return [
            expiryToDate(expiry),
            `${toTokenAmount(new BigNumber(price), 8).toString()} USD`,
            reportedTimestamp,
            tag
            ]
        }}
      />
    </>
  )
}