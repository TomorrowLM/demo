import request from './request'

export const getProfileList = (params) =>
  request.get('/api/v1/profiles', { params })
export const deleteProfiles = (data) =>
  request.delete('/api/v1/profiles', { data })
export const searchProfilesAttributes = (params) =>
  request.get('/api/v1/profiles/attributes', { params })
export const addProfile = (data) => request.post('/api/v1/profiles', data)
export const getProfileById = (id) => request.get(`/api/v1/profiles/${id}`)
