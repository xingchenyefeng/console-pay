import request from './request'
import qs from 'qs'

/**
 * 序列化data提交get请求
 * @param config
 */
const get = (config) => {
  // 解决乱码问题
  config.data = encodeURI(qs.stringify(config.data))
  config.method = 'get'
  return request(config)
}

const generalGet = (config) => {
  // 解决乱码问题
  config.method = 'get'
  return request(config)
}

/**
 * 序列化data提交post请求
 * @param config
 */
const post = (config) => {
  // 解决乱码问题
  config.data = encodeURI(qs.stringify(config.data))
  config.method = 'post'
  return request(config)
}

/**
 * 直接使用axios的post提交，为requestBody模式
 * @param config
 */
const postBody = (config) => {
  config.method = 'post'
  return request(config)
}

const formSubmit = (config) => {
  config.headers['Content-Type'] = 'multipart/form-data'
  config.method = 'post'
  return request(config)
}
/**
 * 文件上传未完待续
 */
const postFile = (config) => {
  return request(config)
}
/**
 * 导出方法引用
 */
export default {
  post,
  get,
  postBody,
  postFile,
  generalGet,
  formSubmit
}
