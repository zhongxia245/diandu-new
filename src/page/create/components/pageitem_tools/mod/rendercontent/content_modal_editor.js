/**
 * 内容上传，
 * 渲染成编辑器[文本框使用，多页签文本框使用]
 */
import React, { Component } from 'react'
import { message, Button, Tabs } from 'antd'
import { DraftEditor, CustomAntdModal } from 'common/js/components'

class ContentModalEditor extends Component {
  handleShowModal = () => {
    CustomAntdModal.show({
      width: 900,
      title: '设置内容',
      footer: null,
      className: 'modal__content-editor',
      render: props => <ModalEditor {...this.props} {...props} />
    })
  }
  render() {
    return (
      <div className="content-button">
        <p>点击按钮，弹窗设置相关内容</p>
        <div className="u-btn u-white u-btn--green" onClick={this.handleShowModal}>
          点击设置多页签内容
        </div>
      </div>
    )
  }
}

class ModalEditor extends Component {
  constructor(props) {
    super(props)

    this.tabCount = 0
    let tabs = this.getInitTabs()
    this.state = {
      tabs: tabs,
      tabIndex: tabs[0]['key']
    }
  }

  getInitTabs = () => {
    const { getPointData } = this.props
    let pointData = getPointData()

    if (pointData && pointData.data && pointData.data.tabs) {
      let tabs = []
      pointData.data.tabs.map((item, index) => {
        tabs.push({ ...item, key: String(index) })
      })
      return tabs
    } else {
      return [{ key: '1', title: '选项卡1', content: '' }]
    }
  }

  getData = () => {
    const { tabs } = this.state
    for (let i = 0; i < tabs.length; i++) {
      let key = tabs[i]['key']
      let html = (this[`ref_editor${key}`] && this[`ref_editor${key}`].getHtml()) || tabs[i]['content']
      tabs[i]['content'] = html
    }
    return tabs
  }

  onChange = tabIndex => {
    this.setState({ tabIndex })
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey)
  }

  add = () => {
    let title = prompt('请输入新增页签标题')
    if (!title) return

    const tabs = this.state.tabs
    const tabIndex = `newTab${this.tabCount++}`
    tabs.push({ title: title, content: '', key: tabIndex })
    this.setState({ tabs, tabIndex })
  }

  remove = targetKey => {
    let tabIndex = this.state.tabIndex
    let lastIndex
    this.state.tabs.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1
      }
    })

    const tabs = this.state.tabs.filter(pane => pane.key !== targetKey)
    if (tabs.length && tabIndex === targetKey) {
      if (lastIndex >= 0) {
        tabIndex = tabs[lastIndex].key
      } else {
        tabIndex = tabs[0].key
      }
    }
    this.setState({ tabs, tabIndex })
  }

  // 修改页签标题
  handleUpdateTitle = targetKey => {
    let { tabIndex, tabs } = this.state
    // 点击是的当前页签，则修改标题
    if (tabIndex === targetKey) {
      let data = tabs[tabIndex]
      let title = prompt('请输入新的页面标题', data['title'])
      if (!title) return

      data['title'] = title
      this.setState({
        tabs: tabs
      })
    }
  }

  handleSubmit = () => {
    const { setPointData, getPointData, onOk } = this.props
    const pointData = getPointData()
    let data = this.getData()
    setPointData({
      data: {
        ...pointData.data,
        tabs: data
      }
    })
    onOk && onOk()
    message.success('保存成功')
  }

  render() {
    const { tabs, tabIndex } = this.state
    return (
      <div className="modal__mul-notes">
        <Tabs
          type="editable-card"
          onChange={this.onChange}
          onEdit={this.onEdit}
          activeKey={tabIndex}
          onTabClick={this.handleUpdateTitle}
        >
          {tabs.map(item => {
            return (
              <Tabs.TabPane tab={item['title']} key={item['key']}>
                <DraftEditor
                  html={item['content'] + ''}
                  ref={dom => {
                    this[`ref_editor${item['key']}`] = dom
                  }}
                />
              </Tabs.TabPane>
            )
          })}
        </Tabs>
        <div className="modal-mul-notes__footer">
          <Button type="primary" onClick={this.handleSubmit}>
            保存
          </Button>
        </div>
      </div>
    )
  }
}

export default ContentModalEditor
