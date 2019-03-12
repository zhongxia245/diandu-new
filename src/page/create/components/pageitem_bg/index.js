import './index.less'
import React from 'react'
import { calculateWHByDom } from 'common/js/utils'

export default ({ pageIndex, form, children, domWidth = 800, domHeight = 450 }) => {
  let baseInfo = form.getFieldValue('pages')[pageIndex]['baseInfo']
  let autoWh = calculateWHByDom({
    width: baseInfo.width,
    height: baseInfo.height,
    domWidth: domWidth,
    domHeight: domHeight
  })
  let styles = {
    backgroundImage: `url(${baseInfo.bgSrc})`,
    width: autoWh.width,
    height: autoWh.height
  }
  return (
    <div className="pageitem-bg__wapper">
      <div className="pageitem-bg" style={styles}>
        {children}
      </div>
    </div>
  )
}
