// 可以改成一个无状态组件

import './index.less'
import React, { Component } from 'react'
import classnames from 'classnames'

class Grid extends Component {
  onClick = activeIndex => {
    const { onClick, data } = this.props
    if (activeIndex >= data.length) return
    onClick && onClick(data[activeIndex], activeIndex)
  }

  renderGridItem(key, item) {
    const { renderItem } = this.props

    if (!item) {
      return <div key={key} className="dd-grid-item" />
    }

    const { src, text } = item

    return (
      <div key={key} className="dd-grid-item" onClick={this.onClick.bind(this, key)}>
        {renderItem ? (
          renderItem(item)
        ) : (
          <React.Fragment>
            <img src={src} alt="icon" />
            <div>{text}</div>
          </React.Fragment>
        )}
      </div>
    )
  }

  renderFlexBox(rowNum) {
    const { columnNum, data } = this.props

    let jsx = []
    for (let i = 0; i < columnNum; i++) {
      let key = rowNum * columnNum + i
      let item = data[key]
      jsx.push(this.renderGridItem(key, item))
    }
    return (
      <div key={rowNum} className="dd-flexbox">
        {jsx}
      </div>
    )
  }

  render() {
    const { data, columnNum, hasLine } = this.props
    let rowsCount = Math.ceil(data.length / columnNum)

    let jsx = []
    for (let i = 0; i < rowsCount; i++) {
      jsx.push(this.renderFlexBox(i))
    }
    return <div className={classnames('dd-grid', { 'dd-grid-border': hasLine })}>{jsx}</div>
  }
}

Grid.defaultProps = {
  hasLine: true,
  columnNum: 4,
  renderItem: null,
  activeClassName: '',
  data: [],
  onClick: () => {}
}

export default Grid
