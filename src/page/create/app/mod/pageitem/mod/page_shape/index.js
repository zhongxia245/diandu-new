import './index.less'
import React, { Component } from 'react'
import classnames from 'classnames'
import { Tabs } from 'antd-mobile'
import { common, shapes, category } from './config'

const TABS_CONFIG = [{ title: '共享资源' }, { title: '我的资源' }]

class PageShape extends Component {
  constructor(props) {
    super(props)
    this.state = {
      common: common,
      shapes: shapes,
      currentCommonCategory: ''
    }
  }

  // isShareList 是否为共享图片
  handleCategory = (item, isShareList) => {
    if (isShareList) {
      if (!item['category']) {
        this.setState({
          common: common,
          currentCommonCategory: item['category']
        })
      } else {
        let newList = []
        for (let i = 0; i < common.length; i++) {
          if (common[i]['category'] === item['category']) {
            newList.push(common[i])
          }
        }
        this.setState({
          common: newList,
          currentCommonCategory: item['category']
        })
      }
    }
  }

  handleInsertShape = item => {
    console.log('插入图片11')
    this.props.onClose && this.props.onClose()
    this.props.callback && this.props.callback(item)
  }

  renderList(data = []) {
    if (data.length === 0) {
      return <h3 className="page-shape-list__empty">暂无数据</h3>
    }
    return (
      <ul className="page-shape__list">
        {data.map((item, index) => {
          return (
            <li key={index}>
              <img src={item.src} alt={item.alt} title={item.desc} />
              <div
                className="page-shape-list__btn u-btn--green"
                onClick={this.handleInsertShape.bind(this, item)}
              >
                插入
              </div>
            </li>
          )
        })}
      </ul>
    )
  }
  renderImgs() {
    const { common, currentCommonCategory } = this.state
    return (
      <div className="page-shape__imgs">
        <ul className="page-share__category">
          {category.map((item, index) => {
            return (
              <li
                className={classnames({
                  'category--active': currentCommonCategory === item['category']
                })}
                key={index}
                onClick={this.handleCategory.bind(this, item, true)}
              >
                {item['title']}
              </li>
            )
          })}
        </ul>
        {this.renderList(common)}
      </div>
    )
  }
  renderShape() {
    const { shapes } = this.state
    return <div className="page-shape__shape">{this.renderList(shapes)}</div>
  }
  render() {
    return (
      <div className="page-shape">
        <Tabs tabs={TABS_CONFIG} tabBarPosition="left" animated={false}>
          {this.renderImgs()}
          {this.renderShape()}
        </Tabs>
      </div>
    )
  }
}

export default PageShape
