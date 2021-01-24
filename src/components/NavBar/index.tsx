import React from 'react'

import { Bar, LinkBase, IconMenu } from '@aragon/ui'
import { storePreference } from '../../utils/storage'
import { SHOW_SIDE_BAR } from '../../constants'
import ConnectButton from './ConnectButton'
import Settings from './SettingsButton'

function MyBar({ isSideBarOpen, setSideBarOpen }: { isSideBarOpen: boolean; setSideBarOpen: any }) {
  return (
    <Bar
      primary={
        <LinkBase
          onClick={() => {
            setSideBarOpen(!isSideBarOpen)
            storePreference(SHOW_SIDE_BAR, String(!isSideBarOpen))
          }}
        >
          <IconMenu />
        </LinkBase>
      }
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
