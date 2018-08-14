import Axios from 'axios'
import { Toast } from 'antd-mobile'
import { isDev, urlParam } from 'common/js/utils'
import { saveHandler, getHandler } from './_data_handler'
import queryString from 'common/js/utils/query_string'
import { convertBase64UrlToBlob } from '@create/utils/_index'

const axiosInstance = Axios.create({ baseURL: '/' })

const DEFAULT_CONFIG = {
  teamid: 3100,
  unitid: 184,
  userid: 92
}

// 请求成功数据处理
axiosInstance.interceptors.response.use(resp => {
  if (resp.status === 200) {
    return resp.data
  } else {
    Toast.fail('请求接口报错!')
    console.log(resp)
    return Promise.reject(resp)
  }
})

let BASE_URL = '/edu/course/api.php'

let URLS = {
  // saveData: 'save_touch_page', // 保存点读数据[老版]
  // getData: 'get_touch_page_data', // 获取点读数据[老版]
  saveData: 'saveinfo', // 保存点读数据[新版]
  getData: 'getinfo', // 获取点读数据[新版]
  savePageTpl: 'save_template', // 保存模板
  getPageTpl: 'get_template_list', // 获取模板列表
  getPageTplById: 'get_template_info', // 获取一个模板
  getList: 'get_list', // 获取列表数据 通用接口，传表名
  saveInfo: 'save_info', // 保存数据  通用接口，传表名
  getWxToken: 'get_wx_token' // 获取微信数据
}

if (isDev()) {
  BASE_URL = 'https://dev.catics.org/edu/course/api.php'
}

/**
 * 保存点读数据
 */
export const saveData = (id, data) => {
  let url = URLS.saveData
  data = saveHandler(id, data)

  // 团队 id，单元 id，用户 id
  data.checked = 1
  data.teamid = queryString('teamid') || DEFAULT_CONFIG.teamid
  data.unitid = queryString('unitid') || DEFAULT_CONFIG.unitid
  data.userid = queryString('userid') || DEFAULT_CONFIG.userid

  return axiosInstance.post(BASE_URL, urlParam({ action: url, data: JSON.stringify(data) }))
}

/**
 * 获取点读数据
 */
export const getData = id => {
  let url = URLS.getData
  return axiosInstance.post(BASE_URL, urlParam({ action: url, id: id })).then(data => {
    return getHandler(data)
  })
}

// 保存点读页模板
export const savePageTpl = data => {
  let url = URLS.savePageTpl
  let userid = queryString('userid') || DEFAULT_CONFIG.userid
  return axiosInstance.post(
    BASE_URL,
    urlParam({
      action: url,
      userid: userid,
      ...data
    })
  )
}

// 获取点读页列表模板
export const getPageTpl = () => {
  let url = URLS.getList
  let userid = queryString('userid') || DEFAULT_CONFIG.userid
  return axiosInstance.get(`${BASE_URL}?action=${url}&table=touch_template&userid=${userid}`)
}

// 获取图形列表
export const getShapeList = () => {
  let url = URLS.getList
  let userid = queryString('userid') || DEFAULT_CONFIG.userid
  return axiosInstance.get(`${BASE_URL}?action=${url}&table=user_shape&userid=${userid}`)
}

// 保存图形
export const postShape = data => {
  let url = URLS.saveInfo
  return axiosInstance.post(
    BASE_URL,
    urlParam({
      action: url,
      table: 'user_shape',
      data: JSON.stringify(data)
    })
  )
}

// 获取微信 token
export const getWxToken = () => {
  let url = URLS.getWxToken
  return axiosInstance.get(`${BASE_URL}?action=${url}`)
}

// 上传 base64的图片
export const uploadBase64Img = canvas => {
  let LOCAL_BASE_URL = '/edu/course/diandu_v1'
  if (isDev()) {
    LOCAL_BASE_URL = ''
  }
  let imgData = canvas.toDataURL()
  let blobImg = convertBase64UrlToBlob(imgData)
  let formData = new FormData()
  let nameImg = `${new Date().getTime()}.png`
  formData.append('file', blobImg, nameImg)
  return Axios.post(LOCAL_BASE_URL + '/php/webuploader.php', formData)
}
