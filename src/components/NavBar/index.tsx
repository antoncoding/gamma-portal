import React from 'react'

import { Bar, LinkBase, IconMenu } from '@aragon/ui'
import ConnectButton from './ConnectButton'
import Settings from './SettingsButton'

function MyBar({ isSideBarOpen, setSideBarOpen }: { isSideBarOpen: boolean; setSideBarOpen: any }) {
  return (
    <Bar
      primary={
        <LinkBase
          onClick={() => {
            setSideBarOpen(!isSideBarOpen)
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
