import defaultSettings from '@/settings'

const title = defaultSettings.title || '支付平台-展华'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
