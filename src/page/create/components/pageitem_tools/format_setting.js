/**
 * 点读页格式设置
 */
import React from 'react'
import { POINT, getFormatConfigByType } from '@/config'
import Event from 'common/js/event.js'
import { SliderItem, ColorItem } from '../index'

export default ({
  form,
  pageIndex,
  pointIndex,
  pointData,
  getPointData,
  setPointData,
  callback = () => {},
  onChecked = () => {}
}) => {
  const { type, format_config = {}, data = {} } = pointData
  const CONFIG = getFormatConfigByType(type, data['triggerType'] === 'area') || []

  return (
    <div className="tools__item">
      <h4>格式设置</h4>
      <div className="tools-item__content">
        {CONFIG.map(item => {
          // 区域模式， 不能设置点读点的缩放比例
          if (data['triggerType'] === 'area' && item['name'] === 'point_scale') {
            return
          }
          let key = `${item.name}_${pageIndex}_${pointIndex}`
          let value = format_config[item.name] || item['defaultValue']

          switch (item.type) {
            // 滑块组件
            case POINT.POINT_FORMAT_TYPE.SLIDER:
              return (
                <SliderItem
                  className="format-config__item"
                  config={item}
                  key={key}
                  value={value}
                  callback={callback.bind(this, item)}
                />
              )
            // 颜色选择组件
            case POINT.POINT_FORMAT_TYPE.COLOR:
              return (
                <ColorItem
                  className="format-config__item"
                  config={item}
                  key={key}
                  value={value}
                  callback={callback.bind(this, item)}
                />
              )
            // 按钮组件
            case POINT.POINT_FORMAT_TYPE.BUTTON:
              return (
                <div
                  key={key}
                  className="format-config__item u-btn u-btn--green"
                  onClick={() => {
                    Event.emit(item.event, {
                      getPointData,
                      setPointData,
                      form,
                      pageIndex
                    })
                  }}
                >
                  {item.title}
                </div>
              )
            // 下拉框
            case POINT.POINT_FORMAT_TYPE.SELECT:
              return (
                <div className="select__item format-config__item">
                  <span> {item['title']}</span>
                  <select onChange={callback.bind(this, item)}>
                    {item['values'].map((subItem, subIndex) => {
                      return (
                        <option value={subItem['value']} key={subIndex} selected={subIndex === value}>
                          {subItem['key']}
                        </option>
                      )
                    })}
                  </select>
                </div>
              )
            // 复选框列表
            case POINT.POINT_FORMAT_TYPE.CHECKBOX_LIST:
              let configs = item['configs'] || []
              return (
                <div className="checkbox-list__item format-config__item">
                  {configs.map((subitem, subindex) => {
                    return (
                      <label key={subindex}>
                        <input
                          type="checkbox"
                          checked={value && value[subitem['name']]}
                          onChange={onChecked.bind(this, item['name'], subitem)}
                        />
                        <span>{subitem['title']}</span>
                      </label>
                    )
                  })}
                </div>
              )
          }
        })}
      </div>
    </div>
  )
}
