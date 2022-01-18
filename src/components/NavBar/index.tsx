import React from 'react'

import { Bar, LinkBase, IconMenu } from '@aragon/ui'
import styled from 'styled-components'
import { storePreference } from '../../utils/storage'
import { SHOW_SIDE_BAR } from '../../constants'
import ConnectButton from './ConnectButton'
import NetworkButton from './NetworkButton'
import Settings from './SettingsButton'

function MyBar({ isSideBarOpen, setSideBarOpen }: { isSideBarOpen: boolean; setSideBarOpen: any }) {
  return (
    <StyledBar
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
          <NetworkButton />
          <ConnectButton />
          <Settings />
        </>
      }
    />
  )
}

const StyledBar = styled(Bar)`
  margin-bottom: 0;
`

export default MyBar
