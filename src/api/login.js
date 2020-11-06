import proxy from '@/utils/proxy'

export function login({ username, password }) {
  return proxy.post({
    url: '/user/login',
    showMessage: false,
    data: {
      username,
      password
    }
  })
}

export function loginCallback(code, state) {
  return proxy.post({
    url: '/user/loginCallback',
    data: {
      code,
      state
    }
  })
}

export function getInfo(token) {
  return proxy.get({
    url: '/user/getInfo',
    params: { token }
  })
}

export function logout(token) {
  return proxy.post({
    url: '/user/logout',
    data: { token }
  })
}
