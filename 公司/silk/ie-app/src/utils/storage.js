import { storageSchema } from '../config'
import valueTypes from './valueTypes'

class StorageItem {
  constructor({ key, valueType, storageType }) {
    this.key = key
    this.valueType = valueType
    this.storageType =
      storageType === 'local' ? 'localStorage' : 'sessionStorage'
  }

  isValueTypeValid(val) {
    return valueTypes.getValueType(val) === this.valueType
  }

  get val() {
    const storageValue = window[this.storageType].getItem(this.key)
    if (storageValue && ['Object', 'Array'].includes(this.valueType)) {
      return JSON.parse(storageValue)
    }
    return storageValue
  }

  set val(val) {
    const valueType = valueTypes.getValueType(val)
    if (!this.isValueTypeValid(val)) {
      throw new Error('Invalid value type')
    }
    if (['Object', 'Array'].includes(valueType)) {
      window[this.storageType].setItem([this.key], JSON.stringify(val))
      return this
    }
    window[this.storageType].setItem([this.key], val)
    return this
  }

  remove() {
    window[this.storageType].removeItem(this.key)
    return this
  }
}
export default storageSchema.reduce((storage, schema) => {
  storage[schema.key] = new StorageItem(schema)
  return storage
}, {})
