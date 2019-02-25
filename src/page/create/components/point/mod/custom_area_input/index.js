/**
 * 绘制文本框点读点
 * 单纯的展示，不能编辑,没有交互
 * 注意事项：
 * 1. 选中该点读点，然后点击才内容，才能进行编辑
 * 2. 如果不想编辑了， 目前的做法是在在其他区域外点击一下
 */
import './index.less'
import React, { Component } from 'react'
import classnames from 'classnames'
import { ResizeControl } from '@/page/create/components'
import ContentEditable from 'react-contenteditable'
import MoveOrClick from '@/page/create/common/move_or_click'

class CustomAreaInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showTextarea: false
    }
  }

  componentWillReceiveProps(nextProps) {
    // 文本框失去焦点，则输入框则隐藏
    if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
      if (!nextProps.active) {
        this.setState({ showTextarea: false })
      }
    }
  }

  handleBlur = e => {
    e.stopPropagation()
    this.setState({ showTextarea: false })
  }

  handleEdit = e => {
    e.stopPropagation()
    if (!e.target.className.includes('custom-area-input__textarea')) {
      this.setState({ showTextarea: !this.state.showTextarea }, () => {
        this.ref_input && this.ref_input.htmlEl && this.ref_input.htmlEl.focus()
      })
    }
  }

  handleChange = e => {
    const { setPointData, data } = this.props
    let val = e.target.value
    data.text = val
    setPointData({ data: data })
  }

  renderInput() {
    const { data, active } = this.props
    // FIXED: 必须添加 not-move ，否则光标无法选中，会被绑定在 document上的mousemove 给影响
    return (
      <React.Fragment>
        <ContentEditable
          ref={dom => {
            this.ref_input = dom
          }}
          className="custom-area-input__textarea not-drag"
          html={data.text || ''}
          disabled={!active}
          onChange={this.handleChange}
        />
        <div className="custom-area-input__mask" onClick={this.handleBlur} />
      </React.Fragment>
    )
  }

  render() {
    const { showTextarea } = this.state
    const {
      data,
      pageIndex,
      pointIndex,
      className,
      style,
      other,
      active,
      getPageItemBgAutoWH,
      ...otherProps
    } = this.props
    let autoWH = getPageItemBgAutoWH(other.baseInfo)
    let pointStyle = {
      ...style,
      left: data.x * autoWH.width,
      top: data.y * autoWH.height,
      width: data.width * autoWH.width,
      height: data.height * autoWH.height
    }

    // 点读点获取焦点时，才添加点击事件
    let activeProps = {}
    if (active) {
      activeProps = { ...MoveOrClick(this.handleEdit) }
    }

    return (
      <div
        {...otherProps}
        key={pointIndex}
        style={pointStyle}
        className={classnames('point', `point__${pageIndex}_${pointIndex}`, 'point__custom-area-input', className, {
          'point--active': active
        })}
        data-index={pointIndex}
        {...activeProps}
      >
        {active && showTextarea ? (
          this.renderInput()
        ) : (
          <div style={{ pointerEvents: 'none' }} dangerouslySetInnerHTML={{ __html: data.text }} />
        )}
        {active ? <ResizeControl {...this.props} /> : ''}
      </div>
    )
  }
}

export default CustomAreaInput
