/**
 * 处理视频点读点格式设置的一些个性化参数设置【只有视频点读点有的】
 */
import './_video.less'
import React, { Component } from 'react'
import { Slider } from 'antd-mobile'
import CustomModal from 'common/js/components/_custom_modal.js'
import Event from 'common/js/event.js'
import { getVideoImage } from 'common/js/utils'

// 获取视频的海报
export const EVENT_VIDEO_GET_POSTER = 'video_get_poster'

Event.on(EVENT_VIDEO_GET_POSTER, param => {
  CustomModal.show({
    className: 'modal__video-poster',
    maskClosable: false,
    closable: false,
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

  handleGetVideoPoster = val => {
    this.getVideoPoster()
  }

  handleSubmit = () => {
    const { setPointData, onClose } = this.props
    const { pointData, val } = this.state
    setPointData({
      data: { ...pointData.data, posterTime: val }
    })
    onClose && onClose()
  }

  render() {
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
          <div className="u-btn" onClick={this.props.onClose}>
            取消
          </div>
          <div className="u-btn u-btn--green" onClick={this.handleSubmit}>
            确定
          </div>
        </div>
      </div>
    )
  }
}
