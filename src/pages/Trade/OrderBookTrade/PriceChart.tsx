import React, { useMemo } from 'react'
import Chart from 'kaktana-react-lightweight-charts'
import { Box, useTheme } from '@aragon/ui'

import { useOTokenTrades } from '../../../hooks'
import { SubgraphOToken, OTokenTrade } from '../../../types'
import { toTokenAmount } from '../../../utils/math'
import { simplifyOTokenSymbol } from '../../../utils/others'

type PriceChartProps = {
  selectedOToken: SubgraphOToken
}

export default function PriceChart({ selectedOToken }: PriceChartProps) {
  const { trades } = useOTokenTrades(selectedOToken.id, 30)
  const theme = useTheme()

  const options = useMemo(() => {
    return {
      alignLabels: true,
      priceScale: {
        scaleMargins: {
          top: 0.25,
          bottom: 0.15,
        },
      },
      timeScale: {
        // rightOffset: 12,
        barSpacing: 8,
        fixLeftEdge: true,
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: true,
        borderVisible: false,
        borderColor: '#fff000',
        visible: true,
        timeVisible: true,
        secondsVisible: false,
      },
      localization: {
        priceFormatter: function (price) {
          return '$' + price
        },
      },
      layout: {
        backgroundColor: `#${theme.surface.hexColor}`,
        textColor: `#${theme.surfaceContent.hexColor}`,
        fontSize: 12,
      },
    }
  }, [theme])

  const chartData = useMemo(() => {
    const data =
      trades === null
        ? []
        : trades
            .filter((t: OTokenTrade) => t.paymentToken.symbol === 'USDC')
            .sort((a, b) => (Number(a.timestamp) > Number(b.timestamp) ? 1 : -1)) // old to new
            .map((t: OTokenTrade) => {
              const timestamp = Number(t.timestamp)
              const price = toTokenAmount(t.paymentTokenAmount, 6).div(toTokenAmount(t.oTokenAmount, 8)).toNumber()

              return { value: price, time: timestamp }
            })
            .reduce((prev: { value: number; time: number }[], curr) => {
              const idx = prev.length - 1
              if (prev.length > 0 && prev[idx].time === curr.time) {
                const copy = [...prev]
                copy[idx].value = (copy[idx].value + curr.value) / 2
                return copy
              } else {
                return [...prev, curr]
              }
            }, [])

    return { data }
  }, [trades])

  return (
    <Box heading={`price chart`}>
      <Chart
        legend={simplifyOTokenSymbol(selectedOToken.symbol)}
        options={options}
        lineSeries={[chartData]}
        autoWidth
        height={320}
        darkTheme={theme._name === 'dark'}
      />
    </Box>
  )
}
