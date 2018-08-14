import './_header.less'
import React, { Component } from 'react'
import classnames from 'classnames'
import { IconFont } from 'common/js/components'
import Event from 'common/js/event.js'
import { EVENT_NAME } from '../../common/_const'
export default class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    Event.on(EVENT_NAME.BGAUDIO_PLAY, () => {
      this.setState({ bgAudioPlay: true })
    })
    Event.on(EVENT_NAME.BGAUDIO_STOP, () => {
      this.setState({ bgAudioPlay: false })
    })
  }

  handleStopBgAudio = () => {
    if (this.state.bgAudioPlay) {
      Event.emit(EVENT_NAME.BGAUDIO_STOP)
    } else {
      Event.emit(EVENT_NAME.BGAUDIO_PLAY)
    }
  }

  render() {
    const { bgAudioSrc } = this.props
    return (
      <div className="page__header">
        <IconFont type="menu2" />
        <div className="page-header__gap" />
        {bgAudioSrc ? (
          <IconFont
            type="music"
            className={classnames('icon__music', { 'icon__music--play': this.state.bgAudioPlay })}
            onClick={this.handleStopBgAudio}
          />
        ) : (
          ''
        )}
      </div>
    )
  }
}
