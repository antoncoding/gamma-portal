import React, { useEffect, useState, useContext, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'

import { Header, DropDown, Layout, LoadingRing } from '@aragon/ui'

import { useOTokenInSeries } from '../../hooks/useOTokens'
import { useAllSeries } from '../../hooks/useAllProducts'

export default function OrderBookTrade() {
  const { allSeries } = useAllSeries()
  const [seriesId, setSeiresId] = useState(0)

  const series = useMemo(() => (allSeries.length === 0 ? null : allSeries[seriesId]), [allSeries, seriesId])

  const { allOtokens: oTokens } = useOTokenInSeries(series?.underlying.id, series?.strike.id)

  return (
    <>
      <Header
        primary={'Trade'}
        secondary={
          <DropDown
            placeholder={allSeries.length === 0 ? <LoadingRing /> : 'Select series'}
            items={allSeries.map(s => `${s.underlying.symbol}-${s.strike.symbol}`)}
            disabled={allSeries.length === 0}
            selected={seriesId}
            onChange={setSeiresId}
          />
        }
      />
    </>
  )
}
