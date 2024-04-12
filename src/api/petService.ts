import request from '@/utils/request'

// 服务分页查询
export const getPetServicePage = (params?) =>
  request('get', '/api/mgt/petservice/getPetServicePage', params)
 
// 删除服务
export const deletePetService = (id) =>
  request('delete', `/api/mgt/petservice/deletePetService/${id}` )

  // 服务上架和下架切换
export const petServiceOnSelf = (id) =>
request('put', `/api/mgt/petservice/petServiceOnSelf/${id}` )

// 新增或更新宠物
export const saveOrUpdatePetService = (params?) =>
request('post', '/api/mgt/petservice/saveOrUpdatePetService', params)