import localCache from './local_cache.js'
import queryString from './query_string'
/**
 * 数字增加千位浮
 * 1000001 => 1,000,001
 * @param {*} number
 * @param {*} places
 * @param {*} symbol
 * @param {*} thousand
 * @param {*} decimal
 */
const formatNum = (number, places, symbol, thousand, decimal) => {
  number = number || 0
  places = !isNaN((places = Math.abs(places))) ? places : 0
  symbol = symbol !== undefined ? symbol : ''
  thousand = thousand || ','
  decimal = decimal || '.'
  let i, j
  let negative = number < 0 ? '-' : ''
  i = parseInt((number = Math.abs(+number || 0).toFixed(places)), 10) + ''
  j = (j = i.length) > 3 ? j % 3 : 0
  return (
    symbol +
    negative +
    (j ? i.substr(0, j) + thousand : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) +
    (places
      ? decimal +
        Math.abs(number - i)
          .toFixed(places)
          .slice(2)
      : '')
  )
}

/**
 * 时间格式化
 * @param {str} format eg:yyyy-MM-dd hh:mm:ss
 */
const dateFormat = (date, format) => {
  var dateProp = {
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
  for (var k in dateProp) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? dateProp[k] : ('00' + dateProp[k]).substr(('' + dateProp[k]).length)
      )
    }
  }
  return format
}

/**
 * 生成UUID
 * example: uuid(10)
 */
const uuid = (len, radix) => {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = []
  let i
  radix = radix || chars.length

  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    let r
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
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
  var rgb = colorStr || '#000000'
  var a = opacity === undefined ? 1 : opacity
  var matches = rgb.match(/#([\da-f]{2})([\da-f]{2})([\da-f]{2})/i)
  var rgba =
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
  scale = scale || 1
  var id = '__video_img__' + uuid()
  var video = document.createElement('video')
  video.setAttribute('id', id)
  video.style.display = 'none'
  document.body.appendChild(video)

  if (video.getAttribute('src') !== src) {
    video.setAttribute('src', src)
    video.load()
  }
  video.currentTime = currentTime
  video.addEventListener('loadeddata', function() {
    var canvas = document.createElement('canvas')
    canvas.width = video.videoWidth * scale
    canvas.height = video.videoHeight * scale
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
    var base64 = canvas.toDataURL('image/png')

    var data = {
      totalTime: video.duration,
      currentTime: video.currentTime,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      base64: base64
    }
    video.parentNode.removeChild(video)
    if (callback) {
      callback(data)
    }
  })
}

export {
  queryString,
  localCache,
  uuid,
  formatNum,
  isDev,
  dateFormat,
  urlParam,
  calculateWHByDom,
  hex2Rgba,
  getVideoImage
}
