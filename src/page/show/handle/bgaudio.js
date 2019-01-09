import { Toast } from 'antd-mobile'
import Event from 'common/js/event.js'
import { EVENT_NAME } from '../common/_const'
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
    Toast.info('找不到背景音乐地址', 2, null, false)
  }
})

Event.on(EVENT_NAME.BGAUDIO_STOP, () => {
  try {
    bgAudioPlayer.pause()
  } catch (error) {}
})
