import './_pointitem.less'
import React, { Component } from 'react'
import classnames from 'classnames'
import { calculateWHByDom } from 'common/js/utils'
import { Point } from '../_index'
import { PAGE_SIZE } from '@/config'
export default class PageItem extends Component {
  /**
   * TODO:计算出在创建页面展示的时候，宽高是多少，然后跟在展示页面的展示宽高比较，可以知道缩放了多少
   */
  getPointScaleSize = baseInfo => {
    return calculateWHByDom({
      width: baseInfo.width,
      height: baseInfo.height,
      domHeight: PAGE_SIZE.height,
      domWidth: PAGE_SIZE.width
    })
  }

  render() {
    const { className, contentH, contentW, pageIndex, form } = this.props
    const { points = [], baseInfo } = this.props.data

    let scaleWhObj = this.getPointScaleSize(baseInfo)
    let whObj = calculateWHByDom({
      width: baseInfo.width,
      height: baseInfo.height,
      domHeight: contentH,
      domWidth: contentW
    })

    let scale = whObj.width / scaleWhObj.width
    // 设置缩放后，宽高对应比例放大，需要设置 div 为 绝对布局，否则宽最大就100% 也就是375
    // 因为最外层 div 设置了禁止滚动
    let style = {
      width: whObj.width / scale,
      height: whObj.height / scale,
      transform: `scale(${scale})`
    }

    return (
      <div className={classnames('pageitem', className)}>
        {/* use swiper lazy load image */}
        <div className="pageitem__wrapper swiper-lazy" style={style} data-background={baseInfo.bgSrc}>
          {points.map((point, index) => {
            return <Point key={index} data={point} whObj={whObj} pointIndex={index} pageIndex={pageIndex} form={form} />
          })}
        </div>
      </div>
    )
  }
}
