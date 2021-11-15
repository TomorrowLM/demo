import React from 'react'

import clsx from 'clsx'

import PropTypes from 'prop-types'

import { CircularProgress, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  spin: {
    position: 'relative',
    zIndex: theme.zIndex.appBar - 100,
    minHeight: 60
  },
  spinner: (props) => ({
    padding: theme.spacing(2),
    display: 'inline-block',
    borderRadius: props.isSquare ? 0 : theme.shape.borderRadius
  }),
  spinnerStretch: (props) => ({
    position: 'absolute',
    zIndex: theme.zIndex.appBar - 100,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .75)',
    borderRadius: props.isSquare ? 0 : theme.shape.borderRadius
  }),
  tip: {
    color: theme.palette.primary.main,
    marginTop: theme.spacing()
  }
}))

const Spin = (props) => {
  const {
    children,
    isSpinning,
    isStretch,
    size,
    thickness,
    tip,
    isSquare
  } = props

  const classes = useStyles({ isSquare })
  if (children) {
    return (
      <div className={classes.spin}>
        <>
          {isSpinning && (
            <div className={classes.spinnerStretch}>
              <CircularProgress size={size} thickness={thickness} />
              <span className={classes.tip}>{tip}</span>
            </div>
          )}
          {children}
        </>
      </div>
    )
  }
  return (
    <div
      className={clsx(classes.spinner, {
        [classes.spinnerStretch]: isStretch
      })}
    >
      <CircularProgress size={size} thickness={thickness} />
      <span className={classes.tip}>{tip}</span>
    </div>
  )
}

Spin.propTypes = {
  children: PropTypes.node,
  size: PropTypes.number,
  thickness: PropTypes.number,
  isSpinning: PropTypes.bool,
  isStretch: PropTypes.bool,
  isSquare: PropTypes.bool,
  tip: PropTypes.string
}

Spin.defaultProps = {
  children: null,
  size: 40,
  thickness: 2,
  isSpinning: false,
  isStretch: false,
  isSquare: false,
  tip: ''
}

export default Spin
