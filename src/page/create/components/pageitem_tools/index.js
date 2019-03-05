/**
 * 点读页面工具栏
 */
import './index.less'
import React, { Component } from 'react'
import classnames from 'classnames'
import { Switch, Tabs } from 'antd'
import { Grid } from 'common/js/components'

import { POINT, PRE_PAGE_ID, PRE_POINT_CLASS, EVENT_NAMES } from '@/config'
import { DrawCustomArea } from '@/page/create/utils/draw'
import Event from 'common/js/event.js'
import RenderContent from './mod/rendercontent'
import { AnimationSetting } from './mod/toolitem'
import FormatSetting from './format_setting'
import Trigger from './trigger'

class Tools extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uploading: false,
      uploadProgress: 0,
      selectNewAreaStyle: false // 选择新的自定义区域样式(矩形，圆，正方形等)
    }
  }

  getPointData = () => {
    const { pageIndex, pointIndex } = this.props
    const { getFieldValue } = this.props.form
    let pagesData = getFieldValue('pages') || []
    return (pagesData[pageIndex] && pagesData[pageIndex]['points'][pointIndex]) || {}
  }

  setPointData = newState => {
    let pointData = this.getPointData()
    const { pageIndex, pointIndex } = this.props
    const { getFieldValue, setFieldsValue } = this.props.form
    let pagesData = getFieldValue('pages') || []
    pagesData[pageIndex]['points'][pointIndex] = { ...pointData, ...newState }
    setFieldsValue({ pages: pagesData })
  }

  handleSelectType = item => {
    this.setPointData({ type: item.type })
  }

  handleStartUpload = () => {
    this.setState({ uploading: true })
  }

  handleUploadSuccess = (file, path) => {
    this.setPointData({ data: { src: path, name: file.name } })
    this.setState({ uploadProgress: 0, uploading: false })
  }

  handleUploadProgress = (file, progress) => {
    this.setState({ uploadProgress: progress * 100 })
  }

  handleFormatCallback = (item, value) => {
    // 针对下拉框组件
    if (value.target) {
      value = value.target.selectedIndex
    }
    let pointData = this.getPointData()
    this.setPointData({
      format_config: {
        ...pointData['format_config'],
        [item['name']]: value
      }
    })
  }

  handleFormatCheckbox = (name, subitem, e) => {
    let checked = e.target.checked
    let pointData = this.getPointData()
    let formatConfig = pointData['format_config']
    formatConfig[name] = formatConfig[name] || {}
    formatConfig[name][subitem['name']] = checked
    this.setPointData({
      format_config: formatConfig
    })
  }

  handleSwitch = checked => {
    if (checked) {
      this.setPointData({ isGlobalAudio: checked })
    } else {
      this.setPointData({ isGlobalAudio: false })
    }
  }

  handleDraw = type => {
    const { pageIndex } = this.props
    let pointData = this.getPointData()

    this.setState({ selectNewAreaStyle: true })

    new DrawCustomArea({
      id: PRE_PAGE_ID + pageIndex,
      type: type,
      class: PRE_POINT_CLASS,
      drawDisabled: false,
      beforeDraw: () => {
        // 开始绘制，则禁用点击事件
        Event.emit(EVENT_NAMES.DISABLED_ADD_POINT, pageIndex)
      },
      callback: data => {
        this.setPointData({
          x: data.left / data.pWidth,
          y: data.top / data.pHeight,
          width: data.width / data.pWidth,
          height: data.height / data.pHeight,
          data: {
            ...pointData.data,
            areaType: type
          }
        })
      },
      drawEndCallback: () => {
        // 如果马上派发事件，则还是会触发点读背景页上的点击事件
        setTimeout(() => {
          this.setState({ selectNewAreaStyle: false })
          Event.emit(EVENT_NAMES.ENABLE_ADD_POINT, pageIndex)
        }, 100)
      }
    })
  }

  // 点读点类型选择
  renderItem = item => {
    let pointData = this.getPointData()
    let isActive = item.type === pointData.type
    return (
      <div
        className={classnames('custom-dd-grid-item', {
          'custom-dd-grid-item--active': isActive
        })}
      >
        <img src={isActive ? item.iconActive : item.icon} />
        <div>{item.text}</div>
      </div>
    )
  }

  renderType = () => {
    const pointData = this.getPointData()
    const CONFIG = [
      {
        title: '通用',
        list: POINT['POINT_TYPE']
      },
      {
        title: '图片特效',
        list: POINT['POINT_EFFECT_TYPE']
      },
      {
        title: '全程音频',
        type: 'global_audio'
      }
    ]

    return (
      <div className="tools__item tools__type">
        <h4>类型选择</h4>
        <div className="tools-item__content">
          {CONFIG.map((item, index) => {
            if (item.list) {
              return (
                <div className="tools-type__item" key={index}>
                  <h5>{item.title}</h5>
                  <Grid hasLine={false} renderItem={this.renderItem} data={item.list} onClick={this.handleSelectType} />
                </div>
              )
            } else {
              return (
                <div className="tools-type__item" key={index}>
                  <h5>{item.title}</h5>
                  <Switch
                    disabled={pointData.type !== 'audio'}
                    checked={pointData.isGlobalAudio}
                    onChange={this.handleSwitch}
                  />
                </div>
              )
            }
          })}
        </div>
      </div>
    )
  }

  // 格式设置
  renderFormat = () => {
    const { pageIndex, pointIndex } = this.props
    const pointData = this.getPointData()
    return (
      <FormatSetting
        pageIndex={pageIndex}
        pointIndex={pointIndex}
        pointData={pointData}
        callback={this.handleFormatCallback}
        onChecked={this.handleFormatCheckbox}
        getPointData={this.getPointData}
        setPointData={this.setPointData}
        form={this.props.form}
      />
    )
  }

  render() {
    const { pageIndex, pointIndex } = this.props
    let pointData = this.getPointData()
    return (
      <div className="pageitem__tools">
        <Tabs tabPosition="left" type="card">
          <Tabs.TabPane tab="类型选择" key={0}>
            {this.renderType()}
          </Tabs.TabPane>
          <Tabs.TabPane tab="内容上传" key={1}>
            {<RenderContent setPointData={this.setPointData} getPointData={this.getPointData} {...this.props} />}
          </Tabs.TabPane>
          <Tabs.TabPane tab="格式设置" key={2}>
            {this.renderFormat()}
          </Tabs.TabPane>
          <Tabs.TabPane tab="激发模式" key={3}>
            <Trigger
              pointId={`${pageIndex}_${pointIndex}`}
              pageIndex={pageIndex}
              form={this.props.form}
              selectNewAreaStyle={this.state.selectNewAreaStyle}
              pointData={pointData}
              setPointData={this.setPointData}
              handleDraw={this.handleDraw}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="动画设置" key={4}>
            <AnimationSetting {...this.props} getPointData={this.getPointData} setPointData={this.setPointData} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  }
}

export default Tools
