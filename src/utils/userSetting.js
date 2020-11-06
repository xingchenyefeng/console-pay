import Cookies from 'js-cookie'

export function setUserSetting({ key, value }) {
  Cookies.set(key, value)
}

export function getUserSetting(key) {
  return Cookies.get(key)
}
