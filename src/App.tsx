import React from 'react';
// import Moment from 'react-moment';
import 'moment-timezone';

import { Main, Layout } from '@aragon/ui'
import { walletContext } from './contexts/wallet'
import NavBar from "./components/NavBar"

import Create from './pages/CreateOption'
import Account from './pages/Account'
import Operators from './pages/OperatorManagement'
import { useConnection } from './hooks/useConnection'

import { HashRouter as Router, Switch, Route } from 'react-router-dom';
function App() {

  const wallet = useConnection()

  return (
    <Router>
      <Main layout={false}>
        <walletContext.Provider value={wallet}>
          <NavBar />
          <Layout>
            <Switch>
              <Route path="/create">
                <Create />
              </Route>
              <Route path="/account/:account">
                <Account/>
              </Route>
              <Route path="/operators">
                <Operators />
              </Route>
            </Switch>
          </Layout>
        </walletContext.Provider>
      </Main>
    </Router>
  );
}

export default App;
