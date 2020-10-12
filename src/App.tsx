import React from 'react';
import { Main, Layout } from '@aragon/ui'
import { walletContext } from './contexts/wallet'
import NavBar from "./components/NavBar"

import Create from './pages/CreateOption'
import {useConnection} from './hooks/useConnection'

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

          {/* All Options */}
          <Route path="/create">
            <Create />
          </Route>
        </Switch>
        </Layout>
        </walletContext.Provider>
      </Main>
    </Router>
  );
}

export default App;
