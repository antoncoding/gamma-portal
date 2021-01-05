import React from 'react'
import ReactGA from 'react-ga'
import { Header } from '@aragon/ui'

import ThemeSwitch from './Theme'
import ApproveSwitch from './Approval'
import ClearCache from './ClearCache'
import Network from './Network'
import Refresh from './Refresh'

function Settings({ setTheme }: { setTheme: any }) {
  ReactGA.pageview('/settings/')
  return (
    <>
      <Header primary="Settings" />
      <ThemeSwitch setTheme={setTheme} />
      <br />
      <ApproveSwitch />
      <br />
      <ClearCache />
      <br />
      <br />
      <Network />
      <br />
      <Refresh />
    </>
  )
}

export default Settings
