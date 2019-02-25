import ee from 'common/js/event.js'
import hasListeners from 'event-emitter/has-listeners'
import { EVENT_NAMES } from '@/config'

// 点读页是否允许添加点读点
export let ALLOW_ADD_POINT = true

// const getPointData = ({ pageIndex, pointIndex, form }) => {
//   const { getFieldValue } = form
//   let pagesData = getFieldValue('pages') || []
//   return pagesData[pageIndex]['points'][pointIndex] || {}
// }

// const setPointData = (newState, { pageIndex, pointIndex, form }) => {
//   let pointData = getPointData({ pageIndex, pointIndex, form })
//   const { getFieldValue, setFieldsValue } = form
//   let pagesData = getFieldValue('pages') || []
//   pagesData[pageIndex]['points'][pointIndex] = { ...pointData, ...newState }
//   setFieldsValue({ pages: pagesData })
// }

export const initEvent = ({ form }) => {
  // 避免多次注册
  if (!hasListeners(ee, EVENT_NAMES.DISABLED_ADD_POINT)) {
    ee.on(EVENT_NAMES.DISABLED_ADD_POINT, pageIndex => {
      ALLOW_ADD_POINT = false
    })
  }
  if (!hasListeners(ee, EVENT_NAMES.ENABLE_ADD_POINT)) {
    ee.on(EVENT_NAMES.ENABLE_ADD_POINT, pageIndex => {
      ALLOW_ADD_POINT = true
    })
  }
}
