import _ from 'lodash'
import {
  EVENT_VIDEO_GET_POSTER,
  EVENT_AUDIO_APPLY_CURRENT_PAGE,
  EVENT_AUDIO_APPLY_ALL_PAGE
} from '@/page/create/handle'
import { hex2Rgba } from 'common/js/utils'

// 格式化组件类型
export const POINT_FORMAT_TYPE = {
  SLIDER: 'slider',
  COLOR: 'color',
  BUTTON: 'button',
  SELECT: 'select',
  SWITCH: 'switch',
  CHECKBOX_LIST: 'checkbox_list' //  多个复选框组合
}

// 2019-03-07 21:49:40
// 分类是需要的，但是目前提供的这几种分类，无法包含所有,只有针对文本框才有非常多的格式设置，意义不是很大
// 格式化选项的分类
// 没有分类的统统放在分类设置里面
export const POINT_FORMAT_CATEGORY = [
  { label: '通用设置', key: '' },
  { label: '文字设置', key: 'setting_text' },
  { label: '边线设置', key: 'setting_border' }
]

// 点读点格式设置
export const POINT_FORMAT_CONFIG = [
  {
    type: POINT_FORMAT_TYPE.SLIDER,
    title: '大小比例(%)',
    name: 'point_scale',
    max: 250,
    min: 50,
    step: 10,
    defaultValue: 100
  },
  {
    type: POINT_FORMAT_TYPE.SLIDER,
    title: '按钮透明度',
    name: 'btn_opacity',
    styleName: 'opacity',
    max: 1,
    min: 0,
    step: 0.05,
    defaultValue: 0,
    marks: { 0: '不透明', 1: '透明' }
  },
  {
    type: POINT_FORMAT_TYPE.COLOR,
    title: '背景颜色',
    name: 'background_color',
    styleName: 'backgroundColor',
    showTransparent: true // 显示透明
  },
  {
    type: POINT_FORMAT_TYPE.COLOR,
    title: '图形填充色',
    name: 'fill_color',
    styleName: 'fill'
  },

  // 边线设置
  {
    type: POINT_FORMAT_TYPE.SLIDER,
    title: '边线透明度',
    name: 'border_opacity',
    max: 1,
    min: 0,
    step: 0.05,
    defaultValue: 0,
    marks: { 0: '不透明', 1: '透明' },
    category: 'setting_border'
  },
  {
    type: POINT_FORMAT_TYPE.SLIDER,
    title: '边线宽度',
    name: 'border_width',
    styleName: 'borderWidth',
    max: 20,
    min: 0,
    step: 1,
    defaultValue: 1,
    category: 'setting_border'
  },

  {
    type: POINT_FORMAT_TYPE.COLOR,
    title: '边线颜色',
    name: 'border_color',
    styleName: 'borderColor',
    category: 'setting_border'
  },
  // 字体设置
  {
    type: POINT_FORMAT_TYPE.SLIDER,
    title: '字体大小',
    name: 'fontsize',
    styleName: 'fontSize',
    max: 30,
    min: 10,
    step: 1,
    defaultValue: 14,
    category: 'setting_text'
  },
  {
    type: POINT_FORMAT_TYPE.COLOR,
    title: '字体颜色',
    name: 'color',
    styleName: 'color',
    category: 'setting_text'
  },
  {
    type: POINT_FORMAT_TYPE.SELECT,
    title: '字体',
    name: 'font_family',
    styleName: 'fontFamily',
    values: [
      { key: '微软雅黑', value: 'Microsoft YaHei' },
      { key: '宋体', value: '宋体' },
      { key: '黑体', value: 'Heiti' },
      { key: '楷体', value: 'KaiTi' },
      { key: '新宋体', value: 'NSimSun' },
      { key: '仿宋', value: 'FangSong' }
    ]
  },
  {
    type: POINT_FORMAT_TYPE.SELECT,
    title: '左右对齐',
    name: 'justify_content',
    styleName: 'justifyContent',
    values: [
      { key: '左对齐', value: 'flex-strt' },
      { key: '居中', value: 'center' },
      { key: '右对齐', value: 'flex-end' }
    ]
  },
  {
    type: POINT_FORMAT_TYPE.SELECT,
    title: '上下对齐',
    name: 'align_items',
    styleName: 'alignItems',
    values: [
      { key: '上对齐', value: 'flex-strt' },
      { key: '居中', value: 'center' },
      { key: '下对齐', value: 'flex-end' }
    ]
  },
  {
    type: POINT_FORMAT_TYPE.CHECKBOX_LIST,
    name: 'font_setting',
    configs: [
      {
        title: '加粗',
        name: 'fontWeight',
        styleName: 'fontWeight',
        value: 'bold'
      },
      {
        title: '斜体',
        name: 'fontStyle',
        styleName: 'fontStyle',
        value: 'italic'
      },
      {
        title: '下划线',
        name: 'textDecoration',
        styleName: 'textDecoration',
        value: 'underline'
      }
    ]
  },
  // video相关
  {
    type: POINT_FORMAT_TYPE.BUTTON,
    title: '视频区域海报图',
    name: 'poster_time',
    event: EVENT_VIDEO_GET_POSTER
  },
  // audio 相关
  {
    type: POINT_FORMAT_TYPE.BUTTON,
    title: '应用到本页的区域音频',
    name: 'apply_current_page_format',
    event: EVENT_AUDIO_APPLY_CURRENT_PAGE,
    onlyArea: true // 只有区域点读点展示
  },
  {
    type: POINT_FORMAT_TYPE.BUTTON,
    title: '应用到所有区域音频',
    name: 'apply_all_page_format',
    event: EVENT_AUDIO_APPLY_ALL_PAGE,
    onlyArea: true // 只有区域点读点展示
  }
]

// 通用的点读点配置，每个点读点都有
const DEFAULT_FORMAT_CONFIG = ['point_scale', 'border_opacity', 'border_width', 'border_color', 'btn_opacity']

// 区域点读点的配置
const DEFAULT_AREA_FORMAT_CONFIG = ['background_color']

// 不同点读点类型特有的设置参数
const POINT_FORMAT_CONFIG_TYPE = {
  video: ['poster_time'],
  audio: ['apply_current_page_format', 'apply_all_page_format'],
  input: [
    'border_opacity',
    'border_width',
    'btn_opacity',
    'fontsize',
    'border_color',
    'color',
    'background_color',
    'font_family',
    'justify_content',
    'align_items',
    'font_setting'
  ],
  page_shape: ['point_scale', 'btn_opacity', 'fill_color'] // 这一项不合并默认的
}

/**
 * 遍历格式设置列表，选择出需要的配置参数
 *
 * @param types 配置类型列表
 * @param mergeDefault 是否合并默认的配置参数
 * @param isArea 是否为区域点读点
 */
const getConfigByTypeList = (types = [], mergeDefault = true, isArea = false) => {
  if (isArea) {
    types = _.unionWith(DEFAULT_AREA_FORMAT_CONFIG, types)
  }
  if (mergeDefault) {
    types = _.unionWith(DEFAULT_FORMAT_CONFIG, types)
  }

  let newConfig = []
  for (let i = 0; i < types.length; i++) {
    for (let j = 0; j < POINT_FORMAT_CONFIG.length; j++) {
      // 只有区域音频展示的
      if (POINT_FORMAT_CONFIG[j]['onlyArea']) {
        if (types[i] === POINT_FORMAT_CONFIG[j]['name'] && isArea) {
          newConfig.push(POINT_FORMAT_CONFIG[j])
        }
      } else {
        if (types[i] === POINT_FORMAT_CONFIG[j]['name']) {
          newConfig.push(POINT_FORMAT_CONFIG[j])
        }
      }
    }
  }
  return newConfig
}

/**
 * 根据点读点类型获取点读格式化配置,合并数组并去重
 *
 * @param {string} type 点读点类型
 * @param {bool} isArea 是否有区域点读点
 */
export const getFormatConfigByType = (type, isArea) => {
  switch (type) {
    // 视频
    case 'video':
      return getConfigByTypeList(POINT_FORMAT_CONFIG_TYPE['video'])
    // 音频
    case 'audio':
      return getConfigByTypeList(POINT_FORMAT_CONFIG_TYPE['audio'], true, isArea)
    // 文本框
    case 'input':
      return getConfigByTypeList(POINT_FORMAT_CONFIG_TYPE['input'], false)
    // 插入图形
    case 'page_shape':
      return getConfigByTypeList(POINT_FORMAT_CONFIG_TYPE['page_shape'], false)
    default:
      return getConfigByTypeList()
  }
}

// 获取点读点缩放样式
const getPointSizeScale = rcForm => {
  if (rcForm) {
    const { getFieldValue } = rcForm
    let data = getFieldValue('globalSetting')
    if (data && data.pointSizeScale) {
      return {
        transform: `scale(${data.pointSizeScale / 100})`
      }
    }
  }
  return {}
}

/**
 * 获取指定类型点读点的样式
 * @param {object} data pointData  点读点数据
 * @param {object} rcForm rcForm的属性方法
 *
 * WHY:为什么要这边处理，而不是直接把样式写到数据里面？
 * 因为有的样式由多个配置来控制，因此需要计算一下。 比如边框，所以这里用计算得出
 */
export const getFormatConfigStyle = (pointData, rcForm) => {
  const { type, format_config = {}, data = {} } = pointData

  let configs = getFormatConfigByType(type, data['triggerType'] === 'area') || []

  let pointScaleStyle = getPointSizeScale(rcForm)
  let styles = {
    border: '1px solid #66cccc',
    ...pointScaleStyle
  }

  for (let i = 0; i < configs.length; i++) {
    let styleName = configs[i]['styleName']
    let key = configs[i]['name']

    if (key === 'btn_opacity' && format_config[key] !== undefined) {
      // FIXED: 产品建议，透明度1表示透明，0 标识不透明, 跟CSS样式相反
      styles[styleName] = 1 - format_config[key]
    }

    // 边框透明度和边框颜色处理一个即可
    // FIXED: 产品建议，透明度1表示透明，0 标识不透明, 跟CSS样式相反
    else if (key === 'border_opacity' && format_config[key] !== undefined) {
      let color = hex2Rgba(format_config['border_color'], 1 - format_config[key])
      styles['borderColor'] = color
    }

    // 如果有颜色，没有边线透明度，则只返回颜色
    else if (key === 'border_color') {
      if (!format_config['border_opacity'] && format_config[key]) {
        styles[styleName] = format_config[key]
      }
      continue
    }

    // NOTE: 点读点缩放
    // 如果使用 scale 缩放，会和某一些动画冲突，比如 animation.css 的 bounce
    // 因此放弃使用 scale， 而是使用宽高
    // 注意：区域模式，则没有点读点大小设置选项，因此参数应该不起作用
    // styles['transform'] = `scale(${format_config[key] / 100})`
    else if (key === 'point_scale' && format_config[key]) {
      if (data && data.triggerType === 'area') {
        continue
      } else {
        styles['width'] = ((styles['width'] || 50) * format_config[key]) / 100
        styles['height'] = ((styles['height'] || 50) * format_config[key]) / 100
      }
    }

    // 字体设置（加粗，斜体，下划线）
    else if (key === 'font_setting') {
      if (format_config[key]) {
        let fontConfigs = configs[i]['configs']
        for (let j = 0; j < fontConfigs.length; j++) {
          if (format_config[key][fontConfigs[j]['name']]) {
            styles[fontConfigs[j]['styleName']] = fontConfigs[j]['value']
          }
        }
      }
    }

    // 字体设置
    else if (['font_family', 'justify_content', 'align_items'].indexOf(key) !== -1) {
      if (format_config[key]) {
        let fontFamilyList = configs[i]['values']
        styles[styleName] = fontFamilyList[format_config[key]]['value']
      }
    }

    // 其他常规样式设置
    else if (styleName && format_config[key] !== undefined) {
      styles[styleName] = format_config[key]
    }
  }

  return styles
}
