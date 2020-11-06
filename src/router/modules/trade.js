import layout from '@/layout'

const tradeRouter = {
  path: '/trade',
  component: layout,
  redirect: '/trade/tradeLogs',
  meta: {
    title: '交易管理',
    icon: 'component'
  },
  children: [{
    path: 'tradeLogs',
    name: 'tradeLogs',
    component: () =>
      import('@/views/trade/tradeLogs'),
    meta: {
      title: '交易流水',
      icon: 'component'
    }
  }]
}

export default tradeRouter
