import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/styles'

import {
  red,
  green,
  lightBlue,
  orange,
  blueGrey,
  purple,
  grey
} from '@material-ui/core/colors'

const useStyles = makeStyles({
  root: ({ color }) => ({
    backgroundColor: color,
    color: '#fff',
    padding: 6,
    borderRadius: 4,
    whiteSpace: 'nowrap'
  })
})

const colors = {
  success: green[500],
  warning: orange[700],
  info: lightBlue[500],
  error: red[700],
  greyLight: grey[400],
  grey: blueGrey[500],
  purple: purple[400]
}

const Tag = (props) => {
  const { children, color } = props

  const classes = useStyles({ color: colors[color] })

  return <span className={classes.root}>{children}</span>
}

Tag.propTypes = {
  children: PropTypes.node,
  color: PropTypes.oneOf([
    'success',
    'warning',
    'info',
    'error',
    'grey',
    'purple',
    'greyLight'
  ])
}

Tag.defaultProps = {
  children: null,
  color: 'success'
}

export default Tag
