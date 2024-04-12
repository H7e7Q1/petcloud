import request from '@/utils/request'

// 商品分页查询
export const getProductPage = (params) =>
  request('get', '/api/mgt/product/getProductPage', params)

// 商品删除
export const deleteProduct = (id) =>
  request('delete', '/api/mgt/product/deleteProduct/' + id)

// 商品上架和下架切换
export const productOnSelf = (id) =>
  request('put', '/api/mgt/product/productOnSelf/' + id)

// 商品新增或更新
export const saveOrUpdateProduct = (params) =>
  request('post', '/api/mgt/product/saveOrUpdateProduct', params)

