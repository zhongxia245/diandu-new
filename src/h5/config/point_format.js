import _ from 'lodash'
import { EVENT_VIDEO_GET_POSTER } from '@h5/page/create/handle/_index'
import { hex2Rgba } from 'common/js/utils'

export const POINT_FORMAT_TYPE = {
  SLIDER: 'slider',
  COLOR: 'color',
  BUTTON: 'button',
  SELECT: 'select',
  SWITCH: 'switch',
  CHECKBOX_LIST: 'checkbox_list' //  多个复选框组合
}
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
    title: '边线透明度',
    name: 'border_opacity',
    max: 1,
    min: 0,
    step: 0.01,
    defaultValue: 1
  },
  {
    type: POINT_FORMAT_TYPE.SLIDER,
    title: '边线宽度',
    name: 'border_width',
    styleName: 'borderWidth',
    max: 20,
    min: 0,
    step: 1,
    defaultValue: 1
  },
  {
    type: POINT_FORMAT_TYPE.SLIDER,
    title: '按钮透明度',
    name: 'btn_opacity',
    styleName: 'opacity',
    max: 1,
    min: 0,
    step: 0.01,
    defaultValue: 1
  },
  {
    type: POINT_FORMAT_TYPE.COLOR,
    title: '边线颜色',
    name: 'border_color',
    styleName: 'borderColor'
  },
  // video相关
  {
    type: POINT_FORMAT_TYPE.BUTTON,
    title: '视频区域海报图',
    name: 'poster_time',
    event: EVENT_VIDEO_GET_POSTER
  },
  {
    type: POINT_FORMAT_TYPE.SLIDER,
    title: '字体大小',
    name: 'fontsize',
    styleName: 'fontSize',
    max: 30,
    min: 10,
    step: 1,
    defaultValue: 14
  },
  {
    type: POINT_FORMAT_TYPE.COLOR,
    title: '字体颜色',
    name: 'color',
    styleName: 'color'
  },
  {
    type: POINT_FORMAT_TYPE.COLOR,
    title: '背景颜色',
    name: 'background_color',
    styleName: 'backgroundColor'
  },
  {
    type: POINT_FORMAT_TYPE.COLOR,
    title: '图形填充色',
    name: 'fill_color',
    styleName: 'fill'
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
    title: '对齐方式',
    name: 'text_align',
    styleName: 'textAlign',
    values: [{ key: '左对齐', value: 'left' }, { key: '居中', value: 'center' }, { key: '右对齐', value: 'right' }]
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
  }
]

// 通用的点读点配置，每个点读点都有
const DEFAULT_FORMAT_CONFIG = ['point_scale', 'border_opacity', 'border_width', 'btn_opacity', 'border_color']

// 不同点读点类型特有的设置参数
const POINT_FORMAT_CONFIG_TYPE = {
  video: ['poster_time'],
  audio: [],
  input: [
    'border_opacity',
    'border_width',
    'btn_opacity',
    'fontsize',
    'border_color',
    'color',
    'background_color',
    'font_family',
    'text_align',
    'font_setting'
  ],
  page_shape: ['point_scale', 'btn_opacity', 'fill_color'] // 这一项不合并默认的
}

/**
 * 遍历格式设置列表，选择出需要的配置参数
 * @param types 配置类型列表
 * @param mergeDefault 是否合并默认的配置参数
 */
const getConfigByTypeList = (types = [], mergeDefault = true) => {
  if (mergeDefault) {
    types = _.unionWith(DEFAULT_FORMAT_CONFIG, types)
  }
  let newConfig = []
  for (let i = 0; i < types.length; i++) {
    for (let j = 0; j < POINT_FORMAT_CONFIG.length; j++) {
      if (types[i] === POINT_FORMAT_CONFIG[j]['name']) {
        newConfig.push(POINT_FORMAT_CONFIG[j])
      }
    }
  }
  return newConfig
}

// 根据点读点类型获取点读格式化配置
export const getFormatConfigByType = type => {
  switch (type) {
    case 'video':
      // 合并数组并去重
      return getConfigByTypeList(POINT_FORMAT_CONFIG_TYPE['video'])
    case 'audio':
      return getConfigByTypeList(POINT_FORMAT_CONFIG_TYPE['audio'])
    case 'input':
      return getConfigByTypeList(POINT_FORMAT_CONFIG_TYPE['input'], false)
    case 'page_shape':
      return getConfigByTypeList(POINT_FORMAT_CONFIG_TYPE['page_shape'], false)
    default:
      return getConfigByTypeList()
  }
}

/**
 * 获取指定类型点读点的样式
 * @param {*} data format_config  点读点格式设置的值
 * @param {*} type 点读点类型
 * 为什么要这边处理，而不是直接把样式写到数据里面？
 * 因为有的样式由多个配置来控制，因此需要计算一下。 比如边框，所以这里用计算得出
 */
export const getFormatConfigStyle = pointData => {
  const { format_config, type, data } = pointData
  let configs = getFormatConfigByType(type) || []
  let styles = {}

  if (format_config) {
    for (let i = 0; i < configs.length; i++) {
      let styleName = configs[i]['styleName']
      let key = configs[i]['name']

      // 边框透明度和边框颜色处理一个即可
      if (key === 'border_opacity' && format_config[key] !== undefined) {
        let color = hex2Rgba(format_config['border_color'], format_config['border_opacity'])
        styles['borderColor'] = color
      } else if (key === 'border_color') {
        continue
      } else if (key === 'point_scale' && format_config[key]) {
        // 点读点缩放
        // 如果使用 scale 缩放，会和某一些动画冲突，比如 animation.css 的 bounce
        // 因此放弃使用 scale， 而是使用宽高
        // 注意：区域模式，则没有点读点大小设置选项，因此参数应该不起作用
        // styles['transform'] = `scale(${format_config[key] / 100})`
        if (data && data.triggerType === 'area') {
          continue
        } else {
          styles['width'] = ((styles['width'] || 50) * format_config[key]) / 100
          styles['height'] = ((styles['height'] || 50) * format_config[key]) / 100
        }
      } else if (key === 'font_setting') {
        // 字体设置（加粗，斜体，下划线）
        if (format_config[key]) {
          let fontConfigs = configs[i]['configs']
          for (let j = 0; j < fontConfigs.length; j++) {
            if (format_config[key][fontConfigs[j]['name']]) {
              styles[fontConfigs[j]['styleName']] = fontConfigs[j]['value']
            }
          }
        }
      } else if (['font_family', 'text_align'].indexOf(key) !== -1) {
        // 字体设置
        if (format_config[key]) {
          let fontFamilyList = configs[i]['values']
          styles[styleName] = fontFamilyList[format_config[key]]['value']
        }
      } else if (styleName && format_config && format_config[key] !== undefined) {
        // 其他常规样式设置
        styles[styleName] = format_config[key]
      }
    }
  }

  return styles
}
