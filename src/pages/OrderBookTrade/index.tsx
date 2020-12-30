import React, { useState, useMemo } from 'react'

import TradeHeader from './Header'
import { SubgraphOToken } from '../../types'

export default function TradePage() {
  const [oTokens, setOTokens] = useState<SubgraphOToken[]>([])

  return (
    <>
      <TradeHeader setOTokens={setOTokens} />
    </>
  )
}
