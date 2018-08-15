/**
 * 绘制区域的方法
 */

import './_index.less'

const DEFAULT_CONFIG = {
  disabled: false,
  useLine: true,
  drawAfterRemove: true, //绘制完成后，移除DOM节点，使用React来自动渲染
  type: 'rect'
}

/**
 * 添加辅助线
 */
const _initLine = dom => {
  if (!document.getElementById('__xline__')) {
    let xLine = document.createElement('div')
    xLine.setAttribute('id', '__xline__')
    xLine.classList.add('u-x-line')
    dom.appendChild(xLine)
  }
  if (!document.getElementById('__yline__')) {
    let yLine = document.createElement('div')
    yLine.setAttribute('id', '__yline__')
    yLine.classList.add('u-y-line')
    dom.appendChild(yLine)
  }
}

/**
 * 对齐线计算坐标
 */
const _calNearArea = (oCanvas, x, y) => {
  let size = 10
  let $areas = oCanvas.querySelectorAll('[data-type="drawcustomarea"]')
  for (let i = 0; i < $areas.length; i++) {
    let ele = $areas[i]
    let otherX = parseInt(ele.style.left, 10)
    let otherY = parseInt(ele.style.top, 10)
    let otherW = parseInt(ele.style.width, 10)
    let otherH = parseInt(ele.style.height, 10)

    if (Math.abs(x - otherX) < size) {
      x = otherX
    }
    if (Math.abs(x - otherX - otherW) < size) {
      x = otherX + otherW
    }
    if (Math.abs(y - otherY) < size) {
      y = otherY
    }
    if (Math.abs(y - otherY - otherH) < size) {
      y = otherY + otherH
    }
  }
  return {
    x: x,
    y: y
  }
}

/**
 * 移动辅助线,并且有边线对其功能
 */
const _moveLine = (oCanvas, x, y) => {
  let xLine = document.getElementById('__xline__')
  let yLine = document.getElementById('__yline__')
  let newLocation = _calNearArea(oCanvas, x, y)
  xLine.style.top = newLocation.y + 'px'
  yLine.style.left = newLocation.x + 'px'
  return {
    x: newLocation.x,
    y: newLocation.y
  }
}

/**
 * 移除辅助线
 */
const _re_moveLine = () => {
  let xLine = document.getElementById('__xline__')
  let yLine = document.getElementById('__yline__')
  if (xLine.parentNode && yLine.parentNode) {
    xLine.parentNode.removeChild(xLine)
    yLine.parentNode.removeChild(yLine)
  }
}
/**
 * 自定义绘制图形
 * roud 圆角矩形
 * rect 矩形
 * circle  圆
 * oval 椭圆
 * square 正方形【目前没用上】
 */
export function DrawCustomArea(config) {
  config = { ...DEFAULT_CONFIG, ...config }

  let oR
  let oCanvas = document.getElementById(config.id)
  let pWidth = oCanvas.clientWidth
  let pHeight = oCanvas.clientHeight

  oCanvas.onmousedown = ev => {
    let oEv = ev || window.event

    oCanvas.style.cursor = 'se-resize'

    // 是否允许绘制,默认为true
    if (!config.disabled) {
      // 绘制之前的回调
      if (config.beforeDraw) {
        config.beforeDraw()
      }

      if (oCanvas.setCapture) {
        oCanvas.setCapture()
      }

      /**
       * 因为clientX 获取的是鼠标在距离窗口的位置，因此页面上滑的时候，初始化有问题
       * offsetX 因为在 鼠标移动的时候，有时候不准，会变到0，因此得 clientX 和 offsetX 结合
       */
      let disX = oEv.offsetX
      let disY = oEv.offsetY
      let tempOffsetX = disX - oEv.clientX
      let tempOffsetY = disY - oEv.clientY

      oR = document.createElement('div')
      oR.id = config.pointId
      oR.className = 'draw-area-container ' + config.class
      oR.setAttribute('data-type', 'drawcustomarea')
      oR.style.top = `${disY}px`
      oR.style.left = `${disX}px`
      oCanvas.appendChild(oR)

      document.onmousemove = ev => {
        ev.stopPropagation()
        ev.preventDefault()

        let x = ev.clientX + tempOffsetX
        let y = ev.clientY + tempOffsetY

        /**
         * 限制绘制的区域限制
         */
        // if (x < oCanvas.offsetLeft) {
        //   x = oCanvas.offsetLeft
        // }
        // else if (x > oCanvas.offsetLeft + oCanvas.offsetWidth) {
        //   x = oCanvas.offsetLeft + oCanvas.offsetWidth
        // }
        // if (y < oCanvas.offsetTop) {
        //   y = oCanvas.offsetTop
        // }
        // else if (y > oCanvas.offsetTop + oCanvas.offsetHeight) {
        //   y = oCanvas.offsetTop + oCanvas.offsetHeight
        // }

        let width = Math.abs(x - disX)
        let height = 0
        let left = Math.min(disX, x)
        let top = Math.min(disY, y)

        switch (config.type) {
          // 圆角矩形
          case 'roud':
            height = Math.abs(y - disY)
            break
          // 圆形
          case 'circle':
            height = Math.min(Math.abs(x - disX), Math.abs(y - disY))
            width = Math.min(Math.abs(x - disX), Math.abs(y - disY))
            oR.style.borderRadius = '50%'
            break
          // 椭圆形
          case 'oval':
            height = Math.abs(y - disY)
            oR.style.borderRadius = '50%'
            break
          // 矩形
          case 'rect':
            height = Math.abs(y - disY)
            break
          // 正方形
          case 'square':
            height = Math.min(Math.abs(x - disX), Math.abs(y - disY))
            width = Math.min(Math.abs(x - disX), Math.abs(y - disY))
        }

        if (!config.drawAfterRemove) {
          oR.style.width = `${width}px`
          oR.style.top = `${top}px`
          oR.style.left = `${left}px`
          oR.style.height = `${height}px`
          oR.classList.add(`draw-custom-area__${config.type}`)
          if (config.useLine) {
            _initLine(oCanvas)
            let newLocation = _moveLine(oCanvas, x, y)
            x = newLocation.x
            y = newLocation.y
          }
        } else {
          if (config.callback) {
            config.callback({
              left: left,
              top: top,
              width: width,
              height: height,
              pWidth: pWidth,
              pHeight: pHeight
            })
          }
        }

        document.onmouseup = () => {
          oCanvas.onmousedown = null
          document.onmousemove = null
          document.onmouseup = null
          oCanvas.style.cursor = ''
          oR.style.cursor = 'move'

          if (!config.drawAfterRemove) {
            if (config.useLine) {
              _re_moveLine()
            }
          } else {
            oR.parentNode.removeChild(oR)
          }

          if (oCanvas.releaseCapture) {
            oCanvas.releaseCapture()
          }

          if (config.callback) {
            config.callback({
              left: left,
              top: top,
              width: width,
              height: height,
              pWidth: pWidth,
              pHeight: pHeight
            })
          }

          if (config.drawEndCallback) {
            config.drawEndCallback &&
              config.drawEndCallback({
                left: left,
                top: top,
                width: width,
                height: height,
                pWidth: pWidth,
                pHeight: pHeight
              })
          }
        }
      }
    }
  }
}
