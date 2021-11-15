import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  TablePagination,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Grid,
  styled
} from '@material-ui/core'

import SearchBox from '../SearchBox/SearchBox'
import Spin from '../Spin/Spin'
import NoData from '../NoData/NoData'

const TableRoot = styled('div')(({ theme }) => ({
  padding: theme.spacing(),
  marginTop: theme.spacing(),
  backgroundColor: theme.palette.common.white
}))

export default class DataTable extends Component {
  static propTypes = {
    searchable: PropTypes.bool,
    extra: PropTypes.node,
    searchPlaceholder: PropTypes.string,
    dataService: PropTypes.shape({
      fetch: PropTypes.func.isRequired,
      key: PropTypes.string.isRequired,
      params: PropTypes.shape({})
    }).isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired
  }

  static defaultProps = {
    searchable: true,
    extra: null,
    searchPlaceholder: ''
  }

  constructor() {
    super()
    this.state = {
      pagination: {
        offset: 0,
        limit: 10,
        totalCount: 0
      },
      q: '',
      dataList: [],
      isLoading: false
    }
  }

  componentDidMount() {
    this.getDataList()
  }

  componentWillUnmount() {
    this.setState = () => {}
  }

  get currentPage() {
    const {
      pagination: { offset, limit }
    } = this.state
    return offset / limit
  }

  getDataList = async (shouldResetPagination = false) => {
    this.setState({
      isLoading: true
    })
    const {
      pagination,
      pagination: { offset, limit },
      q
    } = this.state

    const { dataService } = this.props

    try {
      const resp = await dataService.fetch({
        offset: shouldResetPagination ? 0 : offset,
        limit,
        q,
        ...dataService.params
      })
      if (!resp.errMsg) {
        this.setState({
          dataList: resp.list,
          pagination: {
            ...pagination,
            offset: resp.pagination.offset,
            totalCount: resp.pagination.totalCount
          }
        })
      }
    } finally {
      this.setState({
        isLoading: false
      })
    }
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
      this.getDataList
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
      this.getDataList
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
      this.getDataList
    )
  }

  render() {
    const { dataList, q, isLoading, pagination } = this.state
    const {
      searchable,
      extra,
      searchPlaceholder,
      dataService,
      columns
    } = this.props
    return (
      <Spin isSpinning={isLoading} tip="Loading...">
        <Grid container justify="space-between">
          {searchable ? (
            <Grid item>
              <SearchBox
                value={q}
                onChange={this.handleQChange}
                onSearch={this.handleSearch}
                placeholder={searchPlaceholder}
              />
            </Grid>
          ) : (
            <Grid item />
          )}
          <Grid item>{extra}</Grid>
        </Grid>
        {dataList.length === 0 ? (
          <NoData />
        ) : (
          <TableRoot>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      style={column.style}
                      align={column.align}
                    >
                      {column.title}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataList.map((row) => (
                  <TableRow key={row[dataService.key]}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        align={column.align}
                        style={column.style}
                        size="small"
                      >
                        {typeof column.render === 'function'
                          ? column.render(row, this)
                          : row[column.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 20, 50]}
              component="div"
              count={pagination.totalCount}
              rowsPerPage={pagination.limit}
              page={this.currentPage}
              onChangePage={this.handlePageChange}
              onChangeRowsPerPage={this.handleRowsPerPageChange}
            />
          </TableRoot>
        )}
      </Spin>
    )
  }
}
