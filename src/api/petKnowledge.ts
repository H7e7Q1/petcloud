import request from '@/utils/request'

// 宠物知识分页查询
export const getPetSchoolPage = (params) =>
  request('get', '/api/mgt/petschool/getPetSchoolPage', params)

// 宠物知识删除
export const deletePetSchool = (id) =>
  request('delete', '/api/mgt/petschool/deletePetSchool/' + id)

// 宠物知识上架和下架切换
export const petSchoolOnSelf = (id) =>
  request('put', '/api/mgt/petschool/petSchoolOnSelf/' + id)

// 宠物新增或更新知识
export const getPetOrderPage = (params) =>
  request('post', '/api/mgt/petschool/saveOrUpdatePetSchool', params)

