import './index.less'
import React, { Component } from 'react'
import { Slider, Button, Radio } from 'antd'

const marks = {
  50: {
    label: <div className="pgs__point-size pgs__point-size--50">25px</div>
  },
  100: {
    label: <div className="pgs__point-size">50px</div>
  },
  200: {
    label: <div className="pgs__point-size pgs__point-size--200">100px</div>
  }
}

class GlobalPageSetting extends Component {
  constructor(props) {
    super(props)
    const { getFieldValue } = this.props.form
    let data = getFieldValue('globalSetting') || {}
    this.state = {
      pageBgColor: data.pageBgColor || '#000000',
      pointSizeScale: data.pointSizeScale || 100,
      swiperEffect: data.swiperEffect || 'slide'
    }
  }

  handleChange = (name, e) => {
    let val = e.target ? e.target.value : e
    this.setState({ [name]: val })
  }

  onSubmit = () => {
    const { onCancel, form } = this.props
    const { setFieldsValue } = form
    setFieldsValue({ globalSetting: this.state })
    onCancel && onCancel()
  }

  tipFormatter = val => {
    return `${val}%`
  }

  renderPageTab() {
    const { pageBgColor, pointSizeScale } = this.state
    return (
      <React.Fragment>
        <div className="global-page-setting__item">
          <h4>1. 请设置点读点大小的默认比例(%)</h4>
          <p>(在点读页中可单独对点读点设置大小)</p>
          <Slider
            defaultValue={pointSizeScale}
            max={200}
            min={50}
            step={25}
            marks={marks}
            tipFormatter={this.tipFormatter}
            onChange={this.handleChange.bind(this, 'pointSizeScale')}
          />
        </div>
        <div className="global-page-setting__item">
          <h4>2. 请设置点读页外空白区域的颜色</h4>
          <input type="color" value={pageBgColor} onChange={this.handleChange.bind(this, 'pageBgColor')} />
        </div>
      </React.Fragment>
    )
  }

  renderSwitchAnimation() {
    const { swiperEffect } = this.state
    const ANIMATIONS = [
      { name: '位移切换', value: 'slide' },
      { name: '淡入淡出', value: 'fade' },
      { name: '3d流', value: 'coverflow' },
      // { name: '立方体', value: 'cube' },
      { name: '3d翻转', value: 'flip' }
    ]
    return (
      <React.Fragment>
        <div className="global-page-setting__item">
          <h4>3. 请设置点读页切换时的特效模式</h4>
          <Radio.Group value={swiperEffect} onChange={this.handleChange.bind(this, 'swiperEffect')}>
            {ANIMATIONS.map((item, index) => (
              <Radio key={index} value={item['value']}>
                {item['name']}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      </React.Fragment>
    )
  }

  render() {
    return (
      <div className="global-page-setting">
        {this.renderPageTab()}
        {this.renderSwitchAnimation()}
        <div className="global-page-setting__footer">
          <Button type="default" onClick={this.props.onCancel}>
            取消
          </Button>
          <Button type="primary" onClick={this.onSubmit}>
            保存
          </Button>
        </div>
      </div>
    )
  }
}

export default GlobalPageSetting
