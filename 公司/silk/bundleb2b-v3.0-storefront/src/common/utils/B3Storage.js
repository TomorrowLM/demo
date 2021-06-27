const B3StorageSchema = {
  B3RoleId: 'B3RoleId',
  B3CompanyId: 'B3CompanyId',
  B3UserId: 'B3UserId',
  B3B2BToken: 'B3B2BToken',
  B3Email: 'B3Email',
  B3IsB2CUser: 'B3IsB2CUser',
  B3isSetSalesRep: 'B3isSetSalesRep',
  B3CompanyStatus: 'B3CompanyStatus',
  B3SalesRepFirstIn: 'B3SalesRepFirstIn',
  B3CompanyName: 'B3CompanyName',
  B3QuoteCompany: 'B3QuoteCompany',
  B3CompanyInfo: 'B3CompanyInfo',
  B3AddressBookActionPermission: 'B3AddressBookActionPermission',
  B3AddressBookIsEnabled: 'B3AddressBookIsEnabled',
}

const clear = () => {
  Object.values(B3StorageSchema).forEach(field => {
    sessionStorage.removeItem(field)
  })
}

const getValue = function getValue() {
  return sessionStorage.getItem(this.name)
}

const setValue = function setValue(value) {
  sessionStorage.setItem(this.name, value)
}

const removeValue = function removeValue() {
  sessionStorage.removeItem(this.name)
}

const mergeItemFunc = obj => ({
  ...obj,
  get value() {
    return getValue.call(obj)
  },
  setValue: setValue.bind(obj),
  removeValue: removeValue.bind(obj),
})

const TPACompanyInfo = mergeItemFunc({
  name: 'TPACompanyInfo',
})

const B3AddressBook = {
  isAllow: mergeItemFunc({
    name: 'B3AddressBookActionPermission',
  }),
  isEnabled: mergeItemFunc({
    name: 'B3AddressBookIsEnabled',
  }),
}

const B3StorageFields = Object.entries(B3StorageSchema).reduce((result, [key, value]) => {
  result[key] = mergeItemFunc({
    name: value,
  })
  return result
}, {})

const B3CompanyInfo = mergeItemFunc({
  name: 'B3CompanyInfo',
})

const B3ExtraFields = mergeItemFunc({
  name: 'B3ExtraFields',
})

export default {
  B3StorageSchema,
  clear,
  TPACompanyInfo,
  ...B3StorageFields,
  B3AddressBook,
  B3CompanyInfo,
  B3ExtraFields,
}
