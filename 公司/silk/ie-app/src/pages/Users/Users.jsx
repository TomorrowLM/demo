import React, { useState, createRef } from 'react'
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  DialogContentText
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { MoreVert } from '@material-ui/icons'
import { DataTable, ConfirmDialog, Tag } from '../../components'
import { getStaticText, snackbar } from '../../utils'
import services from '../../services'

const tableRef = createRef()

const Users = () => {
  const history = useHistory()
  const currentUser = useSelector((state) => state.users.userInfo)
  const [state, setState] = useState({
    currentRowId: '',
    currentUserEmail: '',
    status: [],
    isDeleteDialogShow: false,
    isDeletingUser: false
  })

  const [anchorEl, setAnchorEl] = useState(null)

  const handleActionsIconClick = (currentRowId, currentUserEmail) => (
    event
  ) => {
    setAnchorEl(event.currentTarget)
    setState({
      ...state,
      currentRowId,
      currentUserEmail
    })
  }

  const handleActionsClose = () => {
    setAnchorEl(null)
  }

  const handleUserDeleteCancel = () => {
    setState({
      ...state,
      isDeleteDialogShow: false
    })
  }

  const showDeleteDialog = () => {
    handleActionsClose()
    setState({
      ...state,
      isDeleteDialogShow: true
    })
  }

  const handleUserDelete = async () => {
    setState({
      ...state,
      isDeletingUser: true
    })
    const { errMsg } = await services.users.deleteUsers({
      userIds: [state.currentRowId]
    })

    if (!errMsg) {
      snackbar.success(getStaticText('page.user.info.form.user.delete.success'))
    }

    setState({
      ...state,
      isDeletingUser: false,
      isDeleteDialogShow: false
    })
    tableRef.current.getDataList(true)
  }

  const toDetail = () => {
    handleActionsClose()
    history.push(`/users/${state.currentRowId}`)
  }

  const handleAddClick = () => {
    history.push('/users/add')
  }

  const extra = React.checkPerms([30002]) ? (
    <Button variant="contained" color="primary" onClick={handleAddClick}>
      {getStaticText('page.users.add.new')}
    </Button>
  ) : null

  return (
    <>
      <DataTable
        ref={tableRef}
        columns={[
          {
            key: 'email',
            title: getStaticText('page.users.list.table.title.email')
          },
          {
            key: 'role',
            title: getStaticText('page.users.list.table.title.role'),
            render(record) {
              return record.userRoles.map((role) => role.roleName).join(', ')
            }
          },
          {
            key: 'status',
            title: getStaticText('page.users.list.table.title.status'),
            align: 'center',
            render(record) {
              return (
                <Tag color={record.status === 0 ? 'greyLight' : 'info'}>
                  {getStaticText('page.users.list.status')[record.status]}
                </Tag>
              )
            }
          },
          {
            key: 'action',
            title: getStaticText('app.common.action.button'),
            align: 'center',
            style: {
              width: 40
            },
            render(record) {
              if (record.userId === currentUser.userId || !record.isEditable) {
                return null
              }
              return (
                <>
                  <IconButton
                    size="small"
                    onClick={handleActionsIconClick(
                      record.userId,
                      record.email
                    )}
                  >
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={
                      Boolean(anchorEl) && state.currentRowId === record.userId
                    }
                    keepMounted
                    onClose={handleActionsClose}
                  >
                    {React.checkPerms([30005]) && (
                      <MenuItem onClick={toDetail}>
                        {getStaticText('page.users.list.action.button.edit')}
                      </MenuItem>
                    )}
                    {React.checkPerms([30003]) && (
                      <MenuItem onClick={showDeleteDialog}>
                        {getStaticText('page.users.list.action.button.delete')}
                      </MenuItem>
                    )}
                  </Menu>
                </>
              )
            }
          }
        ]}
        dataService={{
          fetch: services.users.getUsers,
          params: {
            status: state.status
          },
          key: 'userId'
        }}
        searchPlaceholder={getStaticText('page.users.list.search.placeholder')}
        extra={extra}
      />
      <ConfirmDialog
        isOpen={state.isDeleteDialogShow}
        onClose={handleUserDeleteCancel}
        onConfirm={handleUserDelete}
        isSubmitDisabled={state.isDeletingUser}
        isCancelDisabled={state.isDeletingUser}
        isSpinning={state.isDeletingUser}
      >
        <DialogContentText>
          {getStaticText('page.users.list.delete.user.confirm')}
        </DialogContentText>
        <DialogContentText>{state.currentUserEmail}</DialogContentText>
      </ConfirmDialog>
    </>
  )
}

export default Users
