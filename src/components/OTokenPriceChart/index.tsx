import React from 'react'
import { LineChart } from '@aragon/ui'
import { SubgraphOToken } from '../../types'

export function OTokenPriceChart({ oToken }: { oToken: SubgraphOToken | null }) {
  // Price Chart can't inherit Aragon Theme

  const labels = ['12/21', '12/21', '12/21', '12/21', '12/21', '12/21']

  return (
    <LineChart
      borderColor="black"
      total={2}
      lines={[{ values: [0.2, 0.4, 0.34, 0.8] }]}
      springConfig={{ mass: 1, tension: 120, friction: 80 }}
      label={() => 'oToken'}
      height={90}
      color={() => `#21aae7`}
    />
  )
}
