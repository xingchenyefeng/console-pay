import { getToken } from './auth'

const envState = {
  fileUploadUrl: process.env.VUE_APP_UPLOAD_URL,
  signType: process.env.VUE_APP_SIGN_TYPE
}

const getFileViewPath = ({ path }) => {
  return process.env.VUE_APP_IMG_VIEW_PATH_PREFIX + path
}

const getFileUploadHeaders = () => {
  const headers = {}
  headers.client_type = 'manager_web'
  headers.token = getToken()
  return headers
}

export {
  envState,
  getFileViewPath,
  getFileUploadHeaders
}
