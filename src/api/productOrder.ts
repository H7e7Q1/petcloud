import request from '@/utils/request'

// 订单分页查询
export const getProductOrderPage = (params?) =>
  request('get', '/api/mgt/productorder/getProductOrderPage', params)

// 取消订单
export const deletePetService = (id) =>
  request('delete', `/api/mgt/productorder/toCancel/${id}`)

// 订单发货
export const toDelivery = (params) =>
  request('put', '/api/mgt/productorder/toDelivery', params)
