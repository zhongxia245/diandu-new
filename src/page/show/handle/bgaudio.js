import { message } from 'antd'
import Event from 'common/js/event.js'
import { EVENT_NAME } from '../handle/const'
import { setAudioSrc } from './util'

const bgAudioPlayer = new Audio()
let isSetBgAudioSrc = false

Event.on(EVENT_NAME.BGAUDIO_PLAY, (data = {}) => {
  let src = data.src || ''
  if (src || isSetBgAudioSrc) {
    Event.emit(EVENT_NAME.AUDIO_STOP)
    if (!isSetBgAudioSrc) {
      setAudioSrc(bgAudioPlayer, src)
    }
    isSetBgAudioSrc = true
    try {
      bgAudioPlayer.play()
    } catch (error) {
      console.log('播放背景音乐异常', error)
    }
  } else {
    message.error('找不到背景音乐地址')
  }
})

Event.on(EVENT_NAME.BGAUDIO_STOP, () => {
  try {
    bgAudioPlayer.pause()
  } catch (error) {}
})
