import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import _ from 'lodash'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  let sourceName
  if (moduleName.indexOf('/') > 0) {
    const array = _.split(moduleName, '/')
    sourceName = array[array.length - 1]
  } else {
    sourceName = moduleName
  }
  modules[sourceName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  getters
})

export default store
