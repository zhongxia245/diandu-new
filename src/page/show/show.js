import 'swiper/dist/css/swiper.min.css'
import React, { Component } from 'react'
import classnames from 'classnames'
import Swiper from 'swiper/dist/js/swiper.min.js'
import { isMobile } from 'common/js/utils/user_agent.js'
import { PageItem, Header } from './component'
import Event from 'common/js/event.js'
import { EVENT_NAME } from './handle/const'
import { runAnimation, runBlink } from './common/animation'
import { getGlobalAudioSetting } from './utils'

export default class Show extends Component {
  constructor(props) {
    super(props)
    this.swiper = null
    this.state = {
      currentIndex: 0,
      contentW: document.body.clientWidth,
      contentH: document.body.clientHeight
    }
  }

  initData = () => {
    const { data, form } = this.props
    // 先注册key，才能保存数据
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        form.getFieldProps(key)
      }
    }
    form.setFieldsValue(data)
  }

  initSwiper = () => {
    const { data } = this.props
    let pages = data['pages'] || []
    let globalSetting = data['globalSetting'] || {}

    let swiperOptions = {
      keyboard: false,
      direction: 'horizontal', // vertical
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction'
      },
      noSwiping: true,
      lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 1
      },
      effect: globalSetting.swiperEffect || 'slide', // 'slide'（普通切换、默认）,"fade"（淡入）"cube"（方块）"coverflow"（3d流）"flip"（3d翻转）
      on: {
        transitionEnd: () => {
          if (this.swiper) {
            this.setState({ currentIndex: this.swiper.activeIndex })
            runBlink(this.swiper.activeIndex)
          }
        }
      }
    }

    // PC需要前进后退按钮
    if (!isMobile()) {
      swiperOptions.navigation = {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    } else {
      // 如果缓存里面有记录上个页面下标，则跳转过去
      let currentPageIndex = localStorage.getItem('diandu:current_page_index')
      if (currentPageIndex) {
        let info = currentPageIndex.split('_')
        localStorage.removeItem('diandu:current_page_index')
        if (String(this.props.id) === info[0]) {
          swiperOptions.initialSlide = Number(info[1])
        }
      }
    }

    this.swiper = new Swiper('.swiper-container', swiperOptions)
    runAnimation(pages[0], 0)
  }

  componentDidMount() {
    /**
     * FIXME: 这里initData 和 initSwiper 顺序不能变，否则swiper初始化的时候，swiper页面总数为0，会出现问题
     * TODO: initData 放在  construct 里面，则计算图片缩放比例出错，什么鬼, 排查下
     */
    this.initData()

    let contentW = document.querySelector('.pageitem__content').clientWidth
    let contentH = document.querySelector('.pageitem__content').clientHeight
    this.setState({ contentW, contentH }, () => {
      this.initSwiper()
      runBlink(0)
    })

    // 横竖屏切换，或者设备切换，则重新自动适配大小
    window.onresize = () => {
      let newHeight = document.querySelector('.pageitem__content').clientHeight
      let newWidth = document.querySelector('.pageitem__content').clientWidth
      this.setState({ contentW: newWidth, contentH: newHeight })
    }

    // auto play background audio
    if (this.props.data.bgAudio && this.props.data.bgAudio.src) {
      if (isMobile()) {
        // 移动端增加一层遮罩，点击自动播放背景音乐，播放后则去掉遮罩
        let bgAudioMask = document.createElement('div')
        bgAudioMask.id = 'bg-audio__mask'
        document.body.appendChild(bgAudioMask)
        bgAudioMask.addEventListener('touchstart', this.playBgAudio)
      } else {
        this.playBgAudio()
      }
    }

    // global audio trigger change swiper pageIndex
    Event.on(EVENT_NAME.SWIPER_CHANGE_PAGE, index => {
      this.swiper.slideTo && this.swiper.slideTo(index)
    })
  }

  playBgAudio = e => {
    Event.emit(EVENT_NAME.BGAUDIO_PLAY, this.props.data.bgAudio)
    if (isMobile()) {
      let bgAudioMask = document.getElementById('bg-audio__mask')
      bgAudioMask.parentNode.removeChild(bgAudioMask)
    }
  }

  render() {
    const { form, data } = this.props
    const pages = form.getFieldValue('pages') || []

    return (
      <div className="show">
        <Header
          form={this.props.form}
          pageIndex={this.state.currentIndex}
          globalAudioData={getGlobalAudioSetting(data)}
          bgAudioSrc={data.bgAudio && data.bgAudio.src}
        />
        <div className="swiper-container pageitem__content">
          <div className="swiper-wrapper">
            {pages.map((item, index) => {
              if (item['hide']) {
                return
              }
              return (
                <PageItem
                  key={index}
                  pageIndex={index}
                  data={item}
                  contentW={this.state.contentW}
                  contentH={this.state.contentH}
                  form={this.props.form}
                  className={classnames('swiper-slide', {
                    'swiper-no-swiping': !isMobile()
                  })}
                />
              )
            })}
          </div>
          <div className="swiper-pagination" />
          {isMobile() ? '' : <div className="swiper-button-prev" />}
          {isMobile() ? '' : <div className="swiper-button-next" />}
        </div>
      </div>
    )
  }
}
