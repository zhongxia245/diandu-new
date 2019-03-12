// 视频播放区
import './video_play_area.less'
import React, { Component } from 'react'
import { Row, Switch, Col, Button, Modal } from 'antd'
import { getVideoWH } from 'common/js/utils'
import { CustomAntdFooter } from 'common/js/components/custom_antd_modal'
import DragWapper from 'common/js/components/drag_wapper'
import PageItemBg from '../pageitem_bg'

const num2Percent = val => {
  return `${val * 100}%`
}

const setDomDefaultPosition = ({ selector, x, y, width, height }) => {
  let dom = document.querySelector(selector)
  if (dom) {
    dom.style.left = x
    dom.style.top = y
    dom.style.width = width
    dom.style.height = height
  }
}

class VideoPlayArea extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fixedWidthHeight: true,
      videoInfo: {},
      position: props.pointData.data.playArea || {}
    }
  }

  async componentDidMount() {
    const { data = {} } = this.props.pointData || {}

    let videoInfo = await getVideoWH(data.src)
    this.setState({ videoInfo: videoInfo || {} })

    if (data.playArea && data.playArea.width) {
      const { x, y, width, height } = data.playArea
      setDomDefaultPosition({
        selector: '.video-play-area__wapper .js-drag',
        x: num2Percent(x),
        y: num2Percent(y),
        width: num2Percent(width),
        height: num2Percent(height)
      })
    } else {
      setDomDefaultPosition({
        selector: '.video-play-area__wapper .js-drag',
        x: '10%',
        y: '10%',
        width: `${videoInfo.width}px`,
        height: `${videoInfo.height}px`
      })
    }
  }

  hancleChecked = (name, checked) => {
    this.setState({ [name]: checked })
  }

  setPlayAreaData = data => {
    const { setPointData, pointData } = this.props
    pointData['data'] = pointData['data'] || {}
    pointData['data']['playArea'] = data
    setPointData(pointData)
    this.props.onOk && this.props.onOk(data)
  }

  handleSavePosition = position => {
    this.setState({ position })
  }

  handleDelete = () => {
    Modal.confirm({
      title: '提示',
      content: '是否删除播放区？',
      onOk: () => {
        this.setPlayAreaData(null)
      }
    })
  }

  onSubmit = () => {
    this.setPlayAreaData(this.state.position)
  }

  render() {
    const { pointIndex, pageIndex, pointData, form, onCancel } = this.props
    const { videoInfo, fixedWidthHeight } = this.state

    let styles = {
      width: `${pointData.pointSize}px`,
      height: `${pointData.pointSize}px`,
      left: num2Percent(pointData.x),
      top: num2Percent(pointData.y)
    }

    return (
      <div className="video-play-area__wapper">
        <Row gutter={16} type="flex" align="middle">
          <Col span={20}>
            固定宽高比：
            <Switch checked={fixedWidthHeight} onChange={this.hancleChecked.bind(this, 'fixedWidthHeight')} />
            <span>{`（${videoInfo.width}px - ${videoInfo.height}px）`}</span>
          </Col>
          <Col span={4}>
            <Button type="danger" onClick={this.handleDelete}>
              删除播放区
            </Button>
          </Col>
        </Row>
        <Row>
          <PageItemBg pageIndex={pageIndex} form={form}>
            <div className="video-play-area__point" style={styles}>
              {pointIndex + 1}
            </div>
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
          </PageItemBg>
        </Row>
        <CustomAntdFooter onCancel={onCancel} onOk={this.onSubmit} />
      </div>
    )
  }
}

export default VideoPlayArea
