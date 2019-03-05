import './index.less'
import React, { Component } from 'react'
import classnames from 'classnames'
import { IconFont } from 'common/js/components'
import Event from 'common/js/event.js'
import { EVENT_NAME } from '../../handle/const'
import { Icon, Drawer, Empty } from 'antd'

const ICON_STYLE = { fontSize: '20px' }
export default class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bgAudioPlay: false,
      globalAudioPlay: false,
      globalAudioLoading: false,
      drawerVisible: false
    }

    this.globalAudio = null
  }

  componentDidMount() {
    // background audio
    Event.on(EVENT_NAME.BGAUDIO_PLAY, () => {
      this.setState({ bgAudioPlay: true })
    })
    Event.on(EVENT_NAME.BGAUDIO_STOP, () => {
      this.setState({ bgAudioPlay: false })
    })

    // global audio
    Event.on(EVENT_NAME.GLOBAL_AUDIO_LOADING, flag => {
      this.setState({ globalAudioLoading: flag })
    })
    Event.on(EVENT_NAME.GLOBAL_AUDIO_PLAY, () => {
      this.setState({ globalAudioPlay: true, globalAudioLoading: true })
    })
    Event.on(EVENT_NAME.GLOBAL_AUDIO_STOP, () => {
      this.setState({ globalAudioPlay: false, globalAudioLoading: false })
    })
  }

  action = {
    showDrawer: () => {
      this.setState({ drawerVisible: true })
    },
    toggleBgAudio: () => {
      if (this.state.bgAudioPlay) {
        Event.emit(EVENT_NAME.BGAUDIO_STOP)
      } else {
        Event.emit(EVENT_NAME.BGAUDIO_PLAY)
      }
    },
    toggleGlobalAudio: () => {
      const { globalAudioData } = this.props
      if (this.state.globalAudioPlay) {
        Event.emit(EVENT_NAME.GLOBAL_AUDIO_STOP, globalAudioData)
      } else {
        Event.emit(EVENT_NAME.GLOBAL_AUDIO_PLAY, globalAudioData)
      }
    }
  }

  render() {
    const { bgAudioSrc, globalAudioData } = this.props
    const { globalAudioPlay, drawerVisible, bgAudioPlay, globalAudioLoading } = this.state

    return (
      <div className="page__header">
        <Icon type="bars" style={ICON_STYLE} onClick={this.action.showDrawer} />

        <div style={{ flex: 1, textAlign: 'center' }}>
          {globalAudioData && (
            <Icon
              type={globalAudioLoading ? 'loading' : globalAudioPlay ? 'pause-circle' : 'play-circle'}
              style={ICON_STYLE}
              spin={globalAudioPlay || globalAudioLoading}
              onClick={this.action.toggleGlobalAudio}
            />
          )}
        </div>

        {bgAudioSrc && (
          <IconFont
            type="music"
            className={classnames('icon__music', { 'icon__music--play': bgAudioPlay })}
            onClick={this.action.toggleBgAudio}
          />
        )}

        <Drawer
          title="点读页列表"
          placement="left"
          closable={false}
          onClose={() => {
            this.setState({ drawerVisible: false })
          }}
          visible={drawerVisible}
        >
          <Empty />
        </Drawer>
      </div>
    )
  }
}
