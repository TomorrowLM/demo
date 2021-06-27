import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  styled,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  Divider,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'
import { getStaticText } from '../../../utils'
import { SearchDialog } from '../../../components'
import services from '../../../services'

const TableRoot = styled('div')(({ theme }) => ({
  padding: theme.spacing(),
  marginTop: theme.spacing(),
  backgroundColor: theme.palette.common.white
}))

class AttributeMapping extends Component {
  static propTypes = {
    attributeMapping: PropTypes.shape({
      attributeMapping: PropTypes.arrayOf.isRequired,
      connectionId: PropTypes.string.isRequired,
      autoAttributeMappingField: PropTypes.number.isRequired,
      matchedAttributesNums: PropTypes.number.isRequired
    }).isRequired,
    onSubmit: PropTypes.func.isRequired,
    step: PropTypes.shape({
      setStep: PropTypes.func.isRequired,
      currentStep: PropTypes.number.isRequired
    }).isRequired
  }

  columns = [
    {
      key: 'sourceLabel',
      align: 'center',
      title: getStaticText(
        'page.data.source.profile.attribute.mapping.source.label'
      )
    },
    {
      key: 'attributeLabel',
      align: 'center',
      title: getStaticText(
        'page.data.source.profile.attribute.mapping.attribute.label'
      )
    },
    {
      key: 'attributeLabelIcon',
      title: '',
      align: 'left',
      render: (record) => {
        const {
          isOpen,
          currentLabel,
          searchedResult,
          pagination,
          q,
          isLoading,
          target
        } = this.state
        const {
          attributeMapping: { autoAttributeMappingField }
        } = this.props
        if (autoAttributeMappingField === 0) {
          return (
            <>
              <IconButton onClick={this.handleLabelSelect(record.sourceLabel)}>
                <ExpandMore />
              </IconButton>
              <SearchDialog
                isOpen={isOpen && record.sourceLabel === currentLabel}
                onClose={this.handleClose}
                data={searchedResult}
                title={record.sourceLabel}
                pagination={pagination}
                page={this.currentPage}
                handlePageChange={this.handlePageChange}
                handleRowsPerPageChange={this.handleRowsPerPageChange}
                q={q}
                handleQChange={this.handleQChange}
                handleSearch={this.handleSearch}
                isLoading={isLoading}
                handleListItemClick={this.handleListItemClick}
                target={target}
              />
            </>
          )
        }
        return null
      }
    },
    {
      key: 'attributeCode',
      align: 'center',
      title: getStaticText(
        'page.data.source.profile.attribute.mapping.attribute.code'
      )
    },
    {
      key: 'attributeCodeIcon',
      title: '',
      align: 'left',
      render: (record) => {
        const {
          isOpen,
          currentCode,
          searchedResult,
          pagination,
          q,
          isLoading,
          target
        } = this.state
        const {
          attributeMapping: { autoAttributeMappingField }
        } = this.props
        if (autoAttributeMappingField === 1) {
          return (
            <>
              <IconButton onClick={this.handleCodeSelect(record.sourceLabel)}>
                <ExpandMore />
              </IconButton>
              <SearchDialog
                isOpen={isOpen && record.sourceLabel === currentCode}
                onClose={this.handleClose}
                data={searchedResult}
                title={record.sourceLabel}
                pagination={pagination}
                page={this.currentPage}
                handlePageChange={this.handlePageChange}
                handleRowsPerPageChange={this.handleRowsPerPageChange}
                q={q}
                handleQChange={this.handleQChange}
                handleSearch={this.handleSearch}
                isLoading={isLoading}
                handleListItemClick={this.handleListItemClick}
                target={target}
              />
            </>
          )
        }
        return null
      }
    },
    {
      key: 'attributeType',
      align: 'center',
      title: getStaticText(
        'page.data.source.profile.attribute.mapping.attribute.type'
      )
    }
  ]

  constructor() {
    super()
    this.state = {
      pagination: {
        offset: 0,
        limit: 10,
        totalCount: 0
      },
      isOpen: false,
      currentLabel: '',
      currentCode: '',
      sourceLabel: '',
      searchedResult: [],
      q: '',
      isLoading: false,
      target: '',
      isShow: false
    }
  }

  get currentPage() {
    const {
      pagination: { offset, limit }
    } = this.state
    return offset / limit
  }

  handleListItemClick = (clickSearchItem) => () => {
    const {
      attributeMapping: { attributeMapping, matchedAttributesNums },
      onSubmit
    } = this.props
    const { sourceLabel } = this.state
    const newAttributeMapping = attributeMapping.map((attributeItem) => {
      if (attributeItem.sourceLabel === sourceLabel) {
        attributeItem = {
          ...attributeItem,
          ...clickSearchItem
        }
      }
      return attributeItem
    })

    onSubmit({
      attributeMapping: newAttributeMapping,
      matchedAttributesNums: matchedAttributesNums + 1
    })
    this.handleClose()
  }

  handleLabelSelect = (currentLabel) => () => {
    this.setState(
      {
        sourceLabel: currentLabel,
        currentLabel,
        target: 'attributeLabel',
        currentCode: '',
        isOpen: true
      },
      this.fetchData
    )
  }

  handleCodeSelect = (currentCode) => () => {
    this.setState(
      {
        sourceLabel: currentCode,
        currentCode,
        target: 'attributeCode',
        currentLabel: '',
        isOpen: true
      },
      this.fetchData
    )
  }

  handleQChange = (q) => {
    this.setState({
      q
    })
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

  handleClose = () => {
    this.setState({
      isOpen: false,
      q: '',
      target: '',
      pagination: {
        offset: 0,
        limit: 10,
        totalCount: 0
      }
    })
  }

  handleBack = () => {
    const {
      step: { setStep, currentStep }
    } = this.props
    setStep(currentStep - 1)
  }

  handleNext = () => {
    const {
      attributeMapping: { attributeMapping },
      step: { setStep, currentStep }
    } = this.props
    const isAllMapping = (item) => Object.keys(item).length !== 1
    if (attributeMapping.every(isAllMapping) === false) {
      this.setState({ isShow: true })
    } else {
      setStep(currentStep + 1)
    }
  }

  handleDialogClose = () => {
    this.setState({ isShow: false })
  }

  handleDialogNext = () => {
    const {
      step: { setStep, currentStep }
    } = this.props
    setStep(currentStep + 1)
  }

  fetchData = async (shouldResetPagination = false) => {
    this.setState({
      isLoading: true
    })
    const {
      attributeMapping: { connectionId, autoAttributeMappingField }
    } = this.props
    const {
      pagination,
      pagination: { offset, limit },
      q
    } = this.state
    const resp = await services.profile.searchProfilesAttributes({
      autoAttributeMappingField,
      offset: shouldResetPagination ? 0 : offset,
      connectionId,
      limit,
      q
    })
    this.setState({
      searchedResult: resp.list,
      pagination: {
        ...pagination,
        offset: resp.pagination.offset,
        totalCount: resp.pagination.totalCount
      },
      isLoading: false
    })
  }

  render() {
    const {
      attributeMapping: { attributeMapping }
    } = this.props
    const { isShow } = this.state
    return (
      <>
        <TableRoot>
          <Table>
            <TableHead>
              <TableRow style={{ display: 'flex' }}>
                <TableCell align="center" style={{ flex: 3 }}>
                  {getStaticText(
                    'page.data.source.profile.attribute.mapping.title.source'
                  )}
                </TableCell>
                <TableCell align="center" style={{ flex: 4 }}>
                  {getStaticText(
                    'page.data.source.profile.attribute.mapping.title.target'
                  )}
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
          <TableContainer style={{ maxHeight: 660 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {this.columns.map((column) => (
                    <TableCell key={column.key} style={{ textAlign: 'center' }}>
                      {column.title}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {attributeMapping.map((row) => (
                  <TableRow hover role="checkbox" key={row.sourceLabel}>
                    {this.columns.map((column) => (
                      <TableCell
                        key={column.key}
                        align={column.align}
                        size="small"
                      >
                        {typeof column.render === 'function'
                          ? column.render(row)
                          : row[column.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TableRoot>
        <div style={{ paddingTop: 20 }}>
          <Button onClick={this.handleBack}>
            {getStaticText('page.data.source.profile.button.back')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="text"
            onClick={this.handleNext}
          >
            {getStaticText('page.data.source.profile.button.next')}
          </Button>
        </div>
        <Dialog open={isShow}>
          <DialogTitle>
            {getStaticText(
              'page.data.source.profile.attribute.mapping.dialog.title'
            )}
          </DialogTitle>
          <Divider />
          <DialogContent>
            <DialogContentText>
              {getStaticText(
                'page.data.source.profile.attribute.mapping.dialog.text'
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color="primary">
              {getStaticText('page.data.source.profile.button.cancel')}
            </Button>
            <Button
              onClick={this.handleDialogNext}
              color="primary"
              variant="contained"
            >
              {getStaticText('page.data.source.profile.button.next')}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}

export default AttributeMapping
