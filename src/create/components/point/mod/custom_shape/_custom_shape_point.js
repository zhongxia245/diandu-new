import './_index.less'
import React, { Component } from 'react'
import classnames from 'classnames'
import Axios from 'axios'
import { ResizeControl } from '@/page/create/components/_index'

export default class CustomShapePoint extends Component {
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
          // 初始回显设置颜色
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

  render() {
    const {
      data,
      pageIndex,
      pointIndex,
      className,
      style,
      other,
      active,
      getPageItemBgAutoWH,
      ...otherProps
    } = this.props
    const { svgData } = this.state

    let autoWH = getPageItemBgAutoWH(other.baseInfo)

    let pointStyle = {
      ...style,
      left: data.x * autoWH.width,
      top: data.y * autoWH.height,
      width: data.width * autoWH.width,
      height: data.height * autoWH.height
      // backgroundImage: `url(${data.data.src})`   // 采用 svg 直接展示,这样可以替换颜色
    }

    // 使用 DOM 操作，设置 svg 颜色
    this.setSvgFillColor()

    return (
      <div
        ref={dom => {
          this.dom = dom
        }}
        {...otherProps}
        key={pointIndex}
        style={pointStyle}
        className={classnames(
          'point',
          `point__${pageIndex}_${pointIndex}`,
          'point__custom-shape',
          className,
          {
            'point--active': active
          }
        )}
        data-index={pointIndex}
      >
        {active ? <ResizeControl {...this.props} /> : ''}
        {svgData ? (
          <i dangerouslySetInnerHTML={{ __html: this.state.svgData }} />
        ) : (
          ''
        )}
      </div>
    )
  }
}
