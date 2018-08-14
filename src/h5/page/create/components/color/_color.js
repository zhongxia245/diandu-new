import './_color.less'
import React, { Component } from 'react'

class ColorItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value
    }
  }

  handleChange = e => {
    let color = e.target.value
    this.setState({ value: color })
    this.props.callback && this.props.callback(color)
  }
  render() {
    const { title, name } = this.props.config || {}
    return (
      <div className={`color-item ${this.props.className}`}>
        <div className="color-item__title">
          <span>{title}</span>
          <input
            type="color"
            value={this.state.value || '#010101'}
            name={name}
            onChange={this.handleChange}
            onKeyUp={this.handleChange}
          />
        </div>
      </div>
    )
  }
}

export default ColorItem
