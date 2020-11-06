import proxy from '@/utils/proxy'

export function getTradeRecords(params) {
  return proxy.get({
    url: '/trade/getTradeRecords',
    params
  })
}

export function getTradeDetail(id) {
  return proxy.get({
    url: '/trade/getTradeDetail',
    params: { id }
  })
}

export function getTradeStates() {
  return proxy.get({
    url: '/trade/getTradeStates'
  })
}

export function refund(id) {
  return proxy.post({
    url: '/trade/refund',
    data: { id }
  })
}
