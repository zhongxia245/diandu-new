import './index.less'
import React, { Component } from 'react'
import classnames from 'classnames'

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

  handleSetTransparent = () => {
    this.setState({ value: 'transparent' })
    this.props.callback && this.props.callback('transparent')
  }

  render() {
    const { title, name, showTransparent } = this.props.config || {}
    return (
      <div className={classnames('color-item', this.props.className)}>
        <span>{title}</span>
        <input
          type="color"
          value={this.state.value || '#010101'}
          name={name}
          onChange={this.handleChange}
          onKeyUp={this.handleChange}
        />
        {showTransparent && <a onClick={this.handleSetTransparent}>透明</a>}
      </div>
    )
  }
}

export default ColorItem
