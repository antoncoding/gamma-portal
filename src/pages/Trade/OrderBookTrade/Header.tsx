import React, { useState, useMemo, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { Col, Row } from 'react-grid-system'
import { Header, DropDown, LoadingRing } from '@aragon/ui'

import { useOTokenInSeries, useAllSeries } from '../../../hooks'

import { toUTCDateString } from '../../../utils/others'
import { Token } from '../../../types'
import { OptionChainMode, OC_MODE_KEY } from '../../../constants'
import { storePreference } from '../../../utils/storage'

type HeaderProps = {
  setOTokens: any
  spotPrice: BigNumber
  underlying: Token
  setSelectedUnderlying: React.Dispatch<React.SetStateAction<Token>>
  optionChainMode: OptionChainMode
  setOptionChainMode: React.Dispatch<React.SetStateAction<OptionChainMode>>
}

const modes = [OptionChainMode.All, OptionChainMode.Call, OptionChainMode.Put]

export default function TradeHeadBar({
  underlying,
  spotPrice,
  setOTokens,
  setSelectedUnderlying,
  optionChainMode,
  setOptionChainMode,
}: HeaderProps) {
  const [seriesId, setSeiresId] = useState(0)
  const [expiryId, setExpiryId] = useState(0)

  const { allSeries } = useAllSeries()

  const series = useMemo(() => (allSeries.length === 0 ? null : allSeries[seriesId]), [allSeries, seriesId])

  useEffect(() => {
    document.title = `${underlying.symbol} ($${spotPrice.toFixed(2)})`
  }, [spotPrice, underlying])

  useEffect(() => {
    if (series !== null) setSelectedUnderlying({ ...series.underlying, id: series.underlying.id })
  }, [series, setSelectedUnderlying])

  const { allOtokens: allOToken } = useOTokenInSeries(series?.underlying.id, series?.strike.id)

  const uniqueExpiries = useMemo(() => {
    return allOToken
      .filter(o => optionChainMode === OptionChainMode.All || (optionChainMode === OptionChainMode.Put) === o.isPut)
      .filter(o => o.underlyingAsset.id === series?.underlying.id && o.strikeAsset.id === series?.strike.id)
      .reduce((prev: string[], curr) => {
        if (!prev.includes(curr.expiryTimestamp)) return [...prev, curr.expiryTimestamp]
        return prev
      }, [])
      .sort((a, b) => (Number(a) > Number(b) ? 1 : -1))
  }, [allOToken, series, optionChainMode])

  const expiry = useMemo(() => (uniqueExpiries.length === 0 ? null : uniqueExpiries[expiryId]), [
    uniqueExpiries,
    expiryId,
  ])

  const oTokens = useMemo(
    () =>
      allOToken
        .filter(o => optionChainMode === OptionChainMode.All || (optionChainMode === OptionChainMode.Put) === o.isPut)
        .filter(o => o.underlyingAsset.id === series?.underlying.id && o.strikeAsset.id === series?.strike.id)
        .filter(o => o.expiryTimestamp === expiry),
    [allOToken, expiry, series, optionChainMode],
  )

  useEffect(() => {
    setOTokens(oTokens)
  }, [oTokens, setOTokens])

  return (
    <>
      <Row>
        <Col xl={8} lg={6} md={6}>
          <Header primary={`Trade ${underlying.symbol} ($${spotPrice.toFixed(2)})`} />
        </Col>
        <Col xl={4} lg={6} md={6}>
          <Row style={{ paddingTop: 25 }}>
            <Col lg={4} md={4} sm={12}>
              <DropDown
                placeholder={allSeries.length === 0 ? <LoadingRing /> : 'Select series'}
                items={allSeries.map(s => `${s.underlying.symbol}-${s.strike.symbol}`)}
                disabled={allSeries.length === 0}
                selected={seriesId}
                onChange={setSeiresId}
                wide={true}
              />
            </Col>
            <Col lg={4} md={4} sm={12}>
              <DropDown
                placeholder={uniqueExpiries.length === 0 ? <LoadingRing /> : 'Select Expiry'}
                items={uniqueExpiries.map(e => toUTCDateString(Number(e)))}
                disabled={uniqueExpiries.length === 0}
                selected={expiryId}
                onChange={setExpiryId}
                wide={true}
              />
            </Col>
            <Col lg={4} md={4} sm={12}>
              <DropDown
                items={modes}
                selected={modes.findIndex(i => i === optionChainMode)}
                onChange={i => {
                  setOptionChainMode(modes[i])
                  storePreference(OC_MODE_KEY, modes[i])
                }}
                wide={true}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}
