import React from 'react';
// import Moment from 'react-moment';
import 'moment-timezone';

import { Main, Layout } from '@aragon/ui'
import { walletContext } from './contexts/wallet'
import NavBar from "./components/NavBar"
import SideBar from "./components/SideBar"

import Create from './pages/Create'
import Account from './pages/Account'
import ConnectWallet from './pages/ConnectWallet'
import Vault from './pages/Vault'
import Operators from './pages/Operators'
import HomePage from './pages/HomePage'
import { useConnection } from './hooks/useConnection'

import { HashRouter as Router, Switch, Route } from 'react-router-dom';
function App() {

  const wallet = useConnection()

  return (
    <Router>
      <Main layout={false}>
        <walletContext.Provider value={wallet}>
          <NavBar />
          <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ width: '15%', marginRight: '3%' }}>
              <SideBar />
            </div>
            <div style={{ width: '80%', marginRight: '2%' }}>
              <Layout >
                <Switch>

                  <Route path="/create/">
                    <Create />
                  </Route>
                  <Route path="/account/:account/operators">
                    <Operators />
                  </Route>
                  <Route path="/account/:account">
                    <Account />
                  </Route>
                  <Route path="/account/">
                    <ConnectWallet />
                  </Route>
                  <Route path="/vault/:owner/:vaultId">
                    <Vault />
                  </Route>
                  <Route path="/">
                    <HomePage />
                  </Route>

                </Switch>
              </Layout >
            </div>

          </div>

        </walletContext.Provider>

      </Main>
    </Router>
  );
}

export default App;
