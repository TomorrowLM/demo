import re from './re'

export default function (str) {
  return str.replace(re.trim, '')
}
