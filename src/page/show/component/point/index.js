import './index.less'
import React, { Component } from 'react'
import classnames from 'classnames'
import { message, Modal } from 'antd'
import Event from 'common/js/event.js'
import { EVENT_NAME } from '../../handle/const'
import { IconFont } from 'common/js/components'
import { getVideoImage } from 'common/js/utils'
import { isMobile } from 'common/js/utils/user_agent.js'
import { getFormatConfigStyle, PAGE_CONTENT_TYPE } from '@/config'
import queryString from 'common/js/utils/query_string'
import CustomShapePoint from '../custom_shape'
import PlayAreaVideo from './playarea_video'

const DEFAULT_POINT_SIZE = 50

// 高阶组件，给点读点添加通用的参数
const HocPoint = (comp, props) => {
  return React.cloneElement(comp, props)
}

class Point extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoadedPoster: false,
      videoPoster: '',
      showVideo: false,
      showVideoPlayArea: false
    }
  }

  componentDidMount() {
    // 音频点读点， 加载音频状态，播放状态，暂停状态的标识
    const { pageIndex, pointIndex } = this.props
    const POINT_ID = `${pageIndex}_${pointIndex}`

    Event.on(EVENT_NAME.AUDIO_LOADING + POINT_ID, () => {
      this.setState({
        status: 'loading'
      })
    })
    Event.on(EVENT_NAME.AUDIO_PLAY + POINT_ID, () => {
      this.setState({
        status: 'play'
      })
    })
    Event.on(EVENT_NAME.AUDIO_STOP + POINT_ID, () => {
      this.setState({
        status: 'stop'
      })
    })
  }

  componentWillUnmount() {
    const { pageIndex, pointIndex } = this.props
    const POINT_ID = `${pageIndex}_${pointIndex}`
    Event.off(EVENT_NAME.AUDIO_LOADING + POINT_ID)
    Event.off(EVENT_NAME.AUDIO_PLAY + POINT_ID)
    Event.off(EVENT_NAME.AUDIO_STOP + POINT_ID)
  }

  getPointPosition = () => {
    const { data, form } = this.props
    // 自定义区域，则不需要缩放，因为存放的大小是百分比的大小，不是固定的数值

    let formatStyle = getFormatConfigStyle(data, form)

    return {
      ...formatStyle,
      left: `${data.x * 100}%`,
      top: `${data.y * 100}%`
    }
  }
  /**
   * 点击点读点触发的操作
   * video 视频：播放视频
   * audio 音频：播放音频
   * note  注解：弹窗显示注解
   *
   * audio： 如果有多个音频，需要做播放另外一个，则暂停之前的那个。
   */
  handleClickPoint = (pointData, index) => {
    const { pageIndex, form } = this.props
    const pointId = `${pageIndex}_${index}`
    const src = pointData.data && pointData.data.src
    switch (pointData.type) {
      case 'audio':
        Event.emit(EVENT_NAME.AUDIO_PLAY, {
          src: src,
          id: pointId,
          form: form
        })
        break
      case 'video':
        // 使用播放区
        if (pointData.data && pointData.data.playArea && pointData.data.triggerType !== 'area') {
          this.setState({ showVideoPlayArea: !this.state.showVideoPlayArea })
        } else {
          Event.emit(EVENT_NAME.VIDEO_PLAY, {
            id: pointId,
            form: form,
            src: src
          })
        }
        break
      case 'note':
        Event.emit(EVENT_NAME.MODAL_NOTE_SHOW, pointData)
        break
      case 'tabs_note':
        Event.emit(EVENT_NAME.MODAL_TABSNOTE_SHOW, pointData)
        break
      case 'link':
        if (pointData.data && pointData.data.link) {
          Modal.confirm({
            centered: true,
            title: '跳转提示',
            content: '是否打开到该超链接点读点设置的页面?',
            okText: '打开',
            cancelText: '取消',
            onOk: () => {
              if (isMobile()) {
                let dianduId = queryString('id')
                localStorage.setItem('diandu:current_page_index', `${dianduId}_${pageIndex}`)
                window.location.href = pointData.data.link
              } else {
                window.open(pointData.data.link)
              }
            }
          })
        } else {
          message.info('该超链接点读点没有设置URL')
        }
        break
      case 'test':
        if (pointData.data && pointData.data.questions) {
          Event.emit(EVENT_NAME.MODAL_TEST_SHOW, pointData)
        } else {
          message.info('该测试点读点没有题目数据')
        }
        break
      default:
        message.info(pointData.type)
    }
  }

  toggleVideoPlayArea = () => {
    this.setState({ showVideoPlayArea: !this.state.showVideoPlayArea })
  }

  renderAudioStatusEffect() {
    return [
      this.state.status === 'loading' ? <IconFont className="point__icon u-loading" type="loading" /> : '',
      this.state.status === 'play' ? <IconFont className="point__icon" type="pause" /> : ''
    ]
  }

  // 自定义区域
  renderCustomAreaVideo() {
    const { data, pointIndex } = this.props
    let pointData = data.data || {}
    let posterTime = pointData.posterTime || 0

    let hasPoster = data.data.src

    const handlePlayPcVideo = index => {
      let domVideo = this[`ref_video_${index}`]
      if (domVideo) {
        if (domVideo.paused) {
          Event.emit(EVENT_NAME.BGAUDIO_STOP)
          domVideo.play()
        } else {
          domVideo.pause()
          this.setState({ showVideo: false })
        }
      }
    }

    if (!this.state.isLoadedPoster && data.data.src) {
      getVideoImage(data.data.src, posterTime, imgData => {
        this.setState({ videoPoster: imgData.base64, isLoadedPoster: true })
      })
    }

    // 自定义区域，则不需要缩放，因为存放的大小是百分比的大小，不是固定的数值
    let style = {
      width: `${data.width * 100}%`,
      height: `${data.height * 100}%`,
      ...this.getPointPosition()
    }

    if (hasPoster && this.state.videoPoster) {
      // 有视频海报，则展示，否则去获取视频的第一帧当做海报
      style.display = 'block'
      style.backgroundSize = 'contain'
      style.backgroundColor = '#000'
      style.backgroundImage = `url(${this.state.videoPoster})`
    } else {
      style.display = 'none'
    }

    return (
      <div
        className={classnames(
          'point point__custom-area--video',
          `point__custom-area--${pointData.areaType}`,
          `point--${data.type}`
        )}
        style={style}
        onClick={
          isMobile()
            ? this.handleClickPoint.bind(this, data, pointIndex)
            : e => {
                e.stopPropagation()
                e.preventDefault()
                this.setState({ showVideo: true }, () => {
                  handlePlayPcVideo(pointIndex)
                })
              }
        }
      >
        {!isMobile() && (
          <React.Fragment>
            <IconFont
              type="play1"
              className="icon__video-play"
              style={{ display: this.state.showVideo ? 'none' : 'block' }}
            />
            <video
              ref={dom => {
                this[`ref_video_${pointIndex}`] = dom
              }}
              src={data.data.src}
              controls
              style={{ display: this.state.showVideo ? 'block' : 'none' }}
            />
          </React.Fragment>
        )}
        {this.renderAudioStatusEffect()}
      </div>
    )
  }

  // 自定义区域
  renderCustomArea() {
    const { data, pointIndex } = this.props
    let pointData = data.data || {}

    // 自定义区域，则不需要缩放，因为存放的大小是百分比的大小，不是固定的数值
    let style = {
      width: `${data.width * 100}%`,
      height: `${data.height * 100}%`,
      ...this.getPointPosition()
    }
    return (
      <div
        className={classnames('point', `point__custom-area--${pointData.areaType}`)}
        style={style}
        onClick={this.handleClickPoint.bind(this, data, pointIndex)}
      >
        {this.renderAudioStatusEffect()}
      </div>
    )
  }

  // 图形
  renderCustomShape() {
    return <CustomShapePoint {...this.props}>{this.renderAudioStatusEffect()}</CustomShapePoint>
  }

  // 页面文字绘制
  renderCustomInput() {
    const { data } = this.props

    // 自定义区域，则不需要缩放，因为存放的大小是百分比的大小，不是固定的数值
    let style = {
      width: `${data.width * 100}%`,
      height: `${data.height * 100}%`,
      ...this.getPointPosition()
    }

    if (data.format_config) {
      style = {
        ...style,
        color: data.format_config['color'],
        backgroundColor: data.format_config['background_color'],
        fontSize: `${data.format_config['fontsize'] || 14}px`
      }
    }

    return (
      <div
        className={classnames('point', `point--${data.type}`)}
        style={style}
        dangerouslySetInnerHTML={{ __html: data.text }}
        // onClick={this.handleClickPoint.bind(this, data, pointIndex)}
      />
    )
  }

  // 自定义图片点读点
  renderCustomImg() {
    const { data, pointIndex } = this.props
    let pointData = data.data || {}

    let style = {
      width: data.pointSize || DEFAULT_POINT_SIZE,
      ...this.getPointPosition(),
      height: 'auto'
    }
    return (
      <img
        src={pointData.customPath}
        className={classnames('point', 'point__custom-img')}
        style={style}
        onClick={this.handleClickPoint.bind(this, data, pointIndex)}
      />
    )
  }

  // 自定义文字点读点
  renderCustomText() {
    const { data, pointIndex } = this.props
    let pointData = data.data || {}

    let style = {
      width: data.pointSize || DEFAULT_POINT_SIZE,
      height: data.pointSize || DEFAULT_POINT_SIZE,
      ...this.getPointPosition()
    }

    return (
      <div
        className={`point point__custom-text point--${data.type}`}
        style={style}
        onClick={this.handleClickPoint.bind(this, data, pointIndex)}
      >
        {this.renderAudioStatusEffect()}
        <p>{pointData.customTitle}</p>
      </div>
    )
  }

  // 普通点读点
  renderNormal() {
    const { data, pointIndex } = this.props
    let style = {
      width: data.pointSize || DEFAULT_POINT_SIZE,
      height: data.pointSize || DEFAULT_POINT_SIZE,
      ...this.getPointPosition()
    }

    return (
      <div
        className={`point point--${data.type}`}
        style={style}
        onClick={this.handleClickPoint.bind(this, data, pointIndex)}
      >
        {this.renderAudioStatusEffect()}
      </div>
    )
  }

  render() {
    const { data, pageIndex, pointIndex } = this.props
    const pointData = data.data || {}
    let jsx = this.renderNormal()

    if (pointData.triggerType) {
      // 使用自定义触发区域
      if (pointData.triggerType === 'area') {
        if (data.type === 'video') {
          jsx = this.renderCustomAreaVideo()
        } else {
          jsx = this.renderCustomArea()
        }
      } else if (pointData.triggerType === 'point') {
        // 点模式
        if (pointData.customPath) {
          // 自定义图片
          jsx = this.renderCustomImg()
        } else if (pointData.customTitle) {
          // 自定义文字
          jsx = this.renderCustomText()
        }
      }
    } else if (data.type === PAGE_CONTENT_TYPE['input']['name']) {
      jsx = this.renderCustomInput()
    } else if (data.type === PAGE_CONTENT_TYPE['shape']['name']) {
      jsx = this.renderCustomShape()
    }

    // 音频播放区，则多加一个播放区到页面上
    if (data.type === 'video' && pointData.playArea && pointData.playArea.width) {
      return [
        HocPoint(jsx, { id: `${pageIndex}_${pointIndex}` }),
        this.state.showVideoPlayArea && <PlayAreaVideo data={pointData} onClose={this.toggleVideoPlayArea} />
      ]
    }

    return HocPoint(jsx, { id: `${pageIndex}_${pointIndex}` })
  }
}

export default Point
