/*
 * 音频播放处理方式
 * 页面中只会存在一个音频对象，用来播放音频， 通过派发事件直接就能播放。
 */
import { Toast } from 'antd-mobile'
import Event from 'common/js/event.js'
import { EVENT_NAME } from '../common/_const'
import { isEqualSrc, setAudioSrc } from './util'

let tempCurrentAudioPointId = null

// 点读点音频播放器
const playerAudio = new Audio()

const play = () => {
  try {
    playerAudio.play()
  } catch (error) {}
}

playerAudio.addEventListener('canplaythrough', () => {
  try {
    Event.emit(EVENT_NAME.AUDIO_PLAY + tempCurrentAudioPointId)
    play()
  } catch (error) {
    console.log('playerAudio is playing...')
  }
})

playerAudio.addEventListener('ended', () => {
  Event.emit(EVENT_NAME.AUDIO_STOP + tempCurrentAudioPointId)
  console.log('ended')
})

// 音频播放
Event.on(EVENT_NAME.AUDIO_PLAY, ({ src, id }) => {
  if (src) {
    console.log(EVENT_NAME.AUDIO_PLAY)
    // 先暂停上一个音频播放
    Event.emit(EVENT_NAME.AUDIO_STOP + tempCurrentAudioPointId)
    // 暂停背景音乐
    Event.emit(EVENT_NAME.BGAUDIO_STOP)

    tempCurrentAudioPointId = id

    if (!isEqualSrc(playerAudio.getAttribute('data-src'), src)) {
      console.log('loading')
      Event.emit(EVENT_NAME.AUDIO_LOADING + tempCurrentAudioPointId)
      setAudioSrc(playerAudio, src)
      play()
      console.log(`${EVENT_NAME.AUDIO_PLAY} ${playerAudio.src}`)
    } else {
      if (playerAudio.paused) {
        Event.emit(EVENT_NAME.AUDIO_PLAY + tempCurrentAudioPointId)
        play()
      } else {
        Event.emit('event_audio_stop')
      }
    }
  } else {
    Toast.info('该点读点未上传音频文件', 3, null, false)
  }
})

// 音频暂停
Event.on(EVENT_NAME.AUDIO_STOP, () => {
  Event.emit(EVENT_NAME.AUDIO_STOP + tempCurrentAudioPointId)
  try {
    console.log(`${EVENT_NAME.AUDIO_STOP} ${playerAudio.src}`)
    playerAudio.pause()
  } catch (error) {}
})
