import React, { Fragment } from 'react'
import {
  styled,
  MenuItem,
  ListItemIcon,
  Divider,
  ListItemText
} from '@material-ui/core'

import { matchPath, useHistory, useLocation } from 'react-router-dom'

const StyledListItemIcon = styled(ListItemIcon)(() => ({
  minWidth: 'auto'
}))

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  paddingLeft: theme.spacing(2)
}))

export default function AppSidebar({ routes }) {
  const history = useHistory()
  const { pathname } = useLocation()
  const menuRoutes = routes.filter((route) => route.isMenuItem === true)
  const matchedRoute =
    routes.find((route) => Boolean(matchPath(pathname, route))) || {}
  const { StaticText } = React

  return menuRoutes.map((route) => {
    const { path, primary, icon: Icon, highlightMenu } = route
    return (
      <Fragment key={path}>
        <MenuItem
          button
          selected={highlightMenu === matchedRoute.highlightMenu}
          onClick={() => {
            history.push(path)
          }}
        >
          <StyledListItemIcon>
            <Icon fontSize="small" />
          </StyledListItemIcon>
          <StyledListItemText disableTypography>
            <StaticText langKey={primary} />
          </StyledListItemText>
        </MenuItem>
        <Divider />
      </Fragment>
    )
  })
}
