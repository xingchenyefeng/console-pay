import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
// import VueAMap from 'vue-amap'

import './icons' // icon
import './permission' // permission control

import * as filters from './filters' // global filters
import { envState, getFileViewPath, getFileUploadHeaders } from './utils/environment'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

/**
 * 图片统一上传地址
 * @type {string}
 */

/**
 * 线上微信回调地址
 * @type {string}
 */

/**
 * 全局图片上传http头部
 */

/**
 * 全局图片浏览
 * @param path
 * @returns {string}
 */
export function initApplicationContextParams() {
  Vue.prototype.$signType = envState.signType
  Vue.prototype.$getFileUploadHeaders = getFileUploadHeaders
  Vue.prototype.$fileUploadUrl = envState.fileUploadUrl
  if (Vue.prototype.$signType === 'PASSWORD') {
    router.addRoutes([{
      path: '/login',
      component: () =>
        import('@/views/login/login'),
      hidden: true
    }])
  }
}

initApplicationContextParams()

Vue.use(Element, {
  size: Cookies.get('size') || 'mini' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
