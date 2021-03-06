/**
 * 2018-03-03 12:30:02
 * 创建页面，点读点组件
 * 后期支持多种形式的渲染,渲染成各种点读点类型的模式展示
 */
import './index.less'
import React, { Component } from 'react'
import { Modal } from 'antd'
import { calculateWHByDom } from 'common/js/utils'
import { PAGE_SIZE, PAGE_CONTENT_TYPE, getFormatConfigStyle } from '@/config'
import {
  NormalPoint,
  CustomImg,
  CustomText,
  CustomArea,
  CustomAreaInput,
  CustomAreaVideo,
  CustomShapePoint
} from './mod'

const KEY_CODE = {
  backspace: 8,
  delete: 46,
  enter: 13,
  esc: 27
}

// 删除的确定弹窗
let confirmModal = null

class Point extends Component {
  constructor(props) {
    super(props)
    this.state = {
      videoPoster: '',
      isLoadVideoImage: false
    }

    // 鼠标是否在点读点上
    this.isHover = false
  }

  componentDidMount() {
    const { pageIndex, pointIndex } = this.props

    // FIXED: 鼠标是否在点读点上，在的话，按delete键才能删除
    $(`.point__${pageIndex}_${pointIndex}`).hover(
      e => {
        this.isHover = true
        $(e.currentTarget).attr('data-hover', 'true')
      },
      e => {
        this.isHover = false
        $(e.currentTarget).removeAttr('data-hover')
      }
    )

    window.removeEventListener('keydown', this.handleDelPoint)
    window.addEventListener('keydown', this.handleDelPoint)
  }

  getPointData = () => {
    const { pageIndex, pointIndex } = this.props
    const { getFieldValue } = this.props.form
    let pagesData = getFieldValue('pages') || []
    return pagesData[pageIndex]['points'][pointIndex] || {}
  }

  setPointData = newState => {
    let pointData = this.getPointData()
    const { pageIndex, pointIndex } = this.props
    const { getFieldValue, setFieldsValue } = this.props.form
    let pagesData = getFieldValue('pages') || []
    pagesData[pageIndex]['points'][pointIndex] = { ...pointData, ...newState }
    setFieldsValue({ pages: pagesData })
  }

  getPageItemBgAutoWH = ({ width, height }) => {
    return calculateWHByDom({
      width: width,
      height: height,
      domWidth: PAGE_SIZE.width,
      domHeight: PAGE_SIZE.height
    })
  }

  handleRemoveData = () => {
    confirmModal = null
    this.setPointData({
      isRemove: true
    })
  }

  handleDelPoint = e => {
    const keyCode = e.keyCode || e.which
    const { active } = this.props
    let pointData = this.getPointData()

    // 是否展示删除弹窗
    let notShowDeleteConfirm = Boolean(localStorage.getItem('diandu:point_delete_confirm'))

    // 如果是可编辑的文本框,文本框，文本域，则delete不能删除
    if (e.target.contentEditable === 'true' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return
    }

    // 当前获取焦点，并且未删除的点读点
    if (active && !pointData.isRemove) {
      if ((keyCode === KEY_CODE['backspace'] || keyCode === KEY_CODE['delete']) && !confirmModal) {
        if (notShowDeleteConfirm) {
          if (this.isHover) {
            this.handleRemoveData()
          }
        } else {
          // delete ， 选中的点读点， 并且是未被删除的
          confirmModal = Modal.confirm({
            title: '确定删除该点读点？',
            content: (
              <label className="cbx__confirm-delete">
                <input
                  type="checkbox"
                  onClick={e => {
                    notShowDeleteConfirm = e.target.checked
                  }}
                />
                下次删除不再确认？
              </label>
            ),
            okText: '确认',
            cancelText: '取消',
            onCancel: () => {
              confirmModal = null
            },
            onOk: () => {
              this.handleRemoveData()
              // 下次删除则不需要在弹出删除弹窗
              notShowDeleteConfirm && localStorage.setItem('diandu:point_delete_confirm', true)
            }
          })
        }
      } else if (confirmModal) {
        if (keyCode === KEY_CODE['enter']) {
          this.handleRemoveData()
          confirmModal.close()
        } else if (keyCode === KEY_CODE['esc']) {
          confirmModal.close()
          confirmModal = null
        }
      }
    }
  }

  render() {
    const { data } = this.props
    let pointData = data.data || {}

    let style = getFormatConfigStyle(data, this.props.form)

    let newProps = {
      style,
      ...this.props,
      getPageItemBgAutoWH: this.getPageItemBgAutoWH,
      setPointData: this.setPointData,
      getPointData: this.getPointData
    }

    let pointJsx = <NormalPoint {...newProps} />

    if ((pointData.triggerType === 'area' && data.width) || pointData.triggerType === 'point') {
      // 使用自定义触发区域
      if (pointData.triggerType === 'area' && data.width) {
        if (data.type === 'video') {
          // 视频的区域触发则不太一样
          pointJsx = <CustomAreaVideo {...newProps} />
        } else {
          // 区域触发
          pointJsx = <CustomArea {...newProps} />
        }
      } else if (pointData.triggerType === 'point') {
        // 点模式
        if (pointData.customPath) {
          // 自定义图片
          pointJsx = <CustomImg {...newProps} />
        } else if (pointData.customTitle) {
          // 自定义文字
          pointJsx = <CustomText {...newProps} />
        }
      }
    } else if (data.type === PAGE_CONTENT_TYPE['input']['name']) {
      pointJsx = <CustomAreaInput {...newProps} />
    } else if (data.type === PAGE_CONTENT_TYPE['shape']['name']) {
      pointJsx = <CustomShapePoint {...newProps} />
    }

    return pointJsx
  }
}

export default Point
