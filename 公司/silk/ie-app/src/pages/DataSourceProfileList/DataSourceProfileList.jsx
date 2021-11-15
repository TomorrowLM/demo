import React, { createRef, useState } from 'react'
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  DialogContentText
} from '@material-ui/core'
import { MoreVert } from '@material-ui/icons'
import { useHistory } from 'react-router-dom'
import { DataTable, ConfirmDialog } from '../../components'
import services from '../../services'
import { getStaticText, getFormatTime, Enum, snackbar } from '../../utils'

const tableRef = createRef()

const DataSourceProfileList = () => {
  const history = useHistory()

  const [state, setState] = useState({
    currentRowId: '',
    currentProfileName: '',
    isDeleteDialogShow: false,
    isDeletingProfiles: false
  })

  const [anchorEl, setAnchorEl] = useState(null)

  const handleActionsIconClick = (currentRowId, currentProfileName) => (
    event
  ) => {
    setAnchorEl(event.currentTarget)
    setState({
      ...state,
      currentRowId,
      currentProfileName
    })
  }

  const handleActionsClose = () => {
    setAnchorEl(null)
  }

  const toDetail = () => {
    handleActionsClose()
    history.push(`/data-source-profile/${state.currentRowId}`)
  }

  const showDeleteDialog = () => {
    handleActionsClose()
    setState({
      ...state,
      isDeleteDialogShow: true
    })
  }

  const handleProfileDeleteCancel = () => {
    setState({
      ...state,
      isDeleteDialogShow: false
    })
  }

  const handleProfileDelete = async () => {
    setState({
      ...state,
      isDeletingProfiles: true
    })
    await services.profile.deleteProfiles({
      profileIds: [state.currentRowId]
    })
    snackbar.success('profile deleted successfully')
    setState({
      ...state,
      isDeletingProfiles: false,
      isDeleteDialogShow: false
    })
    tableRef.current.getDataList(true)
  }

  const handleToPageClick = () => {
    history.push('/data-source-profile')
  }

  const extra = React.checkPerms([10002]) ? (
    <Button variant="contained" color="primary" onClick={handleToPageClick}>
      {getStaticText('page.data.source.profile.button.add.new')}
    </Button>
  ) : null

  return (
    <>
      <DataTable
        ref={tableRef}
        searchable={React.checkPerms([10006])}
        columns={[
          {
            key: 'profileId',
            title: getStaticText('page.data.source.profile.table.id')
          },
          {
            key: 'profileName',
            title: getStaticText(
              'page.data.source.profile.basic.info.profile.name'
            )
          },
          {
            key: 'sourceName',
            title: getStaticText(
              'page.data.source.profile.basic.info.source.name'
            )
          },
          {
            key: 'sourceFileType',
            title: getStaticText(
              'page.data.source.profile.basic.info.source.type'
            ),
            render(record) {
              return Enum.getFileType(record.sourceFileType)
            }
          },
          {
            key: 'updatedAt',
            title: getStaticText('page.data.source.profile.table.updated'),
            render(record) {
              return getFormatTime(record.updatedAt)
            }
          },
          {
            key: 'action',
            title: getStaticText('app.common.action.button'),
            render(record) {
              return (
                <>
                  <IconButton
                    size="small"
                    onClick={handleActionsIconClick(
                      record.profileId,
                      record.profileName
                    )}
                  >
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={
                      Boolean(anchorEl) &&
                      state.currentRowId === record.profileId
                    }
                    keepMounted
                    onClose={handleActionsClose}
                  >
                    {React.checkPerms([10004]) && (
                      <MenuItem onClick={toDetail}>
                        {getStaticText('page.data.source.profile.button.view')}
                      </MenuItem>
                    )}
                    {React.checkPerms([10003]) && (
                      <MenuItem onClick={showDeleteDialog}>
                        {getStaticText(
                          'page.data.source.profile.button.delete'
                        )}
                      </MenuItem>
                    )}
                  </Menu>
                </>
              )
            }
          }
        ]}
        dataService={{
          fetch: services.profile.getProfileList,
          key: 'profileId'
        }}
        searchPlaceholder={getStaticText(
          'page.data.source.profile.search.placeholder'
        )}
        extra={extra}
      />
      <ConfirmDialog
        isOpen={state.isDeleteDialogShow}
        onClose={handleProfileDeleteCancel}
        onConfirm={handleProfileDelete}
        isSubmitDisabled={state.isDeletingProfiles}
        isCancelDisabled={state.isDeletingProfiles}
        isSpinning={state.isDeletingProfiles}
      >
        <DialogContentText>
          {getStaticText('page.data.source.profile.delete.profile.confirm')}
        </DialogContentText>
        <DialogContentText>{state.currentProfileName}</DialogContentText>
      </ConfirmDialog>
    </>
  )
}

export default DataSourceProfileList
