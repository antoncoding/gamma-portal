import React, { useState } from 'react'

import TradeHeader from './Header'
import Board from './Board'
import MintPanel from './MintPanel'

import { SubgraphOToken } from '../../types'

export default function TradePage() {
  const [selectedOToken, setSelectedOToken] = useState<SubgraphOToken | null>(null)
  const [oTokens, setOTokens] = useState<SubgraphOToken[]>([])

  const [mintPanelOpened, setMintPanelOpened] = useState(true)

  return (
    <>
      <TradeHeader setOTokens={setOTokens} />
      <Board oTokens={oTokens} selectedOToken={selectedOToken} setSelectedOToken={setSelectedOToken} />
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%' }}></div>
        <div style={{ width: '50%' }}></div>
      </div>
      <MintPanel oToken={selectedOToken} opened={mintPanelOpened} onClose={() => setMintPanelOpened(false)} />
    </>
  )
}
