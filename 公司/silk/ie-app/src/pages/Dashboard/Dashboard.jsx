import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Typography } from '@material-ui/core'
import { StaticText } from '../../components'

const Dashboard = ({ userInfo }) => {
  const { username, email } = userInfo
  return (
    <>
      <Typography>
        <StaticText langKey="page.dashboard.welcome" />
        &nbsp;
        {username}
      </Typography>
      <Typography>
        <StaticText langKey="page.dashboard.login.with" />
        &nbsp;
        {email}
      </Typography>
    </>
  )
}

Dashboard.propTypes = {
  userInfo: PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired
}

const mapStateToProps = ({ users }) => ({
  userInfo: users.userInfo
})
export default connect(mapStateToProps)(Dashboard)
