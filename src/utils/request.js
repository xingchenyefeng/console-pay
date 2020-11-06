import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import _ from 'lodash'
import { resetExpireTime } from './auth'

// create an axios instance
const service = axios.create({
  showMessage: true,
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 90000 // 请求超时时间
})

// request interceptor
// request拦截器
service.interceptors.request.use(
  config => {
    // if (store.getters.token) {
    //   config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    // 设置client_type常量
    config.headers.common['client-type'] = 'manager'
    config.headers.common['channel-type'] = 'web'
    // 设置token常量
    config.headers.common['token'] = getToken()
    config.headers.common['Cache-Control'] = 'no-cache'
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    if (_.isEmpty(response)) {
      response.data.message = '服务器没有响应'
      response.data.code = 'P5000'
    }
    const res = response.data
    if (_.isEmpty(res.message)) {
      res.message = '服务器没有响应'
    }
    if (res.code !== '0') {
      Message({
        message: res.message,
        type: 'error',
        duration: 4 * 1000
      })
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 'P4007') {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          // store.dispatch('FedLogOut').then(() => {
          //   location.reload() // 为了重新实例化vue-router对象 避免bug
          // })
          store.dispatch('user/resetToken').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      // return Promise.reject('error')
      return Promise.reject(response.data)
    } else {
      const { method, showMessage } = response.config
      if (method === 'post' && showMessage) {
        Message({
          message: '操作成功',
          type: 'success',
          duration: 4 * 1000
        })
      }
      resetExpireTime()
      return response.data
    }
  },
  error => {
    if (_.isEmpty(error.message)) {
      error.msg = '服务器没有响应'
    }
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 4 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
