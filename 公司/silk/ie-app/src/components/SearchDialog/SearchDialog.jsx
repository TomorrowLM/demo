import React from 'react'
import {
  Dialog,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  TablePagination
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { noop } from 'lodash'
import SearchBox from '../SearchBox/SearchBox'
import Spin from '../Spin/Spin'

const SearchDialog = (props) => {
  const {
    isOpen,
    onClose,
    data,
    title,
    pagination: { limit, totalCount },
    page,
    handlePageChange,
    handleRowsPerPageChange,
    q,
    handleQChange,
    handleSearch,
    isLoading,
    handleListItemClick,
    target
  } = props

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <Divider />
      <List>
        <ListItem>
          <SearchBox
            value={q}
            onChange={handleQChange}
            onSearch={handleSearch}
          />
        </ListItem>
        <Spin isSpinning={isLoading} tip="Loading...">
          {data.map((item) => (
            <ListItem
              button
              onClick={handleListItemClick(item)}
              key={item.attributeLabel}
            >
              <ListItemText primary={item[target]} />
            </ListItem>
          ))}
        </Spin>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={limit}
          page={page}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
        />
      </List>
    </Dialog>
  )
}

export default SearchDialog

SearchDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.shape({})),
  title: PropTypes.string,
  pagination: PropTypes.shape({
    offset: PropTypes.number,
    limit: PropTypes.number,
    totalCount: PropTypes.number
  }),
  page: PropTypes.number,
  handlePageChange: PropTypes.func,
  handleRowsPerPageChange: PropTypes.func,
  q: PropTypes.string,
  handleQChange: PropTypes.func,
  handleSearch: PropTypes.func,
  isLoading: PropTypes.bool,
  handleListItemClick: PropTypes.func,
  target: PropTypes.string
}

SearchDialog.defaultProps = {
  isOpen: false,
  onClose: noop,
  data: [{}],
  title: '',
  pagination: { offset: 0, limit: 10, totalCount: 0 },
  page: 0,
  handlePageChange: noop,
  handleRowsPerPageChange: noop,
  q: '',
  handleQChange: noop,
  handleSearch: noop,
  isLoading: true,
  handleListItemClick: noop,
  target: ''
}
