// 点读整体数据
export const DATA = {
  title: '本地测试',
  intro: '本地测试',
  keywords: '关键词',
  competence: 0,
  charge: 0,
  cost: 10,
  share: {
    title: '分享的标题',
    desc: '分享的文案',
    imgUrl: 'https://www.catics.org/edu/public/img/logo-index.png'
  },
  bgAudio: null,
  covers: ['../uploads/f6a59a1bd969fc6e730cc80d748b37cf.png'],
  pages: [] // 点读页数据
}

//============我============是==============分=============隔==============线================//

// 点读页数据
export const PAGE_DATA = {
  w: 800, // 在创建页面的宽高
  h: 450,
  baseInfo: {
    width: 1280, // 背景图片的真实宽高
    height: 800,
    bgSrc: '../uploads/96e6812b428869e8bd66eefb0967c2e2.jpg'
  },
  points: [] // 点读点数据
}

//============我============是==============分=============隔==============线================//

// 视频点读点
export const VIDEO_POINT_DATA = {
  x: 0.5152777777777777, // 点读点坐标
  y: 0.4266666666666667,
  pointSize: 50, // 点读点圆的大小
  type: 'video', // 点读点类型
  data: {
    // 点读点数据
    src: '../uploads/d91e4de9a9cc9f2470cfca39c2c97898.mp4',
    name: 'baozi.mp4'
  }
}

// 音频点读点
export const AUDIO_POINT_DATA = {
  x: 0.6319444444444444,
  y: 0.5777777777777777,
  pointSize: 50,
  type: 'audio',
  data: {
    src: '../uploads/219c2b1dac30fb88aed71ea97a219a00.mp3',
    name: 'linzhongniao.mp3'
  }
},

// 点读点数据  [文本框点读点]
export const TEXT_POINT_DATA = {
  x: 0.016666666666666666, // 点读点坐标  百分比
  y: 0.02666666666666667,
  width: 0.39166666666666666,
  height: 0.1466666666666666,
  type: 'input', // 点读点类型
  data:{
    text:
      '哈哈还，实现编辑框还真是蛋疼， 不太好用， 这个，这个不能选中很贪疼。&nbsp;'
  },
  // 点读点的格式设置（主要是样式）
  format_config: {
    background_color: '#10d636',
    color: '#0f0d04',
    font_family: 3,
    fontWeight: true,
    fontStyle: true,
    textDecoration: true,
    font_setting: {
      fontWeight: true,
      fontStyle: false,
      textDecoration: true
    }
  }
}

// 图形点读点数据
export const PAGE_SHAPE_DATA = {
  x: 0.7847222222222222,
  y: 0.4088888888888889,
  width: 0.1652777777777778,
  height: 0.2666666666666667,
  type: 'page_shape',
  data: {
    src: '/build/h5/create/imgs/shape/common/icon8.svg'
  },
  format_config: {
    point_scale: 100,
    btn_opacity: 1
  }
}

// 测试点读点数据
export const EXAM_POINT_DATA = {
  x: 0.7041666666666667,
  y: 0.25555555555555554,
  pointSize: 50,
  type: 'test',
  data: {
    questions: [
      {
        type: 0,
        question: '1+1=？',
        answerIndex: 0,
        answers: ['2', '3', '4', '5']
      },
      {
        type: 1,
        question: '下面哪些是足球巨星？',
        answerIndex: [0, 1, 2],
        answers: ['梅西', ' C 罗', '佩佩', '姚明']
      },
      {
        type: 2,
        question: '1+1=2？',
        answerIndex: 0,
        answers: ['对（True）', '错（False）']
      },
      {
        type: 0,
        question:
          '这个题目很长很长?\n这个题目很长很长?\n这个题目很长很长?\n这个题目很长很长?\n这个题目很长很长?\n这个题目很长很长?\n这个题目很长很长?\n这个题目很长很长?',
        answerIndex: 0,
        answers: [
          '答案也很长答案也很长答案也很长答案也很长答案也很长答案也很长',
          '答案也很长答案也很长答案也很长答案也很长答案也很长答案也很长',
          '答案也很长答案也很长答案也很长答案也很长答案也很长答案也很长答案也很长答案也很长',
          '答案也很长答案也很长答案也很长答案也很长答案也很长答案也很长答案也很长',
          '答案也很长答案也很长答案也很长答案也很长答案也很长答案也很长答案也很长答案也很长',
          '答案也很长答案也很长答案也很长答案也很长答案也很长答案也很长',
        ]
      }
    ]
  }
}

// 单页签点读点
export const NOTE_POINT_DATA = {
  x: 0.6333333333333333,
  y: 0.07333333333333333,
  pointSize: 50,
  type: 'note',
  data: {
    content:
      '<p><span style="color: rgb(0,168,133);">这个是注解，</span><span style="color: rgb(226,80,65);">可以文字设置的</span>，打击不知道为什么，<span style="font-size: 10px;">我居然不用文本框，可怕，然后现在需要自己设置字体了。 哈哈哈</span></p>\n<p></p>\n<img src="../uploads/11c75fefab31b34575497d38860267dd.jpg" alt="undefined" style="float:none;height: 200px;width: 200px"/>\n<p></p>\n'
  }
}

// 多页签点读点
export const TABS_NOTE_POINT_DATA = {
  x: 0.7416666666666667,
  y: 0.12666666666666668,
  pointSize: 50,
  type: 'tabs_note',
  data: {
    tabs: [
      {
        key: 0,
        title: '中文',
        content:
          '<p><span style="font-size: 14px;">让我输入内容呢？ 这里是不是只要提示，而，不是药内容哈哈哈哈，应该还需要一个设置行高的 。 </span></p>\n<p></p>\n<p></p>\n'
      },
      {
        key: 2,
        title: '英语',
        content:
          '<p>This is a English , I Love XiaoTing .&nbsp;</p>\n<p></p>\n<p>I miss you .&nbsp;</p>\n'
      }
    ]
  }
}

// 超链接点读点
export const LINK_POINT_DATA = {
  x: 0.8305555555555556,
  y: 0.2644444444444444,
  pointSize: 50,
  type: 'link',
  data: {
    link: 'http://www.baidu.com'
  }
}

