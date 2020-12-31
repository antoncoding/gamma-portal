import React from 'react'

import { SidePanel } from '@aragon/ui'

import { SubgraphOToken } from '../../types'

type PanelProps = {
  oToken: SubgraphOToken | null
  opened: boolean
  onClose: Function
}

export default function TradeDetailPanel({ oToken, onClose, opened }: PanelProps) {
  return (
    <SidePanel title={`Trade ${oToken?.symbol}`} opened={opened && oToken !== null} onClose={onClose}>
      Sidepanel content goes here.
    </SidePanel>
  )
}
