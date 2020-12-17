import React from 'react'

import { Bar } from '@aragon/ui'
import ConnectButton from './ConnectButton'
import Settings from './SettingsButton'

function MyBar() {
  return (
    <Bar
      style={{ margin: 0 }}
      secondary={
        <>
          <ConnectButton />
          <Settings />
        </>
      }
    />
  )
}

export default MyBar
