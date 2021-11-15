import React from 'react'
import PropTypes from 'prop-types'
import { noop } from 'lodash'

import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  Divider,
  CircularProgress,
  styled
} from '@material-ui/core'

const Spinner = styled(CircularProgress)({
  marginRight: 8
})

function ConfirmDialog(props) {
  const {
    isOpen,
    onClose,
    onConfirm,
    title,
    children,
    isCancelDisabled,
    isSubmitDisabled,
    isSpinning,
    cancelText,
    confirmText
  } = props

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <Divider />
      <DialogContent>{children}</DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose} color="default" disabled={isCancelDisabled}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color="primary"
          variant="contained"
          disabled={isSubmitDisabled}
        >
          {isSpinning && <Spinner size={18} thickness={2} />}
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node,
  isCancelDisabled: PropTypes.bool,
  isSubmitDisabled: PropTypes.bool,
  isSpinning: PropTypes.bool,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string
}

ConfirmDialog.defaultProps = {
  isOpen: true,
  onClose: noop,
  onConfirm: noop,
  title: 'Confirmation',
  children: null,
  isCancelDisabled: false,
  isSubmitDisabled: true,
  isSpinning: false,
  cancelText: 'Cancel',
  confirmText: 'OK'
}

export default ConfirmDialog
