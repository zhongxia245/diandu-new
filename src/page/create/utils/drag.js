/**
 * 拖动
 * @param selector 需要拖动的选择器
 * @param callback 移动的回调
 */
import { throttle } from 'lodash'
export default options => {
  // 获取屏幕寛高，防止点读位移除背景图
  let params = {
    left: 0,
    top: 0,
    currentX: 0,
    currentY: 0,
    flag: false
  }

  $(document).on('mousedown', options.selector, function(e) {
    // 如果加上这个样式名，则标识不移动
    if ($(e.target).hasClass(options.notMoveClassName || 'not-drag')) return

    e.preventDefault()
    e.stopPropagation()
    let $tar = $(e.target)

    params.flag = true
    params.currentX = e.clientX
    params.currentY = e.clientY
    params.left = parseInt($tar.css('left'), 10)
    params.top = parseInt($tar.css('top'), 10)
    options.beforeMove && options.beforeMove()

    $(document).on('mousemove', function(e1) {
      e1.preventDefault()
      e1.stopPropagation()

      if (params.flag) {
        let disX = e1.clientX - params.currentX
        let disY = e1.clientY - params.currentY
        let x = params.left + disX
        let y = params.top + disY
        throttle(options.callback({ x: x, y: y, disX: disX, disY: disY, index: $tar.data().index, e: e }), 100)
      }
    })

    $(document).on('mouseup', function(e2) {
      e2.preventDefault()
      e2.stopPropagation()
      $(document).off('mousemove')
      $(document).off('mouseup')
      $tar.removeClass('u-mouse-move')
      options.moveEnd && options.moveEnd()
    })
  })
}
