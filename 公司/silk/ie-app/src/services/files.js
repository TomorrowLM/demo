import request from './request'

export const filesUpload = (data) => request.post('/api/v1/files', data)
export const fileAnalysis = (params) =>
  request.get('/api/v1/files/analysis', { params })
