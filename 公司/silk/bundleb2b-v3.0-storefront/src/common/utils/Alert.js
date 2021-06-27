import swal from 'sweetalert2'

/**
 * Alert object
 * @example
 * // display an error Alert
 * import Alert from 'relative-path/Alert';
 * Alert.error(errorMessage);
 */
export default {
  async error(text, options) {
    return swal({
      type: 'error',
      text,
      ...options,
    })
  },
  async success(text, options) {
    return swal({
      type: 'success',
      text,
      ...options,
    })
  },
  async warning(text, options) {
    return swal({
      type: 'warning',
      text,
      ...options,
    })
  },
  async info(text, options) {
    return swal({
      type: 'info',
      text,
      ...options,
    })
  },
}
