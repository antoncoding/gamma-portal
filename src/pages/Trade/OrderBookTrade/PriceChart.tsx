import React, { useMemo } from 'react'
import { Scatter } from 'react-chartjs-2'
import { Box } from '@aragon/ui'

import { useOTokenTrades } from '../../../hooks'
import { themeColors } from '../../../constants'
import { SubgraphOToken, OTokenTrade } from '../../../types'
import { toTokenAmount, timeSince } from '../../../utils/math'

type PriceChartProps = {
  selectedOToken: SubgraphOToken
}

export default function PriceChart({ selectedOToken }: PriceChartProps) {
  const { trades } = useOTokenTrades(selectedOToken.id, 8640000, 30)

  const { chartData, options } = useMemo(() => {
    const data =
      trades === null
        ? []
        : trades
            .filter((t: OTokenTrade) => t.paymentToken.symbol === 'USDC')
            .sort((a, b) => (Number(a.timestamp) > Number(b.timestamp) ? 1 : -1)) // old to new
            .map((t: OTokenTrade) => {
              // console.log(`transactionHash`, t.transactionHash)
              const timestamp = t.timestamp
              const price = toTokenAmount(t.paymentTokenAmount, 6).div(toTokenAmount(t.oTokenAmount, 8)).toNumber()

              return { y: price, x: timestamp }
            })

    return {
      chartData: {
        datasets: [
          {
            label: 'all',
            borderWidth: 1,
            borderColor: themeColors[0],
            backgroundColor: themeColors[4],
            data,
            fill: true,
            showLine: true,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                // Include a dollar sign in the ticks
                callback: function (value, index, values) {
                  return '$' + value
                },
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                // Include a dollar sign in the ticks
                callback: function (value, index, values) {
                  return timeSince(value * 1000)
                },
              },
            },
          ],
        },
      },
    }
  }, [trades])

  return (
    <Box heading={`price chart`}>
      <Scatter options={options} data={chartData} />
    </Box>
  )
}
