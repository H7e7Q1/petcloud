import request from '@/utils/request'
export const fetchData = () => {
  return request({
    url: 'https://www.fastmock.site/mock/dc695d037038802def4b989ba4650c3f/vms/getUser',
    method: 'post'
  });
};

// 登录
export const loginApi = (params) =>
  request('get', '/api/mgt/admin/login', params)

// 退出
export const loginOut = () =>
  request('get', '/api/mgt/admin/loginOut')
// 修改密码
export const updateAdminPassword = () =>
  request('put', '​/api​/mgt​/admin​/updateAdminPassword')


// 获取管理人信息 
export const getAdminInfo = (params?) =>
  request('get', '/api/mgt/admin/getAdminInfo', params)
// 修改管理员信息
export const updateAdminInfo = (params?) =>
  request('put', '/api/mgt/admin/updateAdminInfo', params)