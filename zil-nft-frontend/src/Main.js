import React from 'react'
import AppBar from './AppBar';
import App from './App'
import CssBaseline from '@material-ui/core/CssBaseline';
import { Auth0Provider } from "@auth0/auth0-react";
import Footer from './Footer';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import AddressTokens from './AddressTokens';
import PortfolioTokens from './PortfolioTokens';
import Portfolio from './Portfolio';

function Main() {
  return (
    <Router>
      <React.Fragment>
        <CssBaseline />
        <Auth0Provider
          domain="dev-uffx1k5h.eu.auth0.com"
          clientId="pr0xFOhF4d5NZsU6nhh2C92sCZdx6up9"
          redirectUri={window.location.origin}
        >
          <AppBar />
          <main>
            <Switch>
              <Route path="/myportfolio">
                <Portfolio />
              </Route>
              <Route path="/address/:address">
                <AddressTokens />
              </Route>
              <Route path="/portfolio/:id">
                <PortfolioTokens />
              </Route>
              <Route path="/">
                <App />
              </Route>
            </Switch>
          </main>
        </Auth0Provider>
        <Footer />
      </React.Fragment>
    </Router>

  );
}

export default Main;
