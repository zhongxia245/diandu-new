import React, { Component } from 'react'
import { Checkbox, Button } from 'antd'
import classnames from 'classnames'
import { ReactWebUploader, CustomAntdModal } from 'common/js/components'
import GlobalAudioSetting from './global_audio_setting'
import VideoPlayArea from './video_play_area'

class Trigger extends Component {
  showGlobalAudioModal = () => {
    const { form, pointData, pointIndex, pageIndex } = this.props
    CustomAntdModal.show({
      title: '设置全程音频时间节点',
      render: ({ onCancel, onOk }) => (
        <GlobalAudioSetting
          pointIndex={pointIndex}
          pageIndex={pageIndex}
          form={form}
          pointData={pointData}
          onOk={onOk}
          onCancel={onCancel}
        />
      )
    })
  }

  // 处理触发区域类型选择
  handleTypeCheckChange = (name, e) => {
    const { pointData } = this.props
    let data = pointData.data || {}
    let checked = e.target.checked
    data['triggerType'] = checked ? name : ''
    this.props.setPointData({ data })
  }

  // 处理自定义点模式，初始及运动还是静止
  handleStateCheckChange = (name, e) => {
    const { pointData } = this.props
    let data = pointData.data
    let checked = e.target.checked
    data['runType'] = checked ? name : ''
    this.props.setPointData({ data })
  }

  // 文本框和slider数据处理
  handleChange = (name, e) => {
    const { pointData } = this.props
    let data = pointData.data
    let val = e.target ? e.target.value : e
    data[name] = val
    this.props.setPointData({ data })
  }

  // 成功上传自定义图片
  handleUploadSuccessCustomImg = (file, path) => {
    const { pointData } = this.props
    let data = pointData.data
    data['customPath'] = path
    this.props.setPointData({ data })
  }

  // 设置播放区
  handleSetPlayArea = () => {
    const { form, pointData, pageIndex, setPointData } = this.props
    CustomAntdModal.show({
      title: '设置播放区',
      render: ({ onCancel, onOk }) => {
        return (
          <VideoPlayArea
            form={form}
            pageIndex={pageIndex}
            pointData={pointData}
            onCancel={onCancel}
            onOk={onOk}
            setPointData={setPointData}
          />
        )
      }
    })
  }

  renderCustomArea(data) {
    const { handleDraw } = this.props
    return (
      <div className="tools__trigger-content">
        <p className="u-green">直接在背景图片上绘制区域</p>
        <div className="tools__trigger-type-list">
          <div
            className={classnames('tools__trigger--rect', {
              'tools__trigger--active': data.areaType === 'rect'
            })}
            onClick={handleDraw.bind(this, 'rect')}
          />

          <div
            className={classnames('tools__trigger--square', {
              'tools__trigger--active': data.areaType === 'square'
            })}
            onClick={handleDraw.bind(this, 'square')}
          />

          <div
            className={classnames('tools__trigger--circle', {
              'tools__trigger--active': data.areaType === 'circle'
            })}
            onClick={handleDraw.bind(this, 'circle')}
          />
        </div>
        {this.props.selectNewAreaStyle && <p className="tools__draw_area_tip">现在可以在背景页上绘制新的区域样式</p>}
      </div>
    )
  }

  renderCustomPoint(data) {
    return (
      <div className="tools__trigger-content">
        <div className="tools__trigger-content-item">
          <p className="u-green">点读点注释文字</p>
          <p className="u-gray">（不超过10个字）</p>
          <input
            type="text"
            maxLength={10}
            value={data['customTitle']}
            onChange={this.handleChange.bind(this, 'customTitle')}
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
                uploadSuccess={this.handleUploadSuccessCustomImg}
              />
            </div>
            <span>请采用背景透明的png图片</span>
          </div>
        </div>
        <div className="tools__trigger-content-item">
          <Checkbox
            checked={data['runType'] === 'start_run'}
            className="trigger__checkbox"
            style={{ marginBottom: 10 }}
            onChange={this.handleStateCheckChange.bind(this, 'start_run')}
          >
            初始及运动
          </Checkbox>
          <Checkbox
            checked={data['runType'] === 'click_run'}
            className="trigger__checkbox"
            onChange={this.handleStateCheckChange.bind(this, 'click_run')}
          >
            初始及静止，点击后运动
          </Checkbox>
        </div>
      </div>
    )
  }

  render() {
    const { pointData } = this.props
    let data = pointData.data || {}

    let isGlobalAudio = pointData.isGlobalAudio

    return (
      <div className="tools__item tools__trigger">
        <h4>激发模式</h4>
        <div className="tools-item__content">
          {!isGlobalAudio && (
            <div className="tools__trigger-type">
              <Checkbox
                className="trigger__checkbox"
                checked={data.triggerType === 'area'}
                onChange={this.handleTypeCheckChange.bind(this, 'area')}
              >
                区域
              </Checkbox>
              <Checkbox
                className="trigger__checkbox"
                checked={data.triggerType === 'point'}
                onChange={this.handleTypeCheckChange.bind(this, 'point')}
              >
                点
              </Checkbox>
            </div>
          )}

          {data.triggerType === 'area' && this.renderCustomArea(data)}

          {data.triggerType === 'point' && this.renderCustomPoint(data)}

          {pointData.type === 'video' && (
            <Button type="primary" onClick={this.handleSetPlayArea}>
              设置播放区
            </Button>
          )}

          {pointData.isGlobalAudio && (
            <Button type="primary" onClick={this.showGlobalAudioModal}>
              设置全程音频节点
            </Button>
          )}
        </div>
      </div>
    )
  }
}

export default Trigger
