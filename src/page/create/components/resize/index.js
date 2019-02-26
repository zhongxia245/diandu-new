/**
 * 组件描述：
 * 改变自定义区域大小的组件，支持上下左右，以及4个边角拉动，改变大小
 */
import './index.less'
import React, { Component } from 'react'
import { EVENT_NAMES } from '@/config'
import { Drag } from '@/page/create/utils/index'
import Event from 'common/js/event.js'

let originalPointData = null

class ResizeControl extends Component {
  componentDidMount() {
    const { pageIndex, pointIndex, getPointData, setPointData, other, getPageItemBgAutoWH } = this.props
    // 点读点大小改变
    Drag({
      selector: `.point__${pageIndex}_${pointIndex} .js-resize-size`,
      beforeMove: () => {
        // 深复制一个对象，否则会引用同一个对象
        originalPointData = JSON.parse(JSON.stringify(getPointData()))
        // 滑动的时候，禁止添加点读点
        Event.emit(EVENT_NAMES.DISABLED_ADD_POINT, pageIndex)
      },
      callback: result => {
        if (result) {
          // flag = 1 ,标识是左，左上，上,右上 四个点
          let flag = result.e.target.getAttribute('data-flag')

          let pointData = getPointData()

          let autoWH = getPageItemBgAutoWH(other.baseInfo)

          let newWidth = originalPointData.width
          let newHeight = originalPointData.height
          let x = originalPointData.x
          let y = originalPointData.y

          switch (flag) {
            case 'left':
              newWidth = originalPointData.width - result.disX / autoWH.width
              x += result.disX / autoWH.width
              break
            case 'lt':
              newWidth = originalPointData.width - result.disX / autoWH.width
              newHeight = originalPointData.height - result.disY / autoWH.height
              x += result.disX / autoWH.width
              y += result.disY / autoWH.height
              break
            case 'top':
              newHeight = originalPointData.height - result.disY / autoWH.height
              y += result.disY / autoWH.height
              break
            case 'rt':
              newWidth = originalPointData.width + result.disX / autoWH.width
              newHeight = originalPointData.height - result.disY / autoWH.height
              y += result.disY / autoWH.height
              break
            case 'right':
              newWidth = originalPointData.width + result.disX / autoWH.width
              break
            case 'rb':
              newWidth = originalPointData.width + result.disX / autoWH.width
              newHeight = originalPointData.height + result.disY / autoWH.height
              break
            case 'bottom':
              newHeight = originalPointData.height + result.disY / autoWH.height
              break
            case 'lb':
              newWidth = originalPointData.width - result.disX / autoWH.width
              newHeight = originalPointData.height + result.disY / autoWH.height
              x += result.disX / autoWH.width
              break
          }

          // 区域最小需要20px
          if (newWidth * autoWH.width < 20) {
            newWidth = 20 / autoWH.width
            x = pointData.x
          }

          if (newHeight * autoWH.height < 20) {
            newHeight = 20 / autoWH.height
            y = pointData.y
          }

          setPointData({
            x: x,
            y: y,
            width: newWidth,
            height: newHeight
          })
        }
      },
      moveEnd: () => {
        originalPointData = null
        setTimeout(() => {
          Event.emit(EVENT_NAMES.ENABLE_ADD_POINT, pageIndex)
        }, 100)
      }
    })
  }

  render() {
    return (
      <React.Fragment>
        <div className="u-resize__border-left" />
        <div className="u-resize__border-top" />
        <div className="u-resize__border-right" />
        <div className="u-resize__border-bottom" />
        <div className="js-resize-size u-resize u-resize__lb" data-flag="lb" />
        <div className="js-resize-size u-resize u-resize__left" data-flag="left" />
        <div className="js-resize-size u-resize u-resize__lt" data-flag="lt" />
        <div className="js-resize-size u-resize u-resize__top" data-flag="top" />
        <div className="js-resize-size u-resize u-resize__rt" data-flag="rt" />
        <div className="js-resize-size u-resize u-resize__right" data-flag="right" />
        <div className="js-resize-size u-resize u-resize__rb" data-flag="rb" />
        <div className="js-resize-size u-resize u-resize__bottom" data-flag="bottom" />
      </React.Fragment>
    )
  }
}

export default ResizeControl
