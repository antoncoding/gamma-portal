import React from 'react'

import { Checkbox } from '@aragon/ui'
import { TradeAction, SHOW_BOTH_KEY, SHOW_MINE_KEY } from '../../../constants'
import { storePreference } from '../../../utils/storage'

type Props = {
  action: TradeAction
  showBoth: boolean
  setShowBoth: any
  showMine: boolean
  setShowMine: any
}

export default function Settings({ action, showBoth, setShowBoth, showMine, setShowMine }: Props) {
  return (
    <div style={{ display: 'flex', fontSize: 12, opacity: 0.7 }}>
      <div style={{ paddingTop: '5px' }}>
        <Checkbox
          checked={showBoth}
          onChange={(checked: boolean) => {
            setShowBoth(checked)
            storePreference(SHOW_BOTH_KEY, String(checked))
          }}
        />
      </div>
      <div style={{ padding: '8px' }}>Show {action === TradeAction.Buy ? 'bids' : 'asks'}</div>
      <div style={{ paddingTop: '5px' }}>
        <Checkbox
          checked={showMine}
          onChange={(checked: boolean) => {
            setShowMine(checked)
            storePreference(SHOW_MINE_KEY, String(checked))
          }}
        />
      </div>
      <div style={{ padding: '8px' }}>Show My Orders</div>
    </div>
  )
}
