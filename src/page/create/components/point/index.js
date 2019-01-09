/**
 * 2018-03-03 12:30:02
 * 创建页面，点读点组件
 * 后期支持多种形式的渲染,渲染成各种点读点类型的模式展示
 */
import './index.less'
import React, { Component } from 'react'
import { Modal } from 'antd-mobile'
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
} from './mod/_index'

const KEY_CODE = {
  backspace: 9,
  delete: 8,
  enter: 13,
  esc: 27
}

let showDelConfirm = false
let confirmModal = null

class Point extends Component {
  constructor(props) {
    super(props)
    this.state = {
      videoPoster: '',
      isLoadVideoImage: false
    }
  }

  componentDidMount() {
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
    showDelConfirm = false
    this.setPointData({
      isRemove: true
    })
  }

  handleDelPoint = e => {
    const keyCode = e.keyCode || e.which
    const { active } = this.props
    let pointData = this.getPointData()

    // 如果是可编辑的文本框,文本框，文本域，则delete不能删除
    if (e.target.contentEditable === 'true' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return
    }

    // 当前获取焦点，并且未删除的点读点
    if (active && !pointData.isRemove) {
      if ((keyCode === KEY_CODE['backspace'] || keyCode === KEY_CODE['delete']) && !showDelConfirm) {
        // delete ， 选中的点读点， 并且是未被删除的
        showDelConfirm = true
        confirmModal = Modal.alert('确定删除该点读点？', '', [
          {
            text: '取消',
            style: 'default',
            onPress: () => {
              showDelConfirm = false
            }
          },
          {
            text: '确定',
            onPress: () => {
              this.handleRemoveData()
            }
          }
        ])
      } else if (confirmModal && showDelConfirm) {
        if (keyCode === KEY_CODE['enter']) {
          this.handleRemoveData()
          confirmModal.close()
        } else if (keyCode === KEY_CODE['esc']) {
          showDelConfirm = false
          confirmModal.close()
        }
      }
    }
  }

  render() {
    const { data } = this.props
    let pointData = data.data || {}

    let style = getFormatConfigStyle(data)
    let newProps = {
      style,
      ...this.props,
      getPageItemBgAutoWH: this.getPageItemBgAutoWH,
      setPointData: this.setPointData,
      getPointData: this.getPointData
    }

    let pointJsx = null

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
        } else {
          //  if (pointData.customTitle)  这个字段存折自定义点读点的文字内容
          // 自定义文字
          pointJsx = <CustomText {...newProps} />
        }
      }
    } else if (data.type === PAGE_CONTENT_TYPE['input']['name']) {
      pointJsx = <CustomAreaInput {...newProps} />
    } else if (data.type === PAGE_CONTENT_TYPE['shape']['name']) {
      pointJsx = <CustomShapePoint {...newProps} />
    } else {
      pointJsx = <NormalPoint {...newProps} />
    }

    return pointJsx
  }
}

export default Point
