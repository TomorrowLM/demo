import _ from 'lodash'

function minMaxValidate(minInputSelector, maxInputSelector) {
  function validate(cb) {
    const minValue = parseFloat(document.querySelector(minInputSelector).value)
    const maxValue = parseFloat(document.querySelector(maxInputSelector).value)

    if (maxValue > minValue || _.isNaN(maxValue) || _.isNaN(minValue)) {
      return cb(true)
    }

    return cb(false)
  }

  return validate
}

export default minMaxValidate
