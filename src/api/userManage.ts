import request from '@/utils/request'

// 登录
export const getUserPage = (params) =>
  request('get', '/api/mgt/user/getUserPage', params)
