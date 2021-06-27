import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import { styled, Grid } from '@material-ui/core'
import routes from './pages'
import { AppHeader, AppSidebar, PageHeader, Spin } from './components'
import { checkPerms } from './utils'

const BodyContainer = styled(Grid)({
  flex: 1
})

const SidebarContainer = styled(Grid)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.grey[300]}`,
  width: 200
}))

const PageContainer = styled(Grid)(({ theme }) => ({
  padding: `${theme.spacing(2)}px ${theme.spacing(4)}px`,
  backgroundColor: theme.palette.grey[100],
  flex: 1,
  position: 'relative'
}))
class App extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
      })
    }).isRequired,
    isLoading: PropTypes.bool.isRequired
  }

  getRoutes = () => {
    return routes.filter((route) => checkPerms(route.permissionCodes))
  }

  render() {
    const { isLoading } = this.props
    const permsRoutes = this.getRoutes()
    return (
      <>
        <AppHeader />
        <BodyContainer container>
          <SidebarContainer item>
            <AppSidebar routes={permsRoutes} />
          </SidebarContainer>
          <PageContainer item>
            <PageHeader routes={permsRoutes} />
            <Switch>
              {permsRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  component={route.component}
                  exact={route.exact}
                />
              ))}
              <Redirect to="/dashboard" exact />
            </Switch>
          </PageContainer>
        </BodyContainer>
        {isLoading && <Spin isStretch />}
      </>
    )
  }
}
const mapStateToProps = ({ global }) => ({
  isLoading: global.isGlobalLoading
})

export default connect(mapStateToProps)(App)
