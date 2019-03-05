// 2019年03月04日23:50:51
// 保证数据库存储的数据可以支持多个全程音频，这里的只是展示，可以随时修改，而不会引起兼容老版本问题
// 目前只开发一个全程音频的功能，如果需要开发多个音频，则需要修改这里的获取方式
export const getGlobalAudioSetting = data => {
  let pages = data['pages'] || []
  let globalSetting = data['globalSetting'] || {}
  let globalAudioData = globalSetting['globalAudio'] || null

  for (let i = 0; i < pages.length; i++) {
    let points = pages[i]['points'] || []
    for (let j = 0; j < points.length; j++) {
      if (points[j]['isGlobalAudio']) {
        return globalAudioData[`${i}_${j}`]
      }
    }
  }
}
