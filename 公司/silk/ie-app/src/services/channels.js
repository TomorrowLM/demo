import request from './request'

export const getMerchantChannelTypes = (params) =>
  request.get('/api/v1/channels', { params })
export const getChannelConnections = (channelId) =>
  request.get(`/api/v1/channels/${channelId}/connections`)
