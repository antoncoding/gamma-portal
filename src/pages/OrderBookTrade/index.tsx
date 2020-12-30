import React, { useState, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'

import { Header, DropDown, Layout, LoadingRing } from '@aragon/ui'

import { useOTokenInSeries } from '../../hooks/useOTokens'
import { useAllSeries } from '../../hooks/useAllProducts'
import { toUTCDateString } from '../../utils/others'

export default function OrderBookTrade() {
  const [seriesId, setSeiresId] = useState(0)
  const [expiryId, setExpiryId] = useState(0)

  const { allSeries } = useAllSeries()

  const series = useMemo(() => (allSeries.length === 0 ? null : allSeries[seriesId]), [allSeries, seriesId])
  const { allOtokens: allOToken } = useOTokenInSeries(series?.underlying.id, series?.strike.id)

  const uniqueExpiries = useMemo(() => {
    return allOToken
      .reduce((prev: string[], curr) => {
        if (!prev.includes(curr.expiryTimestamp)) return [...prev, curr.expiryTimestamp]
        return prev
      }, [])
      .sort((a, b) => (Number(a) > Number(b) ? 1 : -1))
  }, [allOToken])

  const expiry = useMemo(() => (uniqueExpiries.length === 0 ? null : uniqueExpiries[expiryId]), [
    uniqueExpiries,
    expiryId,
  ])

  const oTokens = useMemo(
    () =>
      allOToken
        .filter(o => o.underlyingAsset.id === series?.underlying.id && o.strikeAsset.id === series?.strike.id)
        .filter(o => o.expiryTimestamp === expiry),
    [allOToken, uniqueExpiries, expiry, series],
  )

  console.log(`oTokens`, oTokens)

  return (
    <>
      <Header
        primary={'Trade'}
        secondary={
          <div style={{ display: 'flex' }}>
            <DropDown
              placeholder={allSeries.length === 0 ? <LoadingRing /> : 'Select series'}
              items={allSeries.map(s => `${s.underlying.symbol}-${s.strike.symbol}`)}
              disabled={allSeries.length === 0}
              selected={seriesId}
              onChange={setSeiresId}
            />
            <div style={{ padding: '10px' }}></div>
            <DropDown
              placeholder={uniqueExpiries.length === 0 ? <LoadingRing /> : 'Select Expiry'}
              items={uniqueExpiries.map(e => toUTCDateString(Number(e)))}
              disabled={uniqueExpiries.length === 0}
              selected={seriesId}
              onChange={setExpiryId}
            />
          </div>
        }
      />
    </>
  )
}
