/**
// 2019年03月12日08:33:43
// dom 元素移动和改变大小

<DragWapper
  resizable
  fixedWh={this.state.fixedWidthHeight}
  whRatio={videoInfo.width / videoInfo.height}
  selector=".video-play-area__wapper .js-drag"
  onDragMove={this.handleSavePosition}
  onResizeMove={this.handleSavePosition}
>
  <div className="js-drag video-play-area">视频弹窗播放区</div>
</DragWapper>
 */

import { Component } from 'react'
import PropTypes from 'prop-types'
import interact from 'interactjs'

const toFixedVal = (val, count = 2) => {
  if (val === -0) val = 0
  return Number(parseFloat(val).toFixed(count))
}

class DragWapper extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.interact = null
  }

  dragMoveListener = event => {
    let target = event.target
    // keep the dragged position in the data-x/data-y attributes
    let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

    // translate the element
    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)

    this.props.onDragMove &&
      this.props.onDragMove({
        x: toFixedVal((event.target.offsetLeft + x) / target.parentNode.clientWidth),
        y: toFixedVal((event.target.offsetTop + y) / target.parentNode.clientHeight),
        width: toFixedVal(event.target.clientWidth / target.parentNode.clientWidth),
        height: toFixedVal(event.target.clientHeight / target.parentNode.clientHeight)
      })
  }

  resizeMoveListener = event => {
    const { whRatio, fixedWh, onResizeMove } = this.props

    let target = event.target
    let x = parseFloat(target.getAttribute('data-x')) || 0
    let y = parseFloat(target.getAttribute('data-y')) || 0

    // update the element's style
    if (fixedWh) {
      target.style.width = event.rect.width + 'px'
      target.style.height = event.rect.width / whRatio + 'px'
    } else {
      target.style.width = event.rect.width + 'px'
      target.style.height = event.rect.height + 'px'
    }

    // translate when resizing from top or left edges
    x += event.deltaRect.left
    y += event.deltaRect.top

    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)

    onResizeMove &&
      onResizeMove({
        x: toFixedVal((event.target.offsetLeft + x) / target.parentNode.clientWidth),
        y: toFixedVal((event.target.offsetTop + y) / target.parentNode.clientHeight),
        width: toFixedVal(event.rect.width / target.parentNode.clientWidth),
        height: toFixedVal(event.rect.height / target.parentNode.clientHeight)
      })
  }

  componentDidMount() {
    const { selector, resizable, draggable } = this.props

    if (!selector) {
      console.warn('unset selector prop')
      return
    }

    // 设置移动
    this.interact = interact(selector)

    if (draggable) {
      this.interact
        .draggable({
          inertia: true,
          restrict: {
            restriction: 'parent',
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
          }
        })
        .on('dragmove', this.dragMoveListener)
    }
    // 设置改变 dom 大小
    if (resizable) {
      this.interact
        .resizable({
          edges: { left: true, right: true, bottom: true, top: true },
          restrictEdges: {
            outer: 'parent',
            endOnly: true
          },
          restrictSize: {
            min: { width: 160, height: 90 }
          },
          inertia: true
        })
        .on('resizemove', this.resizeMoveListener)
    }
  }

  componentWillUnmount() {
    // 移除监听事件，防止多次点击
    const { selector } = this.props
    selector && this.interact.unset()
  }

  render() {
    return this.props.children
  }
}

DragWapper.defaultProps = {
  draggable: true,
  resizable: false,
  whRatio: 1,
  fixedWh: false // 固定宽高比
}

DragWapper.propTypes = {
  fixedWh: PropTypes.bool,
  whRatio: PropTypes.number,
  selector: PropTypes.string.isRequired,
  onResizeMove: PropTypes.func,
  onDragMove: PropTypes.func,
  resizable: PropTypes.bool,
  draggable: PropTypes.bool
}

export default DragWapper
