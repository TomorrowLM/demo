import React, { useEffect, createRef } from 'react'
import ReactDOM from 'react-dom'
import { SnackbarProvider, useSnackbar } from 'notistack'
import { Close } from '@material-ui/icons'

const snackbarContainer = document.createElement('div')
document.body.appendChild(snackbarContainer)

const notistackRef = createRef()
const handleCloseClick = (key) => () => {
  notistackRef.current.closeSnackbar(key)
}

export default {
  success(msg) {
    this.toast(msg, 'success')
  },
  warning(msg) {
    this.toast(msg, 'warning')
  },
  info(msg) {
    this.toast(msg, 'info')
  },
  error(msg) {
    this.toast(msg, 'error')
  },
  toast(msg, variant = 'default') {
    const SanckbarComponent = ({ message, variant }) => {
      const { enqueueSnackbar } = useSnackbar()
      useEffect(() => {
        enqueueSnackbar(message, { variant })
      }, [message, variant, enqueueSnackbar])
      return null
    }
    ReactDOM.render(
      <SnackbarProvider
        maxSnack={3}
        ref={notistackRef}
        action={(key) => <Close onClick={handleCloseClick(key)} />}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <SanckbarComponent message={msg} variant={variant} />
      </SnackbarProvider>,
      snackbarContainer
    )
  }
}
