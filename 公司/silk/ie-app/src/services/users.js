import request from './request'

export const login = (data) => request.post('/api/v1/sessions', data)
export const updateToken = (data) => request.put('/api/v1/sessions', data)
export const forgotPassword = (data) =>
  request.post('/api/v1/sessions/password', data)
export const changePassword = (data) =>
  request.put('/api/v1/users/password', data)
export const resetPassword = (data) =>
  request.put('/api/v1/sessions/password', data)
export const logout = () => request.delete('/api/v1/sessions')
export const checkTokenStatus = () => request.get('/api/v1/sessions/status')
export const getUsers = (params) => request.get('/api/v1/users', { params })
export const getUserById = (id) => request.get(`/api/v1/users/${id}`)
export const deleteUsers = (data) => request.delete('/api/v1/users', { data })
export const getMerchatRoles = (params) =>
  request.get('/api/v1/roles', { params })
export const createUser = (data) => request.post('/api/v1/users', data)
export const updateUser = (data, id) => request.put(`/api/v1/users/${id}`, data)
