const typeList = [
  'String',
  'Array',
  'Number',
  'Boolean',
  'Object',
  'NaN',
  'Undefined',
  'Function',
  'Date',
  'RegExp',
  'JSON'
]

const valueTypes = {
  getValueType(value) {
    return Object.prototype.toString.call(value).slice(8, -1)
  }
}

typeList.forEach((type) => {
  valueTypes[`is${type}`] = (value) => valueTypes.getValueType(value) === type
})

export default valueTypes
