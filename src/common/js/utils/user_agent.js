export function isWeiXin() {
  return navigator.userAgent.indexOf('MicroMessenger') > -1
}

export function isQQ() {
  return navigator.userAgent.match(/\sQQ/i) === ' qq'
}

export function isIOS() {
  return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
}

export function isAndroid() {
  return navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1
}

export function isiPad() {
  return navigator.userAgent.indexOf('iPad') > -1
}

export function isMobile() {
  return !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/)
}

/**
 * 比较版本号 ，大于等于返回 true
 * @param {string} version1  版本1
 * @param {string} version2  版本2
 */
export function compareVersion(version1, version2) {
  version1 = version1.split('.')
  version2 = version2.split('.')
  if (parseInt(version1[0], 10) > parseInt(version2[0], 10)) {
    return true
  } else if (parseInt(version1[0], 10) < parseInt(version2[0], 10)) {
    return false
  } else {
    if (parseInt(version1[1], 10) > parseInt(version2[1], 10)) {
      return true
    } else if (parseInt(version1[1], 10) < parseInt(version2[1], 10)) {
      return false
    } else {
      if (parseInt(version1[2], 10) > parseInt(version2[2], 10)) {
        return true
      } else if (parseInt(version1[2], 10) < parseInt(version2[2], 10)) {
        return false
      }
    }
  }
  return true
}
