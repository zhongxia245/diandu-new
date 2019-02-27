/**
 * TODO:目前注释掉了分组，但是数据中默认还是保存着分组信息
 */
import './index.less'
import React, { Component } from 'react'
import classnames from 'classnames'
import { message, Modal, Empty, Button } from 'antd'

class PageTplList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectIndex: ''
    }
  }

  handleSelectTpl = index => {
    this.setState({
      selectIndex: index
    })
  }

  handleSubmitTpl = () => {
    const { data, setPageData, getPageData } = this.props
    const { selectIndex } = this.state

    if (selectIndex !== '') {
      let pageData = JSON.parse(data[selectIndex]['data'] || '{}')
      // 如果当前点读页有内容，则提示是否覆盖，否则则直接覆盖
      let oldPageData = getPageData()
      if (oldPageData && oldPageData.baseInfo && oldPageData.baseInfo.bgSrc) {
        Modal.confirm({
          title: '模板选择提示',
          content: '当前点读页已有内容，是否覆盖?',
          cancelText: '取消',
          okText: '覆盖',
          onOk: () => {
            setPageData(pageData)
            this.props.onOk && this.props.onOk()
          }
        })
      } else {
        setPageData(pageData)
        this.props.onOk && this.props.onOk()
      }
    } else {
      message.info('请选择一个点读页模板')
    }
  }

  render() {
    const { data = [], onClose } = this.props
    const { selectIndex } = this.state
    const hasContent = data.length !== 0
    return (
      <div className="page-tpl-list">
        {hasContent ? (
          <ul>
            {data.map((item, index) => {
              return (
                <li
                  key={index}
                  className={classnames({
                    'page-tpl-list__item--active': selectIndex === index
                  })}
                  onClick={this.handleSelectTpl.bind(this, index)}
                >
                  <img src={item.pic} />
                  <p>{item.name}</p>
                </li>
              )
            })}
          </ul>
        ) : (
          <Empty />
        )}

        <div className="page-tpl-list__footer">
          <Button onClick={onClose} style={{ marginRight: '15px' }}>
            取消
          </Button>
          <Button type="primary" onClick={this.handleSubmitTpl}>
            确定
          </Button>
        </div>
      </div>
    )
  }
}

export default PageTplList
