import Cookies from 'js-cookie'

const TokenKey = 'hbsj_admin_token'
const Jwt = 'hbsj_jwt'
const USER_AVATAR = 'hbsj_avatar'
const USER_ID = 'user_id'
const NAME = 'hbsj_real_name'
const EXPIRE_TIME = 'expire_time' // session过期时间
const DEPT_NAME = 'dept_mame'

export function getToken() {
  return Cookies.get(TokenKey)
  // return 'admin'
}

export function getJwt() {
  return Cookies.get(Jwt)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setJwt(jwt) {
  return Cookies.set(Jwt, jwt)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeJwt() {
  return Cookies.remove(Jwt)
}

export function setAvatar(avatar) {
  return Cookies.set(USER_AVATAR, avatar)
}

export function getAvatar() {
  return Cookies.get(USER_AVATAR)
}

export function setUserId(userId) {
  return Cookies.set(USER_ID, userId)
}

export function getUserId() {
  return Cookies.get(USER_ID)
}

export function getName() {
  return Cookies.get(NAME)
}

export function setName(name) {
  return Cookies.set(NAME, name)
}

export function resetExpireTime() {
  return Cookies.set(EXPIRE_TIME, new Date().getTime() + (60 * 60 * 1000))
}

export function getExpireTime() {
  return Cookies.get(EXPIRE_TIME)
}

export function setDeptName(deptName) {
  return Cookies.set(DEPT_NAME, deptName)
}

export function getDeptName() {
  return Cookies.get(DEPT_NAME)
}
