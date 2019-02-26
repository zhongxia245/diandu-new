import React, { Component } from 'react'
import classnames from 'classnames'
import Swiper from 'swiper/dist/js/swiper.js'
import Event from 'common/js/event.js'
import { isMobile } from 'common/js/utils/user_agent.js'
import CustomModal from 'common/js/components/custom_modal.js'
import { EVENT_NAME } from '../common/const'

Event.on(EVENT_NAME.MODAL_TEST_SHOW, pointData => {
  let questions = (pointData.data && pointData.data.questions) || []

  CustomModal.show({
    maskClosable: false,
    wrapClassName: 'modal__test',
    render: prpos => <Test {...prpos} data={questions} />
  })
})

/**
 * 测试点读点
 */
class Test extends Component {
  constructor(props) {
    super(props)
    this.swiper = null
    this.state = {
      selectAnswers: [],
      showAnswer: false,
      showInfo: false
    }
  }

  initSwiper = () => {
    let swiperOptions = {
      keyboard: false,
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction'
      },
      effect: 'slide'
    }

    // PC需要前进后退按钮
    if (!isMobile()) {
      swiperOptions.navigation = {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        noSwiping: true
      }
    }
    this.swiper = new Swiper(
      '.modal__questions .swiper-container',
      swiperOptions
    )
  }

  componentDidMount() {
    this.initSwiper()
  }

  handleSelectAnswer = (questionIndex, answerIndex, isCheckbox, e) => {
    // PC 端 onChange 会触发两次， label 一次，input 一次,因此这样处理一下
    if (e.target.tagName === 'INPUT') {
      let { selectAnswers } = this.state
      if (isCheckbox) {
        selectAnswers[questionIndex] = selectAnswers[questionIndex] || []
        if (selectAnswers[questionIndex].indexOf(answerIndex) !== -1) {
          let arrIndex = selectAnswers[questionIndex].indexOf(answerIndex)
          selectAnswers[questionIndex].splice(arrIndex, 1)
        } else {
          selectAnswers[questionIndex].push(answerIndex)
        }
      } else {
        selectAnswers[questionIndex] = answerIndex
      }
      this.setState({ selectAnswers })
    }
  }

  handleShowAnswer = () => {
    this.setState({ showAnswer: !this.state.showAnswer })
  }

  handleShowInfo = () => {
    this.setState({ showInfo: !this.state.showInfo })
  }

  handleGoto = index => {
    this.setState({ showInfo: false }, () => {
      this.swiper.slideTo(index)
    })
  }

  renderQuestion() {
    const { data } = this.props
    const { showAnswer, selectAnswers } = this.state
    return (
      <div className="swiper-container">
        <div className="swiper-wrapper">
          {data.map((item, index) => {
            let type = item['type']
            let answers = item['answers'] || []
            let answerIndex = item['answerIndex']
            let isCheckbox = type === 1

            return (
              <div
                key={index}
                className={classnames('swiper-slide', {
                  'swiper-no-swiping': !isMobile()
                })}
              >
                <p className="question__title">
                  {index + 1}、{item.question}
                </p>
                <ul>
                  {answers.map((answer, subIndex) => {
                    let id = `${index}_${subIndex}`
                    let selectAnswerIndex = selectAnswers[index]

                    // 复选框，则选中的答案为数组
                    if (isCheckbox) {
                      selectAnswerIndex = selectAnswerIndex || []
                    }

                    // 判断是否为答案
                    let isAnswer = isCheckbox
                      ? Array.isArray(answerIndex) &&
                        answerIndex.indexOf(subIndex) !== -1
                      : subIndex === answerIndex

                    /**
                     * 答案项，和 选中项，则展示对错
                     * 复选框：判断下标是否在 答案项和 选中项 中即可
                     * 单选题和判断题：下标是否等于 答案下标 或者 选中下标即可
                     */
                    let showRightOrError =
                      showAnswer &&
                      (isCheckbox
                        ? answerIndex.indexOf(subIndex) !== -1 ||
                          selectAnswerIndex.indexOf(subIndex) !== -1
                        : subIndex === answerIndex ||
                          selectAnswerIndex === subIndex)

                    return (
                      <li
                        key={id}
                        className={classnames({
                          'answer--show': showRightOrError
                        })}
                        onClick={
                          showAnswer
                            ? () => {}
                            : this.handleSelectAnswer.bind(
                                this,
                                index,
                                subIndex,
                                isCheckbox
                              )
                        }
                      >
                        <label
                          className={classnames({
                            'answer--right': isAnswer,
                            'answer--error': !isAnswer
                          })}
                        >
                          <input
                            name={isCheckbox ? '' : `${item['type']}_${index}`}
                            type={isCheckbox ? 'checkbox' : 'radio'}
                            disabled={showAnswer}
                            checked={
                              isCheckbox
                                ? selectAnswerIndex.indexOf(subIndex) !== -1
                                : selectAnswerIndex === subIndex
                            }
                          />
                          {answer}
                          {showAnswer && showRightOrError ? (
                            <span className="answer--flag">
                              {isAnswer ? '✓' : '✗'}
                            </span>
                          ) : (
                            ''
                          )}
                        </label>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
        <div className="swiper-pagination questions__pagination" />
        {isMobile() ? '' : <div className="swiper-button-prev" />}
        {isMobile() ? '' : <div className="swiper-button-next" />}
      </div>
    )
  }

  renderInfoBtn({ className, title, value }) {
    return (
      <div className="mq-info__content-btn">
        <p className={className}>{title}</p>
        <p>{value}</p>
      </div>
    )
  }

  // 整体答题情况
  renderInfo() {
    const { data } = this.props
    const { showAnswer, selectAnswers } = this.state
    let selectIndexCount = 0
    let rightCount = 0
    selectAnswers.map(item => {
      if (item !== undefined) {
        selectIndexCount++
      }
    })

    let donePercent = parseFloat((selectIndexCount / data.length) * 100)
    let unDonePercent = parseFloat((1 - selectIndexCount / data.length) * 100)

    return (
      <div className="modal-questions__info">
        <ul>
          {data.map((item, index) => {
            let cls =
              selectAnswers[index] !== undefined
                ? 'status--done'
                : 'status--undone'
            let isCheckbox = item['type'] === 1
            let isRight = isCheckbox
              ? JSON.stringify(selectAnswers[index]) ===
                JSON.stringify(item['answerIndex'])
              : selectAnswers[index] === item['answerIndex']
            if (showAnswer) {
              if (isRight) {
                cls = 'status--right'
                rightCount++
              } else {
                cls = 'status--error'
              }
            }
            return (
              <li
                key={index}
                className={cls}
                onClick={this.handleGoto.bind(this, index)}
              >
                {index}
              </li>
            )
          })}
        </ul>
        <div className="mq-info__content">
          {showAnswer
            ? this.renderInfoBtn({
                className: 'status--right',
                title: '正确',
                value: `${parseFloat((rightCount / data.length) * 100).toFixed(
                  0
                )}%`
              })
            : ''}
          {showAnswer
            ? this.renderInfoBtn({
                className: 'status--error',
                title: '错误',
                value: `${parseFloat(
                  (1 - rightCount / data.length) * 100
                ).toFixed(0)}%`
              })
            : ''}
          {showAnswer
            ? ''
            : this.renderInfoBtn({
                className: 'status--done',
                title: '已做',
                value: `${donePercent.toFixed(0)}%`
              })}
          {this.renderInfoBtn({
            className: 'status--undone',
            title: '未做',
            value: `${unDonePercent.toFixed(0)}%`
          })}
        </div>
        {this.renderFooterBtn()}
      </div>
    )
  }

  renderFooterBtn() {
    const { showAnswer } = this.state
    return (
      <div className="modal-test__btn" onClick={this.handleShowAnswer}>
        {showAnswer ? '隐藏答案' : '查看答案'}
      </div>
    )
  }

  render() {
    const { showInfo } = this.state
    return (
      <div className="modal__questions">
        <div className="modal-test__header-btn" onClick={this.handleShowInfo}>
          {showInfo ? '返回' : '题目索引'}
        </div>
        {showInfo ? this.renderInfo() : ''}
        {this.renderQuestion()}
        {this.renderFooterBtn()}
      </div>
    )
  }
}
