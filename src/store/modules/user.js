import { login, logout, getInfo } from '@/api/login'
import {
  getToken,
  setToken,
  removeToken,
  getJwt,
  getUserId,
  removeJwt,
  resetExpireTime,
  setAvatar,
  getAvatar,
  setName,
  getName,
  setUserId
} from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  jwt: getJwt(),
  name: getName(),
  userId: getUserId(),
  avatar: getAvatar(),
  introduction: '',
  managerList: [],
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_JWT: (state, jwt) => {
    state.jwt = jwt
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USER_ID: (state, userId) => {
    state.userId = userId
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MANAGER_LIST: (state, list) => {
    state.managerList = list
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username, password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resetExpireTime()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject('验证失败,请稍后登录.')
        }
        const { roles, name, avatar, introduction } = data
        // roles must be a non-empty array
        roles.push({})
        // if (process.env.NODE_ENV === 'development') {
        //   roles.push({})
        // } else {
        //   if (!roles || roles.length <= 0) {
        //     reject('getInfo: roles must be a non-null array!')
        //   }
        // }
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  loginCallback({ commit }, loginResult) {
    const errorCode = loginResult.errorCode.trim()
    if (errorCode === '0') {
      const { token, avatar, name, userId } = loginResult
      commit('SET_TOKEN', token)
      commit('SET_AVATAR', avatar)
      commit('SET_NAME', name)
      commit('SET_USER_ID', userId)
      setToken(token)
      setAvatar(avatar)
      setUserId(userId)
      setName(name)
      resetExpireTime()
    } else {
      this.$message({
        type: 'danger',
        message: '登录失败，请重新认证或者查看有没有登录当前应用的权限'
      })
    }
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_JWT', '')
        removeToken()
        removeJwt()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_JWT', '')
      removeToken()
      removeJwt()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const { roles } = await dispatch('getInfo')
      resetRouter()
      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
      // dynamically add accessible routes
      router.addRoutes(accessRoutes)
      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
