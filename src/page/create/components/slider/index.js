import './index.less'
import React, { Component } from 'react'
import { Slider } from 'antd-mobile'

class SliderItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value
    }
  }

  handleInputChange = e => {
    this.setState({ value: e.target.value })
    this.props.callback && this.props.callback(e.target.value)
  }

  onChange = value => {
    this.setState({ value: value })
    this.props.callback && this.props.callback(value)
  }

  render() {
    const { title, min, max, step } = this.props.config || {}
    let val = this.state.value
    return (
      <div className={`slider-item ${this.props.className}`}>
        <div className="slider-item__title">
          <p>{title}</p>
          <input type="number" value={val} step={step} onChange={this.handleInputChange} />
        </div>
        <Slider
          value={val}
          min={min}
          max={max}
          step={step}
          handleStyle={{
            borderColor: '#01ca97',
            backgroundColor: '#01ca97'
          }}
          onChange={this.onChange}
        />
      </div>
    )
  }
}

export default SliderItem
