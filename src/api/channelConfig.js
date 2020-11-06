import proxy from '@/utils/proxy'

export function getChannelConfigs(params) {
  return proxy.get({
    url: '/channel/getChannelConfigs',
    params
  })
}

export function getChannelCodes(code) {
  return proxy.get({
    url: '/channel/getChannelCodes',
    params: { code }
  })
}

export function saveChannelConfig(params) {
  return proxy.postBody({
    url: '/channel/saveChannelConfig',
    data: params
  })
}

export function getChannelConfigById(id) {
  return proxy.get({
    url: '/channel/getChannelConfigById',
    params: { id }
  })
}

export function getAlipayChannels() {
  return proxy.get({
    url: '/channel/getAlipayChannels'
  })
}

export function release(channelCode) {
  return proxy.post({
    url: '/channel/release',
    data: { channelCode }
  })
}

export function unreleased(channelCode) {
  return proxy.post({
    url: '/channel/unreleased',
    data: { channelCode }
  })
}
