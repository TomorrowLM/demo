import request from './request'

export const getProducts = (params) =>
  request.get('/api/v1/products', { params })
export const getProduct = (productId) =>
  request.get(`/api/v1/products/${productId}`)
