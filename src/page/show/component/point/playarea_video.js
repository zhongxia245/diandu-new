// 播放区，只有在PC ，非自定义区域模式下有用

import React, { Component } from 'react'
import { Icon } from 'antd'

const styles = {
  playarea: { position: 'absolute', zIndex: 999, background: '#000' },
  video: { width: '100%', height: '100%' },
  icon: {
    fontSize: '30PX',
    color: '#ff7c80',
    width: '40PX',
    height: '40PX',
    position: 'absolute',
    top: '-10PX',
    right: '-45PX',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2PX solid #ddd',
    background: '#FFF',
    borderRadius: '50%'
  }
}

const num2Percent = val => {
  return `${val * 100}%`
}

class PlayAreaVideo extends Component {
  render() {
    const { data, onClose = () => {} } = this.props
    const { playArea, src } = data

    let style = styles.playarea
    if (playArea) {
      style = {
        ...style,
        left: num2Percent(playArea['x']),
        top: num2Percent(playArea['y']),
        width: num2Percent(playArea['width']),
        height: num2Percent(playArea['height'])
      }
    }

    return (
      <div className="playarea-video" style={style}>
        <Icon type="close" style={styles.icon} onClick={onClose} />
        <video style={styles['video']} src={src} controls controlsList="nodownload" />
      </div>
    )
  }
}

export default PlayAreaVideo
