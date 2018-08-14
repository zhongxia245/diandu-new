import { isIOS } from 'common/js/utils/user_agent.js'

// 判断资源文件是否一样
export const isEqualSrc = (src, otherSrc) => {
  src = src || ''
  otherSrc = otherSrc || ''
  let name = src.split('/')[src.split('/').length - 1]
  let otherName = otherSrc.split('/')[otherSrc.split('/').length - 1]
  console.log(name, otherName)
  return name === otherName
}

/**
 * 设置音频的资源文件
 * m3u8是针对iphone做的优化
 */
export const setAudioSrc = (playerAudio, src) => {
  playerAudio.setAttribute('data-src', src)
  // src = 'http://m8c.music.126.net/20180601091714/e692019b7c666c8b18ff79faed161134/ymusic/2d26/c402/d6ce/99877774b37760b5bd167ba56684b390.mp3'
  if (isIOS) {
    let sourceDom = `
    <source src="${src.replace('mp3', 'm3u8')}">
    <source src="${src}">
  `
    playerAudio.innerHTML = sourceDom
  } else {
    playerAudio.src = src
  }
  playerAudio.load && playerAudio.load()
}
