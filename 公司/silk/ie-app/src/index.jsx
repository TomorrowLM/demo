import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { CssBaseline } from '@material-ui/core'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@material-ui/core/styles'
import Login from './pages/Login/Login'
import ChangePassword from './pages/ChangePassword/ChangePassword'
import App from './App'
import { theme } from './config'
import { StaticText, AuthRoute, PermsContainer } from './components'
import { checkPerms } from './utils'
import store from './store'

import './index.css'

React.StaticText = StaticText
React.PermsContainer = PermsContainer
React.checkPerms = checkPerms

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <Router>
        <CssBaseline />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/change-password/:id?" component={ChangePassword} />
          <AuthRoute path="/" component={App} />
        </Switch>
      </Router>
    </Provider>
  </ThemeProvider>,
  document.getElementById('root')
)
