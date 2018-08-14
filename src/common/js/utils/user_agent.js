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
