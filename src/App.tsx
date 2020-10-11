import React from 'react';
import { Main, Layout } from '@aragon/ui'
import NavBar from "./components/NavBar"

import Create from './pages/CreateOption'

import { HashRouter as Router, Switch, Route } from 'react-router-dom';
function App() {
  return (
    <Router>
      <Main layout={false}>
        <NavBar />
        <Layout>
        <Switch>

          {/* All Options */}
          <Route path="/create">
            <Create />
          </Route>
        </Switch>
        </Layout>
      </Main>
    </Router>
  );
}

export default App;
