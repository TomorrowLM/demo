import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, InputBase, Divider, IconButton } from '@material-ui/core'
import { Search as SearchIcon, Clear as ClearIcon } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    height: 33
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    fontWeight: theme.typography.fontWeightLight
  },
  iconButton: {
    padding: 2,
    margin: 2
  },
  divider: {
    height: 20,
    margin: 3
  }
}))

const SearchBox = (props) => {
  const { placeholder, value, onSearch, onChange, disabled } = props
  const classes = useStyles()

  const handleSearchChange = (e) => {
    onChange(e.target.value)
  }

  const handleClear = () => {
    onChange('')
    onSearch()
  }

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      onSearch()
    }
  }

  return (
    <div className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder={placeholder}
        onChange={handleSearchChange}
        onKeyUp={handleKeyUp}
        value={value}
        disabled={disabled}
      />
      {value && (
        <IconButton className={classes.iconButton} onClick={handleClear}>
          <ClearIcon />
        </IconButton>
      )}
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton
        className={classes.iconButton}
        onClick={onSearch}
        disabled={disabled}
      >
        <SearchIcon />
      </IconButton>
    </div>
  )
}

SearchBox.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onSearch: PropTypes.func,
  onChange: PropTypes.func,
  disabled: PropTypes.bool
}

SearchBox.defaultProps = {
  placeholder: 'search…',
  value: '',
  onSearch: () => {},
  onChange: () => {},
  disabled: false
}

export default SearchBox
