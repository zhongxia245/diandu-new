import './_index.less'
import React, { Component } from 'react'
import classnames from 'classnames'
import Axios from 'axios'
import { getFormatConfigStyle } from '@create/config/_index'

class CustomShape extends Component {
  constructor(props) {
    super(props)
    this.state = {
      svgData: ''
    }
    this.dom = null
  }

  componentDidMount() {
    const { data } = this.props
    if (data.data && data.data.src) {
      Axios.get(data.data.src).then(result => {
        this.setState({ svgData: result.data }, () => {
          // 设置颜色，需要等 svg 渲染出来后在设置
          this.setSvgFillColor()
        })
      })
    }
  }

  setSvgFillColor = () => {
    const { data } = this.props
    const { format_config = {} } = data

    if (format_config['fill_color']) {
      $(this.dom)
        .find('path,use')
        .css({
          fill: format_config['fill_color']
        })
    }
  }

  getPointPosition = () => {
    const { data } = this.props
    let formatStyle = getFormatConfigStyle(data)

    return {
      ...formatStyle,
      left: `${data.x * 100}%`,
      top: `${data.y * 100}%`
    }
  }

  render() {
    const { svgData } = this.state
    const { data, children } = this.props

    // 自定义区域，则不需要缩放，因为存放的大小是百分比的大小，不是固定的数值
    let style = {
      width: `${data.width * 100}%`,
      height: `${data.height * 100}%`,
      ...this.getPointPosition()
    }

    return (
      <div
        ref={dom => {
          this.dom = dom
        }}
        className={classnames('point', `point--${data.type}`)}
        style={style}
        // onClick={this.handleClickPoint.bind(this, data, pointIndex)}
      >
        {children}
        {svgData ? <i dangerouslySetInnerHTML={{ __html: svgData }} /> : ''}
      </div>
    )
  }
}

export default CustomShape
