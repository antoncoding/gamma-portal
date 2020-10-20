import React from 'react';
// import Moment from 'react-moment';
import 'moment-timezone';

import { Main } from '@aragon/ui'
import { walletContext } from './contexts/wallet'
import NavBar from "./components/NavBar"

import Create from './pages/CreateOption'
import Account from './pages/Account'
import ConnectWallet from './pages/ConnectWallet'
import Vault from './pages/Vault'
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
            <Switch>
              <Route path="/create">
                <Create />
              </Route>
              <Route path="/account/:account">
                <Account/>
              </Route>
              <Route path="/account/">
                <ConnectWallet />
              </Route>
              <Route path="/vault/:owner/:vaultId">
                <Vault />
              </Route>
              <Route path="/">
                <HomePage/>
              </Route>
            </Switch>
        </walletContext.Provider>
        
      </Main>
    </Router>
  );
}

export default App;
