import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import locales from '../../locales'

function StaticText({ langKey, lang }) {
  return <>{locales[lang][langKey]}</>
}

StaticText.propTypes = {
  langKey: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired
}

export default connect((state) => ({ lang: state.global.lang }))(StaticText)
