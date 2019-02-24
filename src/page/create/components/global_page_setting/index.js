import './index.less'
import React, { Component } from 'react'
import { Slider, Button } from 'antd'

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
      pointSizeScale: data.pointSizeScale || 100
    }
  }

  handleChangeColor = e => {
    let val = e.target.value
    this.setState({ pageBgColor: val })
  }

  handleChange = val => {
    this.setState({ pointSizeScale: val })
  }

  onSubmit = () => {
    const { onCancel, form } = this.props
    const { setFieldsValue, getFieldsValue } = form
    setFieldsValue({ globalSetting: this.state })
    console.log(getFieldsValue())
    onCancel && onCancel()
  }

  tipFormatter = val => {
    return `${val}%`
  }

  render() {
    const { pageBgColor, pointSizeScale } = this.state

    return (
      <div className="global-page-setting">
        <div className="global-page-setting__item">
          <h4>1. 请设置点读点大小的默认比例(%)</h4>
          <p>(在点读页中可单独对点读点设置大小)</p>
          <Slider
            defaultValue={pointSizeScale}
            max={200}
            min={50}
            marks={marks}
            tipFormatter={this.tipFormatter}
            onChange={this.handleChange}
          />
        </div>
        <div className="global-page-setting__item">
          <h4>2. 请设置点读页外空白区域的颜色</h4>
          <input type="color" value={pageBgColor} onChange={this.handleChangeColor} />
        </div>
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
