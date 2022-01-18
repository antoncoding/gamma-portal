import React, { useEffect } from 'react'
import ReactGA from 'react-ga'
import Header from '../../components/Header'
import StyledContainer from '../../components/StyledContainer'
import ThemeSwitch from './Theme'
import ApproveSwitch from './Approval'
import ClearCache from './ClearCache'
// import Network from './Network'
import Refresh from './Refresh'

function Settings({ setTheme }: { setTheme: any }) {
  useEffect(() => ReactGA.pageview('/settings/'), [])
  return (
    <StyledContainer>
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
      {/* <Network /> */}
      {/* <br /> */}
      <Refresh />
    </StyledContainer>
  )
}

export default Settings
