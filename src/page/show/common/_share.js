const DEFAULT_IMG_URL = 'https://www.catics.org/edu/public/img/logo-index.png'

export const setShare = shareInfo => {
  shareInfo = {
    title: shareInfo.title || '布丁云书点读分享',
    desc: shareInfo.desc || '',
    link: window.location.href,
    imgUrl: shareInfo.imgUrl || DEFAULT_IMG_URL
  }
  wx.ready(function() {
    wx.onMenuShareAppMessage(shareInfo)
    wx.onMenuShareTimeline(shareInfo)
    wx.onMenuShareQQ(shareInfo)
  })
}

/**
// 上到测试环境后，需要从php中获取相关的一些微信分享参数
wx.config({
  debug: false,//调试开关
  appId: '<?php echo $signPackage["appId"];?>',
  timestamp: '<?php echo $signPackage["timestamp"];?>',
  nonceStr: '<?php echo $signPackage["nonceStr"];?>',
  signature: '<?php echo $signPackage["signature"];?>',
  jsApiList: [
    'onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone',
    'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice'
  ]
});
 */
