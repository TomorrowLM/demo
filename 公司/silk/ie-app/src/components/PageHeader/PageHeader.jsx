import React from 'react'
import { Typography, styled } from '@material-ui/core'
import { withRouter, matchPath } from 'react-router-dom'
import PropTypes from 'prop-types'
import BackButton from '../BackButton/BackButton'

const PageTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[700]
}))

const PageHeaderContainer = styled('div')(({ theme }) => ({
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  display: 'flex',
  alignItems: 'center'
}))

const PageHeader = ({ routes, location }) => {
  const { StaticText } = React
  const { pathname } = location
  const { primary = '', isMenuItem = false, isBackButtonHidden } =
    routes.find((route) => Boolean(matchPath(pathname, route))) || {}
  return (
    <PageHeaderContainer>
      {!(isMenuItem || isBackButtonHidden) && <BackButton size="small" />}
      <PageTitle variant="h5">
        <StaticText langKey={primary} />
      </PageTitle>
    </PageHeaderContainer>
  )
}

PageHeader.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired
    })
  ).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
}

export default withRouter(PageHeader)
