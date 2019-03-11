// 视频播放区
import './video_play_area.less'
import React, { Component } from 'react'
import { Row, Switch, Col } from 'antd'
import { CustomAntdFooter } from 'common/js/components/custom_antd_modal'
import interact from 'interactjs'
import PageItemBg from '../pageitem_bg'

const num2Percent = val => {
  return `${val * 100}%`
}

const toFixedVal = (val, count = 2) => {
  if (val === -0) val = 0
  return Number(parseFloat(val).toFixed(count))
}

const setDomDefaultPosition = ({ selector, x, y, width, height }) => {
  let dom = document.querySelector(selector)
  if (dom) {
    dom.style.left = num2Percent(x)
    dom.style.top = num2Percent(y)
    dom.style.width = num2Percent(width)
    dom.style.height = num2Percent(height)
  }
}

class VideoPlayArea extends Component {
  constructor(props) {
    super(props)
    this.state = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }
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

    this.setState({
      x: toFixedVal((event.target.offsetLeft + x) / target.parentNode.clientWidth),
      y: toFixedVal((event.target.offsetTop + y) / target.parentNode.clientHeight),
      width: toFixedVal(event.target.clientWidth / target.parentNode.clientWidth),
      height: toFixedVal(event.target.clientHeight / target.parentNode.clientHeight)
    })
  }

  resizeMoveListener = event => {
    let target = event.target
    let x = parseFloat(target.getAttribute('data-x')) || 0
    let y = parseFloat(target.getAttribute('data-y')) || 0

    // update the element's style
    target.style.width = event.rect.width + 'px'
    target.style.height = event.rect.height + 'px'

    // translate when resizing from top or left edges
    x += event.deltaRect.left
    y += event.deltaRect.top

    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)

    this.setState({
      x: toFixedVal((event.target.offsetLeft + x) / target.parentNode.clientWidth),
      y: toFixedVal((event.target.offsetTop + y) / target.parentNode.clientHeight),
      width: toFixedVal(event.rect.width / target.parentNode.clientWidth),
      height: toFixedVal(event.rect.height / target.parentNode.clientHeight)
    })
  }

  componentDidMount() {
    const { data = {} } = this.props.pointData || {}

    if (data.playArea) {
      const { x, y, width, height } = data.playArea
      setDomDefaultPosition({
        selector: '.video-play-area__wapper .js-drag',
        x,
        y,
        width,
        height
      })
    }

    // 设置移动
    interact('.video-play-area__wapper .js-drag')
      // 先移除注册事件，否则会重复注册
      .off(['dragmove', 'resizemove'])
      .draggable({
        inertia: true,
        restrict: {
          restriction: 'parent',
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        }
      })
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
      .on('dragmove', this.dragMoveListener)
      .on('resizemove', this.resizeMoveListener)
  }

  onSubmit = () => {
    const { setPointData, pointData } = this.props

    pointData['data'] = pointData['data'] || {}
    pointData['data']['playArea'] = this.state
    setPointData(pointData)

    this.props.onOk && this.props.onOk(this.state)
  }

  render() {
    const { pointIndex, pageIndex, pointData, form, onCancel } = this.props

    let styles = {
      width: num2Percent(pointData.width),
      height: num2Percent(pointData.width),
      left: num2Percent(pointData.x),
      top: num2Percent(pointData.y)
    }

    return (
      <div className="video-play-area__wapper">
        <Row gutter={16}>
          <Col span={6}>
            开启播放区：
            <Switch defaultChecked />
          </Col>
          <Col span={6}>
            固定宽高比：
            <Switch defaultChecked />
          </Col>
        </Row>
        <Row>
          <PageItemBg pageIndex={pageIndex} form={form}>
            <div className="video-play-area__point" style={styles}>
              {pointIndex}
            </div>
            <div className="js-drag video-play-area">视频弹窗播放区</div>
          </PageItemBg>
        </Row>
        <CustomAntdFooter onCancel={onCancel} onOk={this.onSubmit} />
      </div>
    )
  }
}

export default VideoPlayArea
