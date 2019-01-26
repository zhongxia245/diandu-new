/**
 * 点读页面工具栏
 * TODO:需要拆分代码，否则代码有点多了
 */
import './index.less'
import React, { Component } from 'react'
import classnames from 'classnames'
import { Tabs, Grid, Switch, Checkbox } from 'antd-mobile'
import { ReactWebUploader } from 'common/js/components'
import { SliderItem, ColorItem } from '@/page/create/components/_index'

import { POINT, TOOLS_TABS, PRE_PAGE_ID, PRE_POINT_CLASS, EVENT_NAMES, getFormatConfigByType } from '@/config'
import { DrawCustomArea } from '@/page/create/utils/draw/_index'
import Event from 'common/js/event.js'
import RenderContent from './mod/rendercontent'
import { AnimationSetting } from './mod/toolitem'

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

  handleSwitch = (item, checked) => {
    if (checked) {
      this.setPointData({ type: item.type })
    } else {
      this.setPointData({ type: '' })
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
        className={classnames('am-grid-item-inner-content', {
          'tools-type__item--active': isActive
        })}
      >
        <img className="am-grid-icon" src={isActive ? item.iconActive : item.icon} />
        <div className="am-grid-text">{item.text}</div>
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
                  <Grid
                    hasLine={false}
                    renderItem={this.renderItem}
                    activeClassName="tools-type__item--active"
                    data={item.list}
                    onClick={this.handleSelectType}
                  />
                </div>
              )
            } else {
              return (
                <div className="tools-type__item" key={index}>
                  <h5>{item.title}</h5>
                  <Switch checked={pointData.type === item.type} onChange={this.handleSwitch.bind(this, item)} />
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
    const CONFIG = getFormatConfigByType(pointData.type) || []
    const formatConfig = pointData['format_config'] || {}
    return (
      <div className="tools__item">
        <h4>格式设置</h4>
        <div className="tools-item__content">
          {CONFIG.map((item, index) => {
            // 区域模式， 不能设置点读点的缩放比例
            if (pointData['data'] && pointData['data']['triggerType'] === 'area' && item['name'] === 'point_scale') {
              return
            }
            let key = `${item.name}_${pageIndex}_${pointIndex}`
            let value = formatConfig[item.name] || item['defaultValue']

            switch (item.type) {
              // 滑块组件
              case POINT.POINT_FORMAT_TYPE.SLIDER:
                return (
                  <SliderItem
                    className="format-config__item"
                    config={item}
                    key={key}
                    value={value}
                    callback={this.handleFormatCallback.bind(this, item)}
                  />
                )
              // 颜色选择组件
              case POINT.POINT_FORMAT_TYPE.COLOR:
                return (
                  <ColorItem
                    className="format-config__item"
                    config={item}
                    key={key}
                    value={value}
                    callback={this.handleFormatCallback.bind(this, item)}
                  />
                )
              // 按钮组件
              case POINT.POINT_FORMAT_TYPE.BUTTON:
                return (
                  <div
                    key={key}
                    className="format-config__item u-btn u-btn--green"
                    onClick={() => {
                      Event.emit(item.event, {
                        getPointData: this.getPointData,
                        setPointData: this.setPointData
                      })
                    }}
                  >
                    {item.title}
                  </div>
                )
              case POINT.POINT_FORMAT_TYPE.SELECT:
                return (
                  <div className="select__item format-config__item">
                    <span> {item['title']}</span>
                    <select onChange={this.handleFormatCallback.bind(this, item)}>
                      {item['values'].map((subItem, subIndex) => {
                        return (
                          <option value={subItem['value']} key={subIndex} selected={subIndex === value}>
                            {subItem['key']}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                )
              case POINT.POINT_FORMAT_TYPE.CHECKBOX_LIST:
                let configs = item['configs'] || []
                return (
                  <div className="checkbox-list__item format-config__item">
                    {configs.map((subitem, subindex) => {
                      return (
                        <label key={subindex}>
                          <input
                            type="checkbox"
                            checked={value && value[subitem['name']]}
                            onChange={this.handleFormatCheckbox.bind(this, item['name'], subitem)}
                          />
                          <span>{subitem['title']}</span>
                        </label>
                      )
                    })}
                  </div>
                )
            }
          })}
        </div>
      </div>
    )
  }

  // 触发模式
  renderTrigger = () => {
    const pointData = this.getPointData()
    let data = pointData.data || {}

    // 处理触发区域类型选择
    const handleTypeCheckChange = (name, e) => {
      let checked = e.target.checked
      data['triggerType'] = checked ? name : ''
      this.setPointData({ data })
    }

    // 处理自定义点模式，初始及运动还是静止
    const handleStateCheckChange = (name, e) => {
      let checked = e.target.checked
      data['runType'] = checked ? name : ''
      this.setPointData({ data })
    }

    // 文本框和slider数据处理
    const handleChange = (name, e) => {
      let val = e.target ? e.target.value : e
      data[name] = val
      this.setPointData({ data })
    }

    const handleUploadSuccessCustomImg = (file, path) => {
      data['customPath'] = path
      this.setPointData({ data })
    }

    const renderCustomArea = () => {
      return (
        <div className="tools__trigger-content">
          <p className="u-green">直接在背景图片上绘制区域</p>
          <div className="tools__trigger-type-list">
            <div
              className={classnames('tools__trigger--rect', {
                'tools__trigger--active': data.areaType === 'rect'
              })}
              onClick={this.handleDraw.bind(this, 'rect')}
            />

            <div
              className={classnames('tools__trigger--square', {
                'tools__trigger--active': data.areaType === 'square'
              })}
              onClick={this.handleDraw.bind(this, 'square')}
            />

            <div
              className={classnames('tools__trigger--circle', {
                'tools__trigger--active': data.areaType === 'circle'
              })}
              onClick={this.handleDraw.bind(this, 'circle')}
            />
          </div>
          {this.state.selectNewAreaStyle ? (
            <p className="tools__draw_area_tip">现在可以在背景页上绘制新的区域样式</p>
          ) : null}
        </div>
      )
    }

    const renderCustomPoint = () => {
      return (
        <div className="tools__trigger-content">
          <div className="tools__trigger-content-item">
            <p className="u-green">点读点注释文字</p>
            <p className="u-gray">（不超过10个字）</p>
            <input
              type="text"
              maxLength={10}
              value={data['customTitle']}
              onChange={handleChange.bind(this, 'customTitle')}
            />
          </div>
          <div className="tools__trigger-content-item">
            <p className="u-green">自定义点读点按钮图案</p>
            <div className="tools__trigger-upload">
              <div className="tools__trigger-upload-img">
                <div className="tools__trigger-upload-tip">
                  {data['customPath'] ? <img src={data['customPath']} /> : '上传图片'}
                </div>
                <ReactWebUploader
                  id={`btn_upload_custom_img_${this.props.pageIndex}`}
                  className="tools__trigger-webuploader"
                  uploadSuccess={handleUploadSuccessCustomImg}
                />
              </div>
              <span>请采用背景透明的png图片</span>
            </div>
          </div>
          <div className="tools__trigger-content-item">
            <Checkbox
              checked={data['runType'] === 'start_run'}
              className="trigger__checkbox"
              onChange={handleStateCheckChange.bind(this, 'start_run')}
            >
              初始及运动
            </Checkbox>
            <Checkbox
              checked={data['runType'] === 'click_run'}
              className="trigger__checkbox"
              onChange={handleStateCheckChange.bind(this, 'click_run')}
            >
              初始及静止，点击后运动
            </Checkbox>
          </div>
        </div>
      )
    }

    return (
      <div className="tools__item tools__trigger">
        <h4>激发模式</h4>
        <div className="tools-item__content">
          <div className="tools__trigger-type">
            <Checkbox
              className="trigger__checkbox"
              checked={data.triggerType === 'area'}
              onChange={handleTypeCheckChange.bind(this, 'area')}
            >
              区域
            </Checkbox>
            <Checkbox
              className="trigger__checkbox"
              checked={data.triggerType === 'point'}
              onChange={handleTypeCheckChange.bind(this, 'point')}
            >
              点
            </Checkbox>
          </div>
          {data.triggerType === 'area' ? renderCustomArea() : ''}
          {data.triggerType === 'point' ? renderCustomPoint() : ''}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="pageitem__tools">
        <Tabs animated={false} useOnPan={false} tabs={TOOLS_TABS} tabBarPosition="left" tabDirection="vertical">
          {this.renderType()}
          <RenderContent setPointData={this.setPointData} getPointData={this.getPointData} {...this.props} />
          {this.renderFormat()}
          {this.renderTrigger()}
          <AnimationSetting {...this.props} getPointData={this.getPointData} setPointData={this.setPointData} />
        </Tabs>
      </div>
    )
  }
}

export default Tools
