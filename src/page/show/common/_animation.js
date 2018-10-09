import { previewAnimation } from '@/page/create/utils/_index'

/**
 * 运行动画
 */
const runAnimation = (pageData, pageIndex) => {
  let pointsData = pageData['points'] || []
  for (let i = 0; i < pointsData.length; i++) {
    let id = `#${pageIndex}_${i}`
    if (pointsData[i]['animations']) {
      setTimeout(() => {
        previewAnimation(id, pointsData[i]['animations'])
      }, 250)
    }
  }
}

/**
 * 点读点闪烁
 * 进入点读页和切换点读页会闪烁
 * @param {*} pageIndex 点读页下标
 * @param {*} pointIndex 点读点下标 默认为空，则标识，整页点读点都闪烁
 */
const runBlink = (pageIndex, pointIndex) => {
  let duration = 200 // ms
  let size = 5 // 默认大小为10
  let maxSize = 15 // 闪烁圆的最大半径
  let minSize = 5 // 最小半径
  let shadowColor = 'red' // 闪烁背景的颜色
  let gap = 5 // 每次变动大小
  let flag = true // true: 大小自增  false:大小减小
  let showTime = 1500 // 闪烁时间  ms
  let tempTime = 0
  let $point = $(`.pageitem-${pageIndex} .point`) // 所有的点读点

  let timer = setInterval(function() {
    if (tempTime >= showTime) {
      // 清除定时器和清除效果
      clearTimeout(timer)
      tempTime = 0
      $point.css({ '-webkit-filter': '', filter: '' })
    } else {
      // 记录闪烁时间
      tempTime += duration

      // 闪烁到最大则变小,到最小则变大
      if (size >= maxSize) {
        flag = false
      }
      if (size <= minSize) {
        flag = true
      }
      if (flag) {
        size += gap
      } else {
        size -= gap
      }
      let css = 'drop-shadow(' + shadowColor + ' 0px 0px ' + size + 'px)'
      let style = { '-webkit-filter': css, filter: css }
      $point.css(style)
    }
  }, duration)
}

export { runAnimation, runBlink }
