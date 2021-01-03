import React, { useState } from 'react'
// import Moment from 'react-moment';
import 'moment-timezone'

import { Main, Layout } from '@aragon/ui'
import { walletContext } from './contexts/wallet'
import { OrderbookProvider } from './contexts/orderbook'

import NavBar from './components/NavBar'
import SideBar from './components/SideBar'

import Factory from './pages/Protocol/Factory'
import ProtocolHome from './pages/Protocol'
import Account from './pages/Account'
import AccountVault from './pages/Account/AccountVaults'
import ConnectWallet from './pages/Account/ConnectWallet'
import Vault from './pages/Account/VaultDetail'
import Oracle from './pages/Protocol/Oracle'
import Operators from './pages/Account/Operators'
import HomePage from './pages/HomePage'
import Settings from './pages/Settings'
import Trade from './pages/Trade'

import Orderbook from './pages/Trade/OrderBookTrade'
import Swap from './pages/Trade/Swap'
import { useConnection } from './hooks/useConnection'

import { getPreference } from './utils/storage'

import { HashRouter as Router, Switch, Route } from 'react-router-dom'
function App() {
  const wallet = useConnection()
  const defaultTheme = getPreference('theme', 'light')
  const [theme, setTheme] = useState(defaultTheme)

  return (
    <Router>
      <Main layout={false} theme={theme}>
        <walletContext.Provider value={wallet}>
          <OrderbookProvider>
            <NavBar />
            <div style={{ display: 'flex', height: '100%' }}>
              <div style={{ width: '15%', marginRight: '3%' }}>
                <SideBar />
              </div>
              <div style={{ width: '80%', marginRight: '2%' }}>
                <Switch>
                  {/* without layout */}
                  <Route path="/trade/orderbook">
                    <Orderbook />
                  </Route>

                  {/* pages with layout */}
                  <Route path="/trade/swap">
                    <Layout>
                      <Swap />
                    </Layout>
                  </Route>
                  <Route path="/trade/">
                    <Layout>
                      <Trade />
                    </Layout>
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
                  <Route path="/system/oracle">
                    <Layout>
                      <Oracle />
                    </Layout>
                  </Route>
                  <Route path="/system/factory/">
                    <Layout>
                      <Factory />
                    </Layout>
                  </Route>
                  <Route path="/system/">
                    <Layout>
                      <ProtocolHome />
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
              </div>
            </div>
          </OrderbookProvider>
        </walletContext.Provider>
      </Main>
    </Router>
  )
}

export default App
