import layout from '@/layout'

const configRouter = {
  path: '/config',
  component: layout,
  redirect: '/config/hospitalList',
  meta: {
    title: '配置管理',
    icon: 'component'
  },
  children: [{
    path: 'hospitalList',
    name: 'hospitalList',
    component: () =>
      import('@/views/config/hospitalList'),
    meta: {
      title: '接入医院',
      icon: 'component'
    }
  }, {
    path: 'channelList',
    name: 'channelList',
    component: () =>
      import('@/views/config/channelList'),
    meta: {
      title: '支付渠道',
      icon: 'component'
    }
  }]
}

export default configRouter
