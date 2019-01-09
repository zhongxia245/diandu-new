import React, { Component } from 'react'
import classnames from 'classnames'
import { getVideoImage } from 'common/js/utils'
import ResizeControl from '../../resize/_resize'
class CustomAreaVideo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      videoPoster: ''
    }
  }

  componentDidMount() {
    this.getVideoImageByTime(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.data.data &&
      this.props.data.data &&
      nextProps.data.data.posterTime !== this.props.data.data.posterTime
    ) {
      this.getVideoImageByTime(nextProps)
    }
  }

  getVideoImageByTime = ({ data }) => {
    if (data.data && data.data.src) {
      // 已经上传视频文件
      getVideoImage(data.data.src, data.data.posterTime || 0, imgData => {
        this.setState({ videoPoster: imgData.base64 })
      })
    }
  }

  render() {
    const {
      data,
      pageIndex,
      pointIndex,
      className,
      style,
      other,
      active,
      getPageItemBgAutoWH,
      ...otherProps
    } = this.props

    let autoWH = getPageItemBgAutoWH(other.baseInfo)
    let pointStyle = {
      ...style,
      left: data.x * autoWH.width,
      top: data.y * autoWH.height,
      width: data.width * autoWH.width,
      height: data.height * autoWH.height
    }

    let pointData = data.data || {}

    // 有视频海报，则展示，否则去获取视频的第一帧当做海报
    if (this.state.videoPoster) {
      pointStyle.backgroundImage = `url(${this.state.videoPoster})`
    }

    return (
      <div
        {...otherProps}
        key={pointIndex}
        style={pointStyle}
        className={classnames(
          'point',
          `point__${pageIndex}_${pointIndex}`,
          'point__custom-area',
          `point__custom-area--${pointData.areaType}`,
          'point__custom-area--video',
          className,
          {
            'point--active': active
          }
        )}
        data-index={pointIndex}
      >
        {pointIndex + 1}
        {active ? <ResizeControl {...this.props} /> : ''}
      </div>
    )
  }
}

export default CustomAreaVideo
