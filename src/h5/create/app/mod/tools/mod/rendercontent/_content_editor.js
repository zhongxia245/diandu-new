/**
 * 内容上传，
 * 渲染成编辑器[文本框使用，多页签文本框使用]
 */
import React, { Component } from 'react'
import { DraftEditor } from 'common/js/components'
import { Toast } from 'antd-mobile'

class ContentEditor extends Component {
  constructor(props) {
    super(props)
    let pointData = props.getPointData()
    let data = pointData.data || {}
    this.state = {
      html: data.content || ''
    }
  }

  handleReset = () => {
    let pointData = this.props.getPointData()
    let content = (pointData.data && pointData.data.content) || ''
    this.setState({
      html: content
    })
  }

  handleSubmit = () => {
    const { getPointData, setPointData } = this.props
    let pointData = getPointData()
    let data = pointData.data || {}
    let html = this.refs.ref_editor.getHtml()
    if (typeof html === 'string') {
      setPointData({ data: { ...data, content: html } })
      this.setState({
        html: html
      })
      Toast.success('保存注解信息成功!', 2, null, false)
    }
  }

  render() {
    const { html } = this.state
    return (
      <div className="content-editor">
        <DraftEditor html={html} ref="ref_editor" />
        <div className="content-footer__btns">
          <div className="u-btn" onClick={this.handleReset}>
            重置
          </div>
          <div className="u-btn u-btn--green" onClick={this.handleSubmit}>
            保存
          </div>
        </div>
      </div>
    )
  }
}

export default ContentEditor
