import queryString from './query_string'
import uuid from 'uuid/v4'

/**
 * 时间格式化
 * @param {str} format eg:yyyy-MM-dd hh:mm:ss
 */
const dateFormat = (date, format) => {
  let dateProp = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S+': date.getMilliseconds()
  }
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in dateProp) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? dateProp[k] : ('00' + dateProp[k]).substr(('' + dateProp[k]).length)
      )
    }
  }
  return format
}

// 是否为本地开发
const isDev = () => {
  if (
    window.location.href.indexOf('localhost') !== -1 ||
    window.location.href.indexOf('192.168') !== -1 ||
    window.location.href.indexOf('127.0.0.1') !== -1
  ) {
    return true
  }
  return false
}

/**
 * 把对象变成字符串
 * eg: {name:'11',age:18}  => 'name=11&age=18'
 * axios 表单提交，只需要转换成这种形式，就是 form表单提交，默认则是 JSON提交
 */
const urlParam = data => {
  let paramStr = ''
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      paramStr += `${key}=${encodeURIComponent(data[key])}&`
    }
  }
  return paramStr.substr(0, paramStr.length - 1)
}

/**
 * 输入图片宽高，计算除，在指定大小的容器内，最适合的展示大小
 */
const calculateWHByDom = ({ width, height, domWidth, domHeight }) => {
  let scaleW, scaleH
  domWidth = domWidth || window.innerWidth
  domHeight = domHeight || window.innerHeight

  let imgWh = width / height
  let domWh = domWidth / domHeight

  if (width > height && imgWh > domWh) {
    // 横图
    scaleW = domWidth
    scaleH = (scaleW * height) / width
  } else {
    // 竖图
    scaleH = domHeight
    scaleW = (scaleH * width) / height
  }

  if (width < domWidth && height < domHeight) {
    scaleW = width
    scaleH = height
  }

  return {
    width: scaleW,
    height: scaleH,
    scale: parseFloat((scaleW / width).toFixed(2))
  }
}

/**
 * 把16进制颜色转换成rgba的颜色
 * #000000 + 0.5 = rgba(0,0,0,0.5)
 * @param {any} colorStr
 * @param {any} opacity
 * @returns
 */
const hex2Rgba = (colorStr, opacity) => {
  let rgb = colorStr || '#000000'
  let a = opacity === undefined ? 1 : opacity
  let matches = rgb.match(/#([\da-f]{2})([\da-f]{2})([\da-f]{2})/i)
  let rgba =
    'rgba(' +
    matches
      .slice(1)
      .map(function(m) {
        return parseInt(m, 16)
      })
      .concat(a) +
    ')'
  return rgba
}

/**
 * 获取视频指定时间点的截图
 * @param {string} src 视频地址
 * @param {int} currentTime 指定时间
 * @param {function} callback 截图完毕的回调
 * @param {int} scale 截图的比例
 */
const getVideoImage = (src, currentTime, callback, scale) => {
  return new Promise(resolve => {
    scale = scale || 1
    let id = '__video_img__' + uuid()
    let video = document.createElement('video')
    video.setAttribute('id', id)
    video.style.display = 'none'
    document.body.appendChild(video)

    if (video.getAttribute('src') !== src) {
      video.setAttribute('src', src)
      video.load()
    }
    video.currentTime = currentTime
    video.addEventListener('loadeddata', function() {
      let canvas = document.createElement('canvas')
      canvas.width = video.videoWidth * scale
      canvas.height = video.videoHeight * scale
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
      let base64 = canvas.toDataURL('image/png')

      let data = {
        totalTime: video.duration,
        currentTime: video.currentTime,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        base64: base64
      }
      video.parentNode.removeChild(video)
      callback && callback(data)
      resolve(data)
    })
  })
}

const getVideoWH = (src, callback) => {
  return new Promise(resolve => {
    let video = document.createElement('video')
    video.addEventListener('loadeddata', e => {
      let data = e.path[0]
      let info = { width: data.videoWidth, height: data.videoHeight, duration: data.duration }
      callback && callback(info)
      resolve(info)
    })
    video.src = src
    video.load()
  })
}

export { queryString, isDev, dateFormat, urlParam, calculateWHByDom, hex2Rgba, getVideoImage, getVideoWH }
