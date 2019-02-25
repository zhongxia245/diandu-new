/**
 * 内容上传，
 * 渲染成编辑器[文本框使用，多页签文本框使用]
 */
import React, { Component } from 'react'
import { message } from 'antd'

class ContentInput extends Component {
  constructor(props) {
    super(props)
    let pointData = props.getPointData()
    let data = pointData.data || {}
    this.state = {
      link: data.link || ''
    }
  }

  handleChange = e => {
    let val = e.target.value
    this.setState({ link: val })
  }

  handleReset = () => {
    let pointData = this.props.getPointData()
    let link = (pointData.data && pointData.data.link) || ''
    this.setState({ link })
  }

  handleSubmit = () => {
    const { getPointData, setPointData } = this.props
    const { link } = this.state
    let pointData = getPointData()
    let data = pointData.data || {}

    setPointData({ data: { ...data, link: link } })
    message.success('保存超链接成功!')
  }

  render() {
    const { link } = this.state
    return (
      <div className="content-input">
        <p>超链接地址设置:</p>
        <input type="url" value={link} onChange={this.handleChange} placeholder="请输入超链接地址" />
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

export default ContentInput
