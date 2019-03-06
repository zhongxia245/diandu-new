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
import { Alert, Slider, Row, Col, Button, Tag, message, Input, Tooltip } from 'antd'
import { CustomAntdFooter } from 'common/js/components/custom_antd_modal'
import { getNumByTime, getTimeByNum } from '@/page/create/utils'
import './global_audio_setting.less'

class GlobalAudioSetting extends Component {
  constructor(props) {
    super(props)

    const { form, pointData, pointId, pageIndex } = props
    const { getFieldsValue } = form
    let { pages = [], globalSetting = {} } = getFieldsValue() || {}

    let globalAudioData = (globalSetting['globalAudio'] &&
      globalSetting['globalAudio'][pointId] &&
      globalSetting['globalAudio'][pointId]['data']) || [{ pageIndex: pageIndex, time: 0 }]

    // 给文本框使用的
    let data = []
    globalAudioData.map(item => {
      if (item) {
        data[item['pageIndex']] = getTimeByNum(item['time'])
      }
    })

    let mp3Src = (pointData.data && pointData.data.src) || ''

    this.state = {
      pages: pages,
      play: false,
      duration: 0,
      currentTime: 0,
      mp3Src: mp3Src,
      data: data
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
      let { currentTime, data } = this.state
      data[index] = getTimeByNum(parseInt(currentTime, 10))
      this.setState({ data })
    },
    change: val => {
      this.playerAudio.currentTime = val
      this.setState({ currentTime: val })
    },
    changeInput: (index, e) => {
      let { data } = this.state
      let text = e.target.value
      data[index] = text
      this.setState({ data })
    },
    submit: () => {
      const { mp3Src, data } = this.state
      const { form, pointId } = this.props
      const { getFieldValue, setFieldsValue } = form

      let globalSetting = getFieldValue('globalSetting') || {}

      globalSetting['globalAudio'] = globalSetting['globalAudio'] || []

      let globalAudioData = []
      data.map((time, index) => {
        globalAudioData[index] = { pageIndex: index, time: getNumByTime(time) }
      })

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
    const { pages, duration, currentTime, data, play } = this.state

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
            tipFormatter={val => getTimeByNum(val)}
            onChange={this.action.change}
          />
          <Tag style={{ width: '100px' }}>
            {getTimeByNum(currentTime)}/{getTimeByNum(duration)}
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
            let disabled = index <= pageIndex
            let time = data[index]

            return (
              <Col key={index} span={6}>
                <div style={{ backgroundImage: `url(${src})` }}>
                  {(!disabled || index === pageIndex) && (
                    <div className="global-audio-setting__time">
                      <Input
                        size="small"
                        type="text"
                        value={time}
                        disabled={disabled}
                        placeholder="请设置时间"
                        onChange={this.action.changeInput.bind(this, index)}
                      />
                      <Tooltip placement="top" title="使用当前音频时间">
                        <Button
                          size="small"
                          type="primary"
                          icon="edit"
                          shape="circle"
                          disabled={disabled}
                          onClick={this.action.selectTime.bind(this, index)}
                        />
                      </Tooltip>
                    </div>
                  )}
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
