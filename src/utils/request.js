import fetch from '@/utils/fetch'

/**
 * 通用请求方法
 * @param {methodType} 请求方式
 * @param {url} 接口
 * @param {dataParams} 正常传参
 * @param {otherOptions} 其他配置项,如是否加密等
 */
/* 通用请求方法 */
function request(
  methodType,
  url,
  dataParams,
  otherOptions = {}
) {
  methodType = methodType?.toUpperCase()
  dataParams = dataParams || ''
  let requestConfig = {
    method: methodType,
  }
  requestConfig.url = url
  switch (methodType) {
    case 'POST':
    case 'PUT':
    case 'DELETE':
      requestConfig.headers = { 'Content-Type': 'application/json' }
      requestConfig.data = dataParams
      break
    case 'GET':
      requestConfig.headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
      requestConfig.params = dataParams
      break
    default:
      requestConfig.headers = { 'Content-Type': 'application/json' }
      requestConfig.method = 'POST'
      requestConfig.data = dataParams
      break
  }
  return fetch(requestConfig)
}
export default request
