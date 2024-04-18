import request from '@/utils/request'

// 宠物分页查询
export const getPetPage = (params?) =>
  request('get', '/api/mgt/pet/getPetPage', params)

// 删除宠物
export const deletePet = (id) =>
  request('delete', '/api/mgt/pet/deletePet/'+id )

  // 宠物上架和下架切换
export const petOnSelf = (id) =>
request('put', '/api/mgt/pet/petOnSelf/'+id)

// 新增或更新宠物
export const saveOrUpdatePet = (params?) =>
request('post', '/api/mgt/pet/saveOrUpdatePet', params)