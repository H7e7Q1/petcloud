import request from '@/utils/request'

// 订单分页查询
export const getPetServiceOrderPage = (params?) =>
  request('get', '/api/mgt/petserviceorder/getPetServiceOrderPage', params)
 
// 取消订单
export const toCancel = (id) =>
  request('delete', `/api/mgt/petserviceorder/toCancel/${id}` )