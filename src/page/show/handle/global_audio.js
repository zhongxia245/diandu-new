import { message } from 'antd'
import Event from 'common/js/event.js'
import { EVENT_NAME } from '../handle/const'
import { setAudioSrc } from './util'

const globalAudioPlayer = new Audio()
let isSetGlobalAudioSrc = false
let timer = null
let isLoaded = false

const changeSwiperPageByTime = (data, time) => {
  let pageIndex = 0
  for (let i = 0; i < data.length; i++) {
    if (data[i] && time > data[i]['time']) {
      pageIndex = data[i]['pageIndex']
    }
  }
  Event.emit(EVENT_NAME.SWIPER_CHANGE_PAGE, pageIndex)
}

Event.on(EVENT_NAME.GLOBAL_AUDIO_PLAY, (data = {}) => {
  let src = data.src || ''

  // 不重复设置全程音频地址
  if (src || isSetGlobalAudioSrc) {
    // 停止普通音频播放
    Event.emit(EVENT_NAME.AUDIO_STOP)
    if (!isSetGlobalAudioSrc) {
      setAudioSrc(globalAudioPlayer, src)
    }

    isSetGlobalAudioSrc = true

    try {
      // 加载效果
      !isLoaded && Event.emit(EVENT_NAME.GLOBAL_AUDIO_LOADING, true)
      globalAudioPlayer.addEventListener('canplaythrough', () => {
        globalAudioPlayer.play()

        !isLoaded && Event.emit(EVENT_NAME.GLOBAL_AUDIO_LOADING, false)
        isLoaded = true

        timer = setInterval(() => {
          changeSwiperPageByTime(data.data || {}, globalAudioPlayer.currentTime)
        }, 500)
      })
    } catch (error) {
      console.log('播放全程音频异常', error)
    }
  } else {
    message.error('找不到全程音频地址')
  }
})

Event.on(EVENT_NAME.GLOBAL_AUDIO_STOP, () => {
  try {
    globalAudioPlayer.pause()
    timer && clearInterval(timer)
  } catch (error) {}
})
