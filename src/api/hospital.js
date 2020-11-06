import proxy from '@/utils/proxy'

export function getHospitals(params) {
  return proxy.get({
    url: '/hospital/getHospitals',
    params
  })
}

export function getHosNames(name) {
  return proxy.get({
    url: '/hospital/getHosNames',
    params: { name }
  })
}

export function saveHospitalConfig(params) {
  return proxy.postBody({
    url: '/hospital/saveHospitalConfig',
    data: params
  })
}

export function getHosInfoById(id) {
  return proxy.get({
    url: '/hospital/getHosInfoById',
    params: { id }
  })
}
