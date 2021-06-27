export const fileTypeList = {
  0: 'Trade Service Standard File (.XLSX)',
  1: 'Flat File (.CSV / .XLS/ .XLSX)',
  2: 'Unilog Standard File (.XLSX)'
}

export const autoAttributeMappingFieldList = {
  0: 'Magento Attribute Label',
  1: 'Magento Attribute Code'
}

export const fileTypeDownloadLinks = {
  0: 'https://s3-us-west-2.amazonaws.com/ie-v1.0-files-staging/tradeService_example.xlsx',
  1: 'https://s3-us-west-2.amazonaws.com/ie-v1.0-files-staging/flatfile_example.xlsx',
  2: 'https://s3-us-west-2.amazonaws.com/ie-v1.0-files-staging/unilog_example.xlsx'
}

const Enum = {
  getValue(obj, key) {
    return obj[key]
  },
  getKey(obj, value) {
    return Object.keys(obj).find((key) => obj[key] === value)
  },
  getFileType(key) {
    return this.getValue(fileTypeList, key)
  },
  getAutoAttributeMappingField(key) {
    return this.getValue(autoAttributeMappingFieldList, key)
  },
  getFileTypeDownloadLinks(key) {
    return this.getValue(fileTypeDownloadLinks, key)
  }
}

export default Enum
