/**
 * 内容上传，
 * 渲染成编辑器[文本框使用，多页签文本框使用]
 */
import React, { Component } from 'react'
import { showExamModal } from '@/page/create/components/exam/_index'
import { Toast } from 'antd-mobile'

class ContentModalExam extends Component {
  handleSubmit = questions => {
    const { getPointData, setPointData } = this.props
    let pointData = getPointData()
    let data = pointData.data || {}
    setPointData({ data: { ...data, questions: questions } })
    Toast.success('保存测试数据成功!', 2, null, false)
  }

  getData = () => {
    const { getPointData } = this.props
    let pointData = getPointData()
    pointData.data = pointData.data || {}
    let questions = pointData.data.questions || []
    return questions
  }

  handleShowModal = () => {
    let questions = this.getData()
    showExamModal({ questions: questions, onSubmit: this.handleSubmit })
  }

  render() {
    let questions = this.getData()
    return (
      <div className="content-button">
        <p>点击按钮，弹窗设置测试内容</p>
        <div
          className="u-btn u-white u-btn--green"
          onClick={this.handleShowModal}
        >
          {`点击${questions.length > 0 ? '修改' : '设置'}测试内容`}
        </div>
      </div>
    )
  }
}

export default ContentModalExam
