/**
 * 处理视频点读点格式设置的一些个性化参数设置【只有视频点读点有的】
 */
import './index.less'
import React, { Component } from 'react'
import { Slider, Button } from 'antd'
import { CustomAntdModal } from 'common/js/components'
import Event from 'common/js/event.js'
import { getVideoImage } from 'common/js/utils'

// 获取视频的海报
export const EVENT_VIDEO_GET_POSTER = 'video_get_poster'

Event.on(EVENT_VIDEO_GET_POSTER, param => {
  CustomAntdModal.show({
    title: '设置视频海报',
    footer: null,
    className: 'modal__video-poster',
    render: props => <VideoPoster {...param} {...props} />
  })
})

class VideoPoster extends Component {
  constructor(props) {
    super(props)

    let pointData = props.getPointData()
    this.state = {
      val: pointData.data.posterTime || 0,
      min: 0,
      max: 1,
      step: 1,
      pointData: pointData
    }
  }

  componentDidMount() {
    this.getVideoPoster()
  }

  getVideoPoster = () => {
    const { pointData, val } = this.state
    getVideoImage(pointData.data.src, val, result => {
      this.setState({
        max: parseInt(result.totalTime, 10),
        base64: result.base64
      })
    })
  }

  onChange = val => {
    this.setState({ val })
  }

  handleGetVideoPoster = () => {
    this.getVideoPoster()
  }

  handleSubmit = () => {
    const { setPointData, onOk } = this.props
    const { pointData, val } = this.state
    setPointData({
      data: { ...pointData.data, posterTime: val }
    })
    onOk && onOk()
  }

  render() {
    const { onOk = () => {} } = this.props
    const { min, max, val, step, base64 } = this.state

    let style = {}
    if (base64) {
      style['backgroundImage'] = `url(${base64})`
    }

    return (
      <div className="video-poster">
        <div className="video-poster__img" style={style} />
        <div className="video-poster__control">
          <p>滑动滑块，可获取视频中的某一帧图片当做背景图</p>
          <div className="video-poster__times">
            <span>{min}</span>
            <span>当前时间：{val}s</span>
            <span>视频总时长：{max}s</span>
          </div>
          <Slider
            value={val}
            min={min}
            max={max}
            step={step}
            handleStyle={{
              borderColor: '#01ca97',
              backgroundColor: '#01ca97'
            }}
            onChange={this.onChange}
            onAfterChange={this.handleGetVideoPoster}
          />
        </div>
        <div className="video-poster__btns">
          <Button onClick={onOk} style={{ marginRight: '15px' }}>
            取消
          </Button>
          <Button type="primary" onClick={this.handleSubmit}>
            确定
          </Button>
        </div>
      </div>
    )
  }
}
