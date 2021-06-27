import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardContent,
  Link,
  Typography,
  styled,
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  Divider,
  List,
  ListItem,
  TablePagination,
  ListItemText
} from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'
import { DropzoneArea } from 'material-ui-dropzone'
import { getStaticText, Enum } from '../../utils'
import services from '../../services'
import { Spin, SearchBox, NoData } from '../../components'

const FormItem = styled('div')(({ theme }) => ({
  paddingBottom: theme.spacing(1.5)
}))

class NewDataUpload extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  }

  endAdornment = (
    <InputAdornment position="end">
      <IconButton>
        <ExpandMore />
      </IconButton>
    </InputAdornment>
  )

  constructor() {
    super()
    this.state = {
      pagination: {
        offset: 0,
        limit: 10,
        totalCount: 0
      },
      selectedProfile: {
        profileName: 'Profile Name',
        sourceName: 'Source Name',
        sourceFileType: '',
        targetChannel: 'Target Channel'
      },
      isOpen: false,
      profileName: '',
      profileId: 0,
      profileList: [],
      file: null,
      isLoading: false,
      isFileUpload: true,
      q: ''
    }
  }

  get currentPage() {
    const {
      pagination: { offset, limit }
    } = this.state
    return offset / limit
  }

  fetchData = async (shouldResetPagination = false) => {
    const {
      pagination,
      pagination: { offset, limit },
      q
    } = this.state
    const resp = await services.profile.getProfileList({
      q,
      offset: shouldResetPagination ? 0 : offset,
      limit
    })
    this.setState({
      profileList: resp.list,
      pagination: {
        ...pagination,
        offset: resp.pagination.offset,
        totalCount: resp.pagination.totalCount
      },
      isLoading: false
    })
  }

  handleCloseDialog = () => {
    this.setState({
      isOpen: false
    })
  }

  handleOpenDialog = () => {
    this.setState(
      {
        isLoading: true,
        isOpen: true,
        q: '',
        pagination: {
          offset: 0,
          limit: 10,
          totalCount: 0
        }
      },
      this.fetchData
    )
  }

  handleQChange = (q) => {
    this.setState({ q })
  }

  handleSearch = () => {
    const { pagination } = this.state
    this.setState(
      {
        pagination: {
          ...pagination,
          offset: 0
        }
      },
      this.fetchData
    )
  }

  handleListItemClick = (item) => () => {
    const { profileName, profileId } = item
    this.setState({
      profileName,
      profileId,
      selectedProfile: item
    })
    this.handleCloseDialog()
  }

  handlePageChange = (event, page) => {
    const { pagination } = this.state
    this.setState(
      {
        pagination: {
          ...pagination,
          offset: page * pagination.limit
        }
      },
      this.fetchData
    )
  }

  handleRowsPerPageChange = (event) => {
    const { pagination } = this.state
    this.setState(
      {
        pagination: {
          ...pagination,
          offset: 0,
          limit: event.target.value
        }
      },
      this.fetchData
    )
  }

  handleUpload = async () => {
    const { history } = this.props
    const { profileId, file } = this.state
    this.setState({ isLoading: true })
    const data = new FormData()
    data.append('file', file)
    const resp = await services.files.filesUpload(data)
    await services.files.fileAnalysis({
      flag: 'product',
      fileUrl: resp.fileUrl,
      profileId
    })
    this.setState({ isLoading: false })
    history.push('product')
  }

  render() {
    const {
      isLoading,
      profileName,
      profileId,
      isOpen,
      q,
      isFileUpload,
      profileList,
      pagination: { limit, totalCount },
      selectedProfile
    } = this.state
    return (
      <Spin isSpinning={isLoading} tip="Loading...">
        <FormItem>
          <FormControl
            onClick={this.handleOpenDialog}
            style={{ minWidth: 400 }}
            label={getStaticText('page.new.data.upload.select.label')}
          >
            <InputLabel>
              {getStaticText('page.new.data.upload.select.label')}
            </InputLabel>
            <Input value={profileName} endAdornment={this.endAdornment} />
          </FormControl>
        </FormItem>
        <Dialog open={isOpen} onClose={this.handleCloseDialog}>
          <DialogTitle>
            {getStaticText('page.new.data.upload.select.label')}
          </DialogTitle>
          <Divider />
          <List>
            <ListItem>
              <SearchBox
                value={q}
                onChange={this.handleQChange}
                onSearch={this.handleSearch}
              />
            </ListItem>
            <Spin isSpinning={isLoading} tip="Loading...">
              {profileList.length === 0 ? (
                <NoData />
              ) : (
                profileList.map((item) => (
                  <ListItem
                    button
                    onClick={this.handleListItemClick(item)}
                    key={item.profileId}
                  >
                    <ListItemText primary={item.profileName} />
                  </ListItem>
                ))
              )}
            </Spin>
            <TablePagination
              rowsPerPageOptions={[10, 20, 50]}
              component="div"
              count={totalCount}
              rowsPerPage={limit}
              page={this.currentPage}
              onChangePage={this.handlePageChange}
              onChangeRowsPerPage={this.handleRowsPerPageChange}
            />
          </List>
        </Dialog>
        <FormItem>
          <Link href="#/data-source-profile">
            {getStaticText('page.new.data.upload.link')}
          </Link>
        </FormItem>
        <FormItem>
          <Card style={{ width: 500 }}>
            <CardContent>
              <Typography>
                {getStaticText('page.new.data.upload.note')}
              </Typography>
              <Typography>
                {selectedProfile.profileName}
                ,&nbsp;
                {selectedProfile.sourceName}
                ,&nbsp;
                {selectedProfile.sourceFileType === ''
                  ? getStaticText(
                      'page.data.source.profile.basic.info.source.type'
                    )
                  : Enum.getFileType(selectedProfile.sourceFileType)}
                ,&nbsp;
                {selectedProfile.targetChannelConnection === undefined
                  ? selectedProfile.targetChannel
                  : selectedProfile.targetChannelConnection?.channelName}
              </Typography>
            </CardContent>
          </Card>
        </FormItem>
        <FormItem style={{ width: 600 }}>
          <DropzoneArea
            showPreviews
            showPreviewsInDropzone={false}
            useChipsForPreview
            maxFileSize={1024 * 1024 * 20}
            previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
            previewChipProps={{
              root: {
                minWidth: 160,
                maxWidth: 210
              }
            }}
            previewText="Selected files"
            filesLimit={1}
            onChange={(files) => {
              if (!files.length) {
                this.setState({ isFileUpload: true })
                return
              }
              this.setState({ isFileUpload: false, file: files[0] })
            }}
          />
        </FormItem>
        <Button
          variant="contained"
          color="primary"
          disabled={isFileUpload || profileId === 0}
          onClick={this.handleUpload}
        >
          {getStaticText('page.new.data.upload.button.text')}
        </Button>
      </Spin>
    )
  }
}
export default NewDataUpload
