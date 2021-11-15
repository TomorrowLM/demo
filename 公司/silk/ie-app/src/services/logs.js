import request from './request'

export const getUploadFileList = (params) =>
  request.get('/api/v1/logs', { params })
