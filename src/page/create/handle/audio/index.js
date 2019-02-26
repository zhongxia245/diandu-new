import Event from 'common/js/event.js'

// 把当前格式化配置应用到所有的区域音频
export const EVENT_AUDIO_APPLY_ALL_PAGE = 'EVENT_AUDIO_APPLY_ALL_PAGE'
// 把当前格式设置应用到当前页面的所有区域音频
export const EVENT_AUDIO_APPLY_CURRENT_PAGE = 'EVENT_AUDIO_APPLY_CURRENT_PAGE'

// 设置指定点读页的所有区域音频
const setAreaAudioPointByPageIndex = (form, formatConfig, pageIndex) => {
  const { setFieldsValue, getFieldValue } = form

  let pages = getFieldValue('pages') || []
  let pageData = pages[pageIndex]
  let points = pageData['points'] || []

  for (let i = 0; i < points.length; i++) {
    let point = points[i]
    if (point['type'] === 'audio' && point['data']['triggerType'] === 'area') {
      point['format_config'] = formatConfig
    }
  }

  setFieldsValue({ pages: pages })
}

// 设置当前区域音频格式设置到其他点读点
const setAreaAudioPoint = (form, formatConfig, pageIndex) => {
  const { getFieldValue } = form
  let pages = getFieldValue('pages') || []

  if (pageIndex) {
    setAreaAudioPointByPageIndex(form, formatConfig, pageIndex)
  } else {
    pages.map((page, index) => {
      setAreaAudioPointByPageIndex(form, formatConfig, index)
    })
  }
}

Event.on(EVENT_AUDIO_APPLY_ALL_PAGE, ({ getPointData, form }) => {
  const formatConfig = getPointData()['format_config']
  setAreaAudioPoint(form, formatConfig)
})

Event.on(EVENT_AUDIO_APPLY_CURRENT_PAGE, ({ getPointData, form, pageIndex }) => {
  const formatConfig = getPointData()['format_config']
  setAreaAudioPoint(form, formatConfig, pageIndex)
})
