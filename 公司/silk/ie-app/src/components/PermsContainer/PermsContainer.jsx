import { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { checkPerms } from '../../utils'

const PermsContainer = forwardRef((props, ref) => {
  const { permissionsCode, children, no, ...extra } = props

  const isAllowed = checkPerms(permissionsCode)

  const C =
    typeof children === 'function'
      ? children({
          ref,
          ...extra
        })
      : children

  return isAllowed ? C : no
})

PermsContainer.propTypes = {
  permissionsCode: PropTypes.arrayOf(PropTypes.number),
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  no: PropTypes.node
}

PermsContainer.defaultProps = {
  permissionsCode: [],
  no: null
}

export default PermsContainer
