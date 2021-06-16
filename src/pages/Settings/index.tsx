import React, { useEffect } from 'react'
import ReactGA from 'react-ga'
import { Container } from 'react-grid-system'
import Header from '../../components/Header'
import ThemeSwitch from './Theme'
import ApproveSwitch from './Approval'
import ClearCache from './ClearCache'
import Network from './Network'
import Refresh from './Refresh'

function Settings({ setTheme }: { setTheme: any }) {
  useEffect(() => ReactGA.pageview('/settings/'), [])
  return (
    <Container>
      <Header primary="Settings" />
      <ThemeSwitch setTheme={setTheme} />
      <br />
      <ApproveSwitch />
      <br />
      {/* <ZeroXFee />
      <br /> */}
      <ClearCache />
      <br />
      <br />
      <Network />
      <br />
      <Refresh />
    </Container>
  )
}

export default Settings
