/**
 * style样式放在后面，主要是因为如果点读点放大或者缩小
 * 则点读点的宽高使用 计算出来的宽高
 */
import React from 'react'
import classnames from 'classnames'
import { POINT_SIZE } from '../../../config/_index.js'
import { ResizeControl } from '@create/components/_index'

// 普通点读点
const NormalPoint = ({
  data,
  pageIndex,
  pointIndex,
  className,
  style,
  other,
  active,
  getPageItemBgAutoWH,
  ...otherProps
}) => {
  let autoWH = getPageItemBgAutoWH(other.baseInfo)
  let pointStyle = {
    width: data.pointSize || POINT_SIZE,
    height: data.pointSize || POINT_SIZE,
    left: data.x * autoWH.width,
    top: data.y * autoWH.height,
    ...style
  }
  return (
    <div
      {...otherProps}
      key={pointIndex}
      style={pointStyle}
      className={classnames('point', `point__${pageIndex}_${pointIndex}`, className, { 'point--active': active })}
      data-index={pointIndex}
    >
      {pointIndex + 1}
    </div>
  )
}

// 文字点读点
const CustomText = ({
  data,
  pageIndex,
  pointIndex,
  className,
  style,
  other,
  active,
  getPageItemBgAutoWH,
  ...otherProps
}) => {
  let autoWH = getPageItemBgAutoWH(other.baseInfo)
  let pointStyle = {
    left: data.x * autoWH.width,
    top: data.y * autoWH.height,
    width: data.pointSize || POINT_SIZE,
    height: data.pointSize || POINT_SIZE,
    ...style
  }
  let pointData = data.data || {}
  return (
    <div
      {...otherProps}
      key={pointIndex}
      style={pointStyle}
      className={classnames('point', `point__${pageIndex}_${pointIndex}`, 'point__custom-text', className, {
        'point--active': active
      })}
      data-index={pointIndex}
    >
      {pointIndex + 1}
      <p>{pointData.customTitle}</p>
    </div>
  )
}

// 自定义图片点读点
const CustomImg = ({
  data,
  pageIndex,
  pointIndex,
  className,
  style,
  other,
  active,
  getPageItemBgAutoWH,
  ...otherProps
}) => {
  let autoWH = getPageItemBgAutoWH(other.baseInfo)
  let pointStyle = {
    left: data.x * autoWH.width,
    top: data.y * autoWH.height,
    width: data.pointSize || POINT_SIZE,
    ...style,
    height: 'auto'
  }
  let pointData = data.data || {}
  return (
    <img
      src={pointData.customPath}
      {...otherProps}
      key={pointIndex}
      style={pointStyle}
      className={classnames('point', `point__${pageIndex}_${pointIndex}`, 'point__custom-img', className, {
        'point--active': active
      })}
      data-index={pointIndex}
    />
  )
}

// 区域点读点
const CustomArea = props => {
  const { data, pageIndex, pointIndex, className, style, other, active, getPageItemBgAutoWH, ...otherProps } = props
  let autoWH = getPageItemBgAutoWH(other.baseInfo)
  let pointStyle = {
    left: data.x * autoWH.width,
    top: data.y * autoWH.height,
    width: data.width * autoWH.width,
    height: data.height * autoWH.height,
    ...style
  }
  let pointData = data.data || {}
  return (
    <div
      {...otherProps}
      key={pointIndex}
      style={pointStyle}
      className={classnames(
        'point',
        `point__${pageIndex}_${pointIndex}`,
        'point__custom-area',
        `point__custom-area--${pointData.areaType}`,
        className,
        {
          'point--active': active
        }
      )}
      data-index={pointIndex}
    >
      {pointIndex + 1}
      {active ? <ResizeControl {...props} /> : ''}
    </div>
  )
}

export { NormalPoint, CustomText, CustomImg, CustomArea }
