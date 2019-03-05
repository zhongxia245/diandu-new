/**
 * 2019年03月04日23:34:30
 *
 * TODO:全程音频点读点所在页的之前，不能设置切换的时间
 *
 * 全程音频设置， 这里做的是兼容多个全程音频情况做的
 * 保存全程音频的数据，采用对象保存，使用  pageIndex_pointIndex 为 key， 对应的则是全程音频的配置
 * eg:
 * {
 *   1_1:{...},
 *   1_2:{...},
 * }
 */
import React, { Component } from 'react'
import { Alert, Slider, Row, Col, Button, Tag, message } from 'antd'
import { CustomAntdFooter } from 'common/js/components/custom_antd_modal'
import './global_audio_setting.less'

const getFormatTime = val => {
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

class GlobalAudioSetting extends Component {
  constructor(props) {
    super(props)

    const { form, pointData, pointId, pageIndex } = props
    const { getFieldsValue } = form
    let { pages = [], globalSetting = {} } = getFieldsValue() || {}

    let globalAudioData = (globalSetting['globalAudio'] &&
      globalSetting['globalAudio'][pointId] &&
      globalSetting['globalAudio'][pointId]['data']) || [{ pageIndex: pageIndex, time: 0 }]

    let mp3Src = (pointData.data && pointData.data.src) || ''

    this.state = {
      pages: pages,
      play: false,
      duration: 0,
      currentTime: 0,
      mp3Src: mp3Src,
      globalAudioData: globalAudioData
    }

    this.playerAudio = null
    this.timer = null
  }

  componentDidMount() {
    const { mp3Src } = this.state

    // 点读点音频播放器
    this.playerAudio = new Audio()

    this.playerAudio.addEventListener('canplaythrough', () => {
      this.setState({ duration: this.playerAudio.duration })
    })

    this.playerAudio.addEventListener('ended', () => {
      this.action.pause()
    })

    if (this.playerAudio) {
      this.timer = setInterval(() => {
        this.setState({ currentTime: this.playerAudio.currentTime })
      }, 1000)
    }

    this.playerAudio.src = mp3Src
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer)
    this.action.pause()
    this.playerAudio = null
  }

  action = {
    // 播放音频
    play: () => {
      if (this.playerAudio.paused) {
        this.setState({ play: true })
        this.playerAudio.play()
      }
    },
    // 暂停音频
    pause: () => {
      this.setState({ play: false })
      this.playerAudio.pause()
    },
    // 选择时间
    selectTime: index => {
      let { globalAudioData, currentTime } = this.state
      globalAudioData[index] = { pageIndex: index, time: parseInt(currentTime, 10) }
      this.setState({ globalAudioData })
    },
    change: val => {
      this.playerAudio.currentTime = val
      this.setState({ currentTime: val })
    },
    submit: () => {
      const { mp3Src, globalAudioData } = this.state
      const { form, pointId } = this.props
      const { getFieldValue, setFieldsValue } = form

      let globalSetting = getFieldValue('globalSetting') || {}

      globalSetting['globalAudio'] = globalSetting['globalAudio'] || []

      globalSetting['globalAudio'][pointId] = {
        src: mp3Src,
        data: globalAudioData
      }

      setFieldsValue({ globalSetting: globalSetting })
      message.success('保存全程音频时间设置成功')
      this.props.onOk && this.props.onOk()
    }
  }

  render() {
    const { pageIndex } = this.props
    const { pages, duration, currentTime, globalAudioData, play } = this.state

    return (
      <div className="global-audio-setting">
        <Alert
          message="全程音频为多个点读页所共用，可设置各个点读页在对应音频的时间点出现，每个点读只能设置一个全程音频"
          type="warning"
        />

        <Row type="flex" gutter={40} align="middle" style={{ margin: '40px 0' }}>
          <Slider
            style={{ flex: 1, marginRight: '40px' }}
            value={currentTime}
            min={0}
            max={duration}
            tipFormatter={val => getFormatTime(val)}
            onChange={this.action.change}
          />
          <Tag style={{ width: '100px' }}>
            {getFormatTime(currentTime)}/{getFormatTime(duration)}
          </Tag>
          <Button
            shape="circle"
            type="primary"
            icon={play ? 'pause' : 'caret-right'}
            onClick={play ? this.action.pause : this.action.play}
          />
        </Row>

        <Row gutter={16} type="flex">
          {pages.map((item, index) => {
            let src = item.baseInfo && item.baseInfo.bgSrc
            let time = (globalAudioData[index] && globalAudioData[index]['time']) || 0
            return (
              <Col key={index} span={6}>
                <div style={{ backgroundImage: `url(${src})` }}>
                  <Button disabled={index <= pageIndex} onClick={this.action.selectTime.bind(this, index)}>
                    {time !== undefined ? getFormatTime(time) : <span style={{ color: '#ccc' }}>点击设置时间</span>}
                  </Button>
                </div>
              </Col>
            )
          })}
        </Row>

        <CustomAntdFooter onCancel={this.props.onCancel} onOk={this.action.submit} />
      </div>
    )
  }
}

export default GlobalAudioSetting
