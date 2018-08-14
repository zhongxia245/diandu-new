import { previewAnimation } from '@h5/page/create/utils/_index'

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

export { runAnimation }
