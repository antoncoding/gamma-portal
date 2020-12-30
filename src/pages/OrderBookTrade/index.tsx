import React, { useState, useMemo } from 'react'

import TradeHeader from './Header'
import Board from './Board'
import { SubgraphOToken } from '../../types'

export default function TradePage() {
  const [selectedOToken, setSelectedOToken] = useState<SubgraphOToken | null>(null)
  const [oTokens, setOTokens] = useState<SubgraphOToken[]>([])

  console.log('selected', selectedOToken)

  return (
    <>
      <TradeHeader setOTokens={setOTokens} />
      <Board oTokens={oTokens} selectedOToken={selectedOToken} setSelectedOToken={setSelectedOToken} />
    </>
  )
}
