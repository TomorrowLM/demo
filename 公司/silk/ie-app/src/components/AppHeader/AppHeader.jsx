import React from 'react'
import { styled, AppBar, Toolbar, Typography } from '@material-ui/core'
import HeaderActions from './HeaderActions'

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  position: 'relative'
}))
const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between'
})

export default function AppHeader() {
  const { StaticText } = React
  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <Typography variant="h5">
          <StaticText langKey="app.title" />
        </Typography>
        <HeaderActions />
      </StyledToolbar>
    </StyledAppBar>
  )
}
