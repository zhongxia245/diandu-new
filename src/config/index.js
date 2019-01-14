/**
 * 公共常量配置
 */

import { POINT_FORMAT_CONFIG, POINT_FORMAT_TYPE, getFormatConfigByType, getFormatConfigStyle } from './point_format'
import { POINT_TYPE, POINT_EFFECT_TYPE } from './point_type'

export const PRE_PAGE_ID = '_pageitem_id_' // 点读页前缀id
export const PRE_PAGE_CLASS = '_pageitem_class_' // 点读页前缀样式
export const PRE_POINT_CLASS = 'js-point' // 点读点移动标识样式

// 事件参数
export const EVENT_NAMES = {
  DISABLED_ADD_POINT: 'event_disabled_add_point', // 禁止添加点读点
  ENABLE_ADD_POINT: 'event_enable_add_point', // 允许添加点读点
  POINT_ADD_CUSTOME: 'point_add_custom' // 添加点读点
}
// 点读点大小
export const POINT_SIZE = 50

// 点读页面宽高
export const PAGE_SIZE = {
  width: 1000,
  height: 562
}

/**
 * 在点读页上绘制内容
 * 目前支持 文本框和形状
 * TODO:文本框是否可以考虑做下文本框点读点的区域类型上。
 */
export const PAGE_CONTENT_TYPE = {
  // 点读页文本框，绘制在页面上
  // 这里用数组是避免后续有其他参数可以传进来
  input: {
    name: 'input'
  },
  // 绘制图案
  shape: {
    name: 'page_shape'
  }
}

// 点的相关配置
export const POINT = {
  POINT_TYPE,
  POINT_EFFECT_TYPE,
  POINT_FORMAT_CONFIG,
  POINT_FORMAT_TYPE
}

// 根据点读点类型，获取点读点配置
export { getFormatConfigByType, getFormatConfigStyle }

// 工具栏选项卡配置
export const TOOLS_TABS = [
  { title: '类型选择' },
  { title: '内容上传' },
  { title: '格式设置' },
  { title: '激发模式' },
  { title: '动画设置' }
]

/**
 * 根据点读点类型获取相关配置
 * @param {string} type  点读点类型
 */
export const getPointConfigByType = type => {
  for (let i = 0; i < POINT_TYPE.length; i++) {
    if (type === POINT_TYPE[i]['type']) {
      return POINT_TYPE[i]
    }
  }
  for (let i = 0; i < POINT_EFFECT_TYPE.length; i++) {
    if (type === POINT_EFFECT_TYPE[i]['type']) {
      return POINT_EFFECT_TYPE[i]
    }
  }
  return null
}
