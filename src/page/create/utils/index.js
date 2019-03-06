import { cloneDeep } from 'lodash'
import Drag from './drag'

export const getImageWH = path => {
  return new Promise((resolve, reject) => {
    if (path) {
      let img = new Image()
      img.src = path
      img.onload = e => {
        resolve({ w: e.target.width, h: e.target.height })
      }
    }
  })
}

const convertBase64UrlToBlob = urlData => {
  let bytes = window.atob(urlData.split(',')[1]) // 去掉url的头，并转换为byte //处理异常,将ascii码小于0的转换为大于0
  let ab = new ArrayBuffer(bytes.length)
  let ia = new Uint8Array(ab)
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i)
  }
  return new Blob([ab], { type: 'image/png' })
}

/**
 * 播放动画
 * 使用递归的方式，实现多个动画的播放
 * TODO:可以抽取出来
 * @param {String} selector
 * @param {Array} animations
 * @param {Number} interval 动画之间的间隔
 */
const previewAnimation = (selector, animations, interval = 10) => {
  animations = cloneDeep(animations)

  let { className, direction, duration, delay, alternate, linear, count, cycle } = animations[0]

  // 如果不存在动画，或者动画设置中没有动画类型，则返回
  if (!animations || animations.length === 0 || !className) {
    return
  }

  // 后面去掉动画style 参数用
  let oldStyle = $(selector).attr('style')

  let style = {
    'animation-duration': duration ? `${duration}s` : '',
    'animation-delay': delay ? `${delay}s` : '',
    'animation-direction': alternate ? 'alternate' : '',
    'animation-timing-function': linear ? 'linear' : '',
    'animation-iteration-count': cycle ? 'infinite' : count ? count : ''
  }

  for (const key in style) {
    if (style.hasOwnProperty(key)) {
      if (!style[key]) delete style[key]
    }
  }

  if (direction) {
    className = `${className}In${direction}`
  }

  let animationClass = `animated ${className}`

  $(selector)
    .addClass(animationClass)
    .css(style)
    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
      $(selector)
        .removeClass(animationClass)
        .attr('style', oldStyle)

      animations.splice(0, 1)

      if (animations.length > 0) {
        setTimeout(function() {
          previewAnimation(selector, animations)
        }, interval)
      }
    })
}

// 根据秒数获取时间格式字符串    72 => 01:12
const getTimeByNum = (val = 0) => {
  let minute = parseInt(val / 60, 10)
  if (minute < 10) {
    minute = '0' + minute
  }

  let second = parseInt(val % 60, 10)
  if (second < 10) {
    second = '0' + second
  }
  return `${minute}:${second}`
}

// 根据时间获取秒数 01:12 => 72
const getNumByTime = (text = '') => {
  let times = text.split(':')
  let time = Number(times[0]) * 60 + Number(times[1])
  if (!time) time = 0
  return time
}

export { Drag, convertBase64UrlToBlob, previewAnimation, getTimeByNum, getNumByTime }
