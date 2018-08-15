const CONTENT_TYPE = {
  upload: 'upload', // 上传文件
  modal: 'modal' // 点击出现弹窗
}
// 点读点类型
export const POINT_TYPE = [
  {
    type: 'video',
    text: '视频',
    icon: require('../imgs/point_icon/video.png'),
    iconActive: require('../imgs/point_icon/video_g.png'),
    contentType: CONTENT_TYPE.upload,
    // 允许上传的文件
    accept: {
      title: 'video files',
      extensions: 'mp4',
      mimeTypes: 'video/mp4'
    }
  },
  {
    type: 'audio',
    text: '音频',
    icon: require('../imgs/point_icon/audio.png'),
    iconActive: require('../imgs/point_icon/audio_g.png'),
    contentType: CONTENT_TYPE.upload,
    accept: {
      title: 'audio files',
      extensions: 'mp3',
      mimeTypes: 'audio/mpeg'
    }
  },
  {
    type: 'test',
    text: '测试',
    icon: require('../imgs/point_icon/test.png'),
    iconActive: require('../imgs/point_icon/test_g.png'),
    contentType: CONTENT_TYPE.modal
  },
  /** 文本框直接在点读页上面的进行创建 */
  // {
  //   type: 'input',
  //   text: '文本框',
  //   icon: require('../imgs/point_icon/textbox.png'),
  //   iconActive: require('../imgs/point_icon/textbox_g.png'),
  //   contentType: CONTENT_TYPE.modal
  // },
  {
    type: 'note',
    text: '注解',
    icon: require('../imgs/point_icon/note.png'),
    iconActive: require('../imgs/point_icon/note_g.png'),
    contentType: CONTENT_TYPE.modal
  },
  {
    type: 'tabs_note',
    text: '多页签注解',
    icon: require('../imgs/point_icon/tabs_note.png'),
    iconActive: require('../imgs/point_icon/tabs_note_g.png'),
    contentType: CONTENT_TYPE.modal
  },
  {
    type: 'link',
    text: '超链接',
    icon: require('../imgs/point_icon/link.png'),
    iconActive: require('../imgs/point_icon/link_g.png'),
    contentType: CONTENT_TYPE.modal
  },
  {
    type: '3d',
    text: '3D观察器',
    icon: require('../imgs/point_icon/3d.png'),
    iconActive: require('../imgs/point_icon/3d_g.png'),
    contentType: CONTENT_TYPE.modal
  }
]

// 点读点动效类型
export const POINT_EFFECT_TYPE = [
  {
    type: 'single_effect',
    text: '单图特效',
    icon: require('../imgs/point_icon/dynamic.png'),
    iconActive: require('../imgs/point_icon/dynamic.png')
  },
  {
    type: 'mul_effect',
    text: '多图特效',
    icon: require('../imgs/point_icon/dynamicmore.png'),
    iconActive: require('../imgs/point_icon/dynamicmore_g.png')
  },
  {
    type: 'switch',
    text: '开关图',
    icon: require('../imgs/point_icon/switch.png'),
    iconActive: require('../imgs/point_icon/switch_g.png')
  },
  {
    type: 'sway',
    text: '摇摆图',
    icon: require('../imgs/point_icon/switchmore.png'),
    iconActive: require('../imgs/point_icon/switchmore_g.png')
  }
]
