/**
 * 内容上传，
 * 渲染成编辑器[文本框使用，多页签文本框使用]
 */
import React, { Component } from 'react'
import { Toast, Tabs, Modal } from 'antd-mobile'

import CustomModal from 'common/js/components/_custom_modal.js'
import { DraftEditor } from 'common/js/components'

class ContentModalEditor extends Component {
  handleShowModal = () => {
    CustomModal.show({
      className: 'modal__content-editor',
      closable: true,
      maskClosable: false,
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
    this.state = {
      tabs: this.getInitTabs(),
      tabIndex: 0
    }
  }

  getInitTabs = () => {
    const { getPointData } = this.props
    let pointData = getPointData()
    let tabsData = (pointData.data && pointData.data.tabs) || [{ key: 0, title: '标题', content: '请输入内容' }]
    this.tabCount = tabsData[tabsData.length - 1]['key'] || tabsData.length
    return tabsData
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

  handleChangeTab = (tabData, tabIndex) => {
    let tabsData = this.getData()
    this.setState({
      tabIndex: tabIndex,
      tabs: tabsData
    })
  }

  handleDelCurrentTab = () => {
    const { tabIndex, tabs } = this.state
    let newTabs = JSON.parse(JSON.stringify(tabs))
    newTabs.splice(tabIndex, 1)
    this.setState({
      tabs: newTabs,
      tabIndex: tabIndex - 1 < 0 ? 0 : tabIndex - 1
    })
  }

  handleAddTab = () => {
    Modal.prompt('请输入新增页签标题', '', [
      { text: '取消' },
      {
        text: '添加',
        onPress: value => {
          let tabsData = this.getData()
          tabsData.push({ key: ++this.tabCount, title: value, content: '请输入内容' })
          console.log(tabsData)
          this.setState({
            tabs: tabsData
          })
        }
      }
    ])
  }

  // 修改页签标题
  handleUpdateTitle = (tabData, clickTabIndex) => {
    let { tabIndex } = this.state
    // 点击是的当前页签，则修改标题
    if (tabIndex === clickTabIndex) {
      let tabsData = this.getData()
      let data = tabsData[tabIndex] || {}
      Modal.prompt(
        '请输入新的页面标题',
        '',
        [
          ({ text: '取消' },
          {
            text: '保存',
            onPress: value => {
              data['title'] = value
              this.setState({
                tabs: tabsData
              })
            }
          })
        ],
        'default',
        data.title
      )
    }
  }

  handleSubmit = () => {
    const { setPointData, getPointData, onClose } = this.props
    const pointData = getPointData()
    let data = this.getData()
    setPointData({
      data: {
        ...pointData.data,
        tabs: data
      }
    })
    onClose && onClose()
    Toast.success('保存成功', 3, null, false)
  }

  render() {
    const { tabs } = this.state
    return (
      <div className="modal__mul-notes">
        <Tabs usePaged={false} tabs={tabs} onChange={this.handleChangeTab} onTabClick={this.handleUpdateTitle}>
          {tabs.map(item => {
            return (
              <div key={item['key']}>
                <DraftEditor
                  html={item['content'] + ''}
                  ref={dom => {
                    this[`ref_editor${item['key']}`] = dom
                  }}
                />
              </div>
            )
          })}
        </Tabs>
        <div className="modal-mul-notes__footer">
          {tabs.length > 1 ? (
            <div className="u-btn u-btn--red" onClick={this.handleDelCurrentTab}>
              删除本页
            </div>
          ) : (
            ''
          )}
          <div className="u-btn u-btn--green" onClick={this.handleAddTab}>
            添加选项卡
          </div>
          <div className="u-btn u-btn--green" onClick={this.handleSubmit}>
            保存
          </div>
        </div>
      </div>
    )
  }
}

export default ContentModalEditor