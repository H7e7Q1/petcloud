import request from '@/utils/request'

// 宠物订单分页查询
export const getPetOrderPage = (params) =>
  request('get', '/api/mgt/petorder/getPetOrderPage', params)
  
  // 取消订单
export const toCancel = (id) =>
request('delete', `/api/mgt/petorder/toCancel/${id}`)

 // 订单发货
export const toDelivery = (params) =>
  request('put', '/api/mgt/petorder/toDelivery', params)