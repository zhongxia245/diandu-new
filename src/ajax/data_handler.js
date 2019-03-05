import { forEach, isEmpty } from 'lodash'

// 移除已经删除的全程音频配置
const removeDeletedGlobalAudio = data => {
  let globalAudio = (data.globalSetting && data.globalSetting.globalAudio) || {}
  // 没有全程音频则直接返回
  if (isEmpty(globalAudio)) {
    return data
  }

  let pages = data.pages || []
  let result = []

  for (let i = 0; i < pages.length; i++) {
    for (let j = 0; j < pages[i]['points'].length; j++) {
      const point = pages[i]['points'][j]
      if (point.isGlobalAudio) {
        result.push(`${i}_${j}`)
      }
    }
  }

  for (const key in globalAudio) {
    if (globalAudio.hasOwnProperty(key)) {
      if (result.indexOf(key) === -1) {
        delete globalAudio[key]
      }
    }
  }

  data.globalSetting.globalAudio = globalAudio

  return data
}

// 移除已经删除的点读点
const removePointData = (pageData = {}) => {
  let points = pageData.points || []
  return points.filter(point => {
    return point.isRemove !== true
  })
}

// 移除已经删除的点读页
const removePageData = data => {
  let pages = data.pages || []
  let newPages = pages.filter(page => {
    page.points = removePointData(page)
    return page.baseInfo && page.isRemove !== true
  })
  data.pages = newPages
  return data
}

// 保存的时候，把一些字段放到接口相对应字段去
export const saveHandler = (id, data) => {
  data = removePageData(data)
  data = removeDeletedGlobalAudio(data)
  data.covers = data.covers || []
  data.cost = Number(data.cost)
  let param = {
    title: data.title,
    saytext: data.intro,
    charge: data.charge,
    isprivate: data.competence,
    keywords: data.keywords,
    cost: data.cost || 0,
    pic: data.covers.join(','),
    data: JSON.stringify(data)
  }
  // 带上id，则为编辑
  if (id) {
    param.id = id
  }

  // 编辑点读的版本,当前这个版本为1
  // 在点读列表和展示页面会用到
  param.version = 1

  return param
}

// 请求的时候，去掉一些没有用的字段
export const getHandler = data => {
  try {
    let compData = JSON.parse(data.data)
    let pagesData = compData['pages'] || []
    forEach(pagesData, (item, index) => {
      item['sort'] = index
    })
    return compData
  } catch (e) {
    return null
  }
}
