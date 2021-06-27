import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { IconButton, Menu, MenuItem } from '@material-ui/core'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { AccountCircle } from '@material-ui/icons'
import StaticText from '../StaticText/StaticText'
import { resetUserInfo } from '../../store/actions/users'
import { setGlobalLoading } from '../../store/actions/global'
import { storage } from '../../utils'
import services from '../../services'

const HeaderActions = ({ userId, resetUserInfo, setGlobalLoading }) => {
  const history = useHistory()

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    handleClose()
    setGlobalLoading(true)
    await services.users.logout()
    setGlobalLoading(false)
    storage.userInfo.remove()
    resetUserInfo({})
    history.push('/login')
  }

  const handleChangePassword = () => {
    history.push(`/change-password/${userId}`)
  }

  return (
    <>
      <IconButton onClick={handleClick} color="inherit">
        <AccountCircle fontSize="large" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleChangePassword}>
          <StaticText langKey="nav.change.password" />
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <StaticText langKey="nav.logout" />
        </MenuItem>
      </Menu>
    </>
  )
}

HeaderActions.propTypes = {
  resetUserInfo: PropTypes.func.isRequired,
  setGlobalLoading: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired
}
const mapStateToProps = ({ users }) => ({
  userId: users.userInfo.userId
})

export default connect(mapStateToProps, { resetUserInfo, setGlobalLoading })(
  HeaderActions
)
