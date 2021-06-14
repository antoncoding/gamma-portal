import React, { useState } from 'react'
import ReactGA from 'react-ga'
import { Col, Row } from 'react-grid-system'
import 'moment-timezone'

import { Main, Layout } from '@aragon/ui'
import { walletContext } from './contexts/wallet'
import { OrderbookProvider } from './contexts/orderbook'

import NavBar from './components/NavBar'
import SideBar from './components/SideBar'

import Factory from './pages/Protocol/Factory'
import Faucet from './pages/Protocol/Faucet'
import ProtocolHome from './pages/Protocol'
import Account from './pages/Account'
import AccountVault from './pages/Account/AccountVaults'
import ConnectWallet from './pages/Account/ConnectWallet'
import Vault from './pages/Account/VaultDetail'
import Oracle from './pages/Protocol/Oracle'
import OTokenList from './pages/Protocol/OTokenList/index'
import OToken from './pages/Protocol/OTokenList/otoken'
import Operators from './pages/Account/Operators'
import HomePage from './pages/HomePage'
import Settings from './pages/Settings'
import Trade from './pages/Trade'

import Orderbook from './pages/Trade/OrderBookTrade'
import Swap from './pages/Trade/Swap'
import OTC from './pages/Trade/OTC'

import { useConnection } from './hooks/useConnection'

import { getPreference } from './utils/storage'

import { HashRouter as Router, Switch, Route } from 'react-router-dom'

import { SHOW_SIDE_BAR } from './constants'

ReactGA.initialize(process.env.REACT_APP_GA_TRACKINK_ID || '')

function App() {
  const wallet = useConnection()
  const defaultTheme = getPreference('theme', 'light')
  const [theme, setTheme] = useState(defaultTheme)

  const [isSideBarOpen, setSideBarOpen] = useState(getPreference(SHOW_SIDE_BAR, 'true') === 'true')

  return (
    <Router>
      <Main layout={false} theme={theme}>
        <walletContext.Provider value={wallet}>
          <OrderbookProvider>
            <NavBar isSideBarOpen={isSideBarOpen} setSideBarOpen={setSideBarOpen} />
            <Row style={{ height: '100%' }} nogutter>
              {isSideBarOpen && (
                <Col sm={12} md={3} lg={2} xl={2}>
                  <SideBar />
                </Col>
              )}
              <Col
                sm={12}
                md={isSideBarOpen ? 9 : 12}
                lg={isSideBarOpen ? 10 : 12}
                xl={isSideBarOpen ? 10 : 12}
                // offset={maincontentOffset}
              >
                <Switch>
                  {/* without layout */}
                  <Route path="/trade/orderbook">
                    <Row nogutter>
                      <Col sm={12} xl={10} offset={{ xl: 1 }}>
                        <Orderbook />
                      </Col>
                    </Row>
                  </Route>

                  {/* pages with layout */}
                  <Route path="/trade/swap/:otoken">
                    <Swap />
                  </Route>
                  <Route path="/trade/swap/">
                    <Swap />
                  </Route>
                  <Route path="/trade/otc/">
                    <OTC />
                  </Route>
                  <Route path="/trade/">
                    <Trade />
                  </Route>

                  <Route path="/account/:account/operators">
                    <Layout>
                      <Operators />
                    </Layout>
                  </Route>
                  <Route path="/account/:account/vaults/">
                    <Layout>
                      <AccountVault />
                    </Layout>
                  </Route>
                  <Route path="/account/:account">
                    <Layout>
                      <Account />
                    </Layout>
                  </Route>
                  <Route path="/account/">
                    <Layout>
                      <ConnectWallet />
                    </Layout>
                  </Route>
                  <Route path="/vault/:owner/:vaultId">
                    <Layout>
                      <Vault />
                    </Layout>
                  </Route>
                  <Route path="/protocol/faucet">
                    <Layout>
                      <Faucet />
                    </Layout>
                  </Route>
                  <Route path="/protocol/oracle">
                    <Layout>
                      <Oracle />
                    </Layout>
                  </Route>
                  <Route path="/protocol/factory/">
                    <Layout>
                      <Factory />
                    </Layout>
                  </Route>
                  <Route path="/protocol/otokens/">
                    <Layout>
                      <OTokenList />
                    </Layout>
                  </Route>
                  <Route path="/protocol/">
                    <Layout>
                      <ProtocolHome />
                    </Layout>
                  </Route>
                  <Route path="/otoken/:otoken">
                    <Layout>
                      <OToken />
                    </Layout>
                  </Route>
                  <Route path="/settings/">
                    <Layout>
                      <Settings setTheme={setTheme} />
                    </Layout>
                  </Route>
                  <Route path="/">
                    <Layout>
                      <HomePage />
                    </Layout>
                  </Route>
                </Switch>
              </Col>
            </Row>
          </OrderbookProvider>
        </walletContext.Provider>
      </Main>
    </Router>
  )
}

export default App
