/**
 * 内容上传，
 * 渲染成编辑器[文本框使用，多页签文本框使用]
 */
import React, { Component } from 'react'

import CustomModal from 'common/js/components/custom_modal.js'

class ContentButton extends Component {
  handleShowModal = () => {
    CustomModal.show({ render: prpos => <div>Hello Modal!</div> })
  }
  render() {
    return (
      <div className="content-button">
        <p>点击按钮，弹窗设置相关内容</p>
        <div className="u-btn u-white u-btn--green" onClick={this.handleShowModal}>
          点击设置内容
        </div>
      </div>
    )
  }
}

export default ContentButton
