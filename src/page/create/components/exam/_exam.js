import './_exam.less'
import React, { Component } from 'react'
import { Icon, message } from 'antd'

class Exam extends Component {
  constructor(props) {
    super(props)

    let questions = [
      {
        type: 0, // 0 单选题  1 多选题  2 判断题
        question: '',
        answerIndex: null,
        answers: ['', '', '', '']
      }
    ]
    if (props.questions && props.questions.length > 0) {
      questions = props.questions
    }

    this.state = {
      currentIndex: 0,
      questions: questions
    }
  }

  handleChangeTextarea = e => {
    const { currentIndex, questions } = this.state
    let val = e.target.value
    questions[currentIndex]['question'] = val
    this.setState({
      questions
    })
  }

  handleChangeInput = (index, e) => {
    const { currentIndex, questions } = this.state
    let val = e.target.value
    questions[currentIndex]['answers'][index] = val
    this.setState({
      questions
    })
  }

  handleChangeAnswerIndex = (index, e) => {
    const { currentIndex, questions } = this.state
    let questionType = questions[currentIndex]['type']
    let checked = e.target.checked

    // 复选框，则打答案存到数组中
    if (questionType === 1) {
      if (checked) {
        questions[currentIndex]['answerIndex'].push(index)
      } else {
        questions[currentIndex]['answerIndex'].splice(questions[currentIndex]['answerIndex'].indexOf(index), 1)
      }
    } else {
      questions[currentIndex]['answerIndex'] = index
    }
    this.setState({ questions })
  }

  handleChangeQuestionType = e => {
    const { currentIndex, questions } = this.state
    let type = e.target.selectedIndex
    questions[currentIndex]['type'] = type
    questions[currentIndex]['answerIndex'] = null

    // 判断题，则修改答案选项
    if (type === 2) {
      questions[currentIndex]['answers'] = ['对（True）', '错（False）']
    } else {
      questions[currentIndex]['answers'] = ['', '', '', '']
    }

    // 复选框，则把正确答案的值设置成数组
    if (type === 1) {
      questions[currentIndex]['answerIndex'] = []
    }

    this.setState({ questions })
  }

  handlePrePage = () => {
    let { currentIndex } = this.state
    currentIndex = currentIndex - 1 < 0 ? 0 : currentIndex - 1
    this.setState({ currentIndex })
  }

  handleNextPage = () => {
    let { currentIndex, questions } = this.state
    currentIndex = currentIndex + 1 >= questions.length ? questions.length - 1 : currentIndex + 1
    this.setState({ currentIndex })
  }

  handleAddQuestion = () => {
    let { questions, currentIndex } = this.state
    questions.push({
      type: 0,
      question: '',
      answerIndex: 0,
      answers: ['', '', '', '']
    })
    this.setState({ questions, currentIndex: currentIndex + 1 })
  }

  handleDelQuestion = () => {
    let { questions, currentIndex } = this.state
    if (questions.length > 1) {
      questions.splice(currentIndex, 1)
      this.setState({
        questions,
        currentIndex: currentIndex - 1 < 0 ? 0 : currentIndex - 1
      })
    } else {
      message.info('至少需要有一个题目')
    }
  }

  handleAddAnswerItem = () => {
    const { currentIndex, questions } = this.state
    questions[currentIndex]['answers'].push('')
    this.setState(
      {
        questions
      },
      () => {
        this.answers.scrollTop = this.answers.scrollHeight
      }
    )
  }

  handleSubmit = () => {
    const { questions } = this.state
    this.props.onSubmit && this.props.onSubmit(questions)
    this.props.onOk && this.props.onOk()
  }

  renderAnswer(data) {
    const { currentIndex } = this.state
    const { type, answers, answerIndex } = data

    return (
      <ul
        className="answers"
        ref={dom => {
          this.answers = dom
        }}
      >
        {answers.map((item, index) => {
          let placeholder = '输入选项'
          if (index >= 2) {
            placeholder = `输入选项，少于${index + 1}个请留空`
          }

          // 复选框，则判断答案是否在数组里面
          let checked =
            type === 1 ? Array.isArray(answerIndex) && answerIndex.indexOf(index) !== -1 : answerIndex === index
          return (
            <li key={`${currentIndex}_${index}`}>
              <input
                name={type === 1 ? `checkbox_answer_${currentIndex}_${index}` : 'radio_answer'}
                type={type === 1 ? 'checkbox' : 'radio'}
                onClick={this.handleChangeAnswerIndex.bind(this, index)}
                checked={checked}
              />
              <textarea
                type="text"
                placeholder={placeholder}
                value={item}
                onChange={this.handleChangeInput.bind(this, index)}
              />
            </li>
          )
        })}
      </ul>
    )
  }

  renderQuestionItem(data) {
    return (
      <div className="question-item">
        <textarea placeholder="请输入题干" value={data.question} onChange={this.handleChangeTextarea} />
        {this.renderAnswer(data)}
      </div>
    )
  }

  renderQuestions() {
    const { questions, currentIndex } = this.state
    let questionItemData = questions[currentIndex]
    return this.renderQuestionItem(questionItemData)
  }

  renderHeader() {
    const { questions, currentIndex } = this.state
    let questionType = questions[currentIndex]['type']
    return (
      <div className="exam__header">
        <Icon type="left" style={{ marginRight: 0 }} onClick={this.handlePrePage} />
        <span>
          {currentIndex + 1}/{questions.length}
        </span>
        <Icon type="right" onClick={this.handleNextPage} />
        <Icon type="plus" className="u-padding-6 u-btn-bg" onClick={this.handleAddQuestion} />
        <Icon type="close" className="u-btn-bg" onClick={this.handleDelQuestion} />

        <select name="questioinType" onChange={this.handleChangeQuestionType}>
          <option value={0} selected={questionType === 0}>
            单选题
          </option>
          <option value={1} selected={questionType === 1}>
            多选题
          </option>
          <option value={2} selected={questionType === 2}>
            判断题
          </option>
        </select>
      </div>
    )
  }

  renderFooter() {
    return (
      <div className="exam__footer">
        <div className="exam__btn" style={{ width: '70%', marginLeft: '30%' }} onClick={this.handleAddAnswerItem}>
          新增选项
        </div>
        <div className="exam__btn" onClick={this.handleSubmit}>
          提交
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="exam">
        {this.renderHeader()}
        {this.renderQuestions()}
        {this.renderFooter()}
      </div>
    )
  }
}

export default Exam
