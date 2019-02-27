import React, { Component } from 'react'
import classnames from 'classnames'
import { IconFont } from 'common/js/components'
import { Accordion, Grid, Slider } from 'antd-mobile'
import { previewAnimation } from '@/page/create/utils'
import { ANIMATIONS, SETTINGS } from '@/config/animation'

// 获取该动画是否可以设置方向
const getDirections = className => {
  for (let i = 0; i < ANIMATIONS.length; i++) {
    if (ANIMATIONS[i]['className'] === className) {
      return ANIMATIONS[i]['directions']
    }
  }
  return null
}

class AnimationSetting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentIndex: 0
    }
  }

  getAnimations = () => {
    const { getPointData } = this.props
    let pointData = getPointData()
    return pointData['animations'] || []
  }

  setAnimations = data => {
    const { setPointData } = this.props
    setPointData({ animations: data })
  }

  setCurrentAnimation = data => {
    const { setPointData } = this.props
    const { currentIndex } = this.state
    let animations = this.getAnimations()
    animations[currentIndex] = { ...animations[currentIndex], ...data }
    setPointData({ animations })
  }

  handleAccordionChange = key => {
    if (Array.isArray(key)) {
      this.setState({ currentIndex: key[key.length - 1] })
    } else {
      this.setState({ currentIndex: key })
    }
  }

  handleAddAnimation = () => {
    let animations = this.getAnimations()
    animations.push({})
    this.setAnimations(animations)
  }

  handleDelAnimation = index => {
    let animations = this.getAnimations()
    animations.splice(index, 1)
    this.setAnimations(animations)
  }

  handleSelectAnimation = item => {
    // 没有方向的动画，则去掉方向， 有方向的则模式选中第一个
    if (item['directions'] && item['directions'].length > 0) {
      this.setCurrentAnimation({ className: item['className'], direction: item['directions'][0]['className'] })
    } else {
      this.setCurrentAnimation({ className: item['className'], direction: '' })
    }
  }

  handleSelectDirection = item => {
    this.setCurrentAnimation({ direction: item['className'] })
  }

  handlePreview = () => {
    const { pageIndex, pointIndex } = this.props
    let animations = this.getAnimations()
    let pointClass = `.point__${pageIndex}_${pointIndex}`
    previewAnimation(pointClass, animations)
  }

  handleChange = (name, e) => {
    let val = e.target ? e.target.value : e
    this.setCurrentAnimation({ [name]: val })
  }

  handleChangeCheckBox = (name, e) => {
    this.setCurrentAnimation({ [name]: e.target.checked })
  }

  renderPanelHeader(index) {
    return (
      <div className="accordion-panel__header">
        <p>
          动画
          {index + 1}
        </p>
        <span onClick={this.handleDelAnimation.bind(this, index)}>删除</span>
      </div>
    )
  }

  // 动画方案
  renderAnimationItem(currentAnimation, item) {
    let isActive =
      currentAnimation['className'] === item['className'] || currentAnimation['direction'] === item['className']
    return (
      <div
        className={classnames('custom-am-grid-item am-grid-item-inner-content', {
          'am-grid-item__animation--active': isActive
        })}
      >
        <IconFont className="am-grid-icon" type={item['icon']} />
        <div className="am-grid-text">{item['title']}</div>
      </div>
    )
  }

  // 动画设置项
  renderSetting(setting, i) {
    let animations = this.getAnimations()
    let { currentIndex } = this.state
    const currentAnimation = animations[currentIndex] || {}
    const { title, type, key, min = 0, max = 5, step = 1 } = setting || {}
    let val = currentAnimation[key]

    switch (type) {
      case 'slider':
        return (
          <div key={i} className="animation-setting__item">
            <span>{title}</span>
            <Slider value={val || 0} min={min} max={max} step={step} onChange={this.handleChange.bind(this, key)} />
            <span className="animation-setting__item-box">{val || 0}s</span>
          </div>
        )
      case 'custom':
        return (
          <div key={i} className="animation-setting__item">
            <div>
              <span>播放次数</span>
              <input type="number" min={min} max={max} value={val} onChange={this.handleChange.bind(this, key)} />
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={currentAnimation[setting['key1']]}
                  onChange={this.handleChangeCheckBox.bind(this, setting['key1'])}
                />
                循环
              </label>
            </div>
          </div>
        )
      default:
        return <span>{title}</span>
    }
  }

  render() {
    let animations = this.getAnimations()
    const { currentIndex } = this.state
    let currentAnimation = animations[currentIndex] || {}

    return (
      <div className="tools__item tool-item__animation">
        <h4>动画设置</h4>
        <div className="tools-item__content">
          <Accordion
            className="animation-accordion"
            accordion={true}
            defaultActiveKey="0"
            onChange={this.handleAccordionChange}
          >
            {animations.map((item, index) => {
              let directions = getDirections(item['className'])
              return (
                <Accordion.Panel key={index} header={this.renderPanelHeader(index)}>
                  <h5>
                    <span>方案</span>
                    <label>
                      <input
                        type="checkbox"
                        checked={currentAnimation['linear']}
                        onChange={this.handleChangeCheckBox.bind(this, 'linear')}
                      />
                      匀速
                    </label>
                  </h5>
                  <Grid
                    hasLine={true}
                    columnNum={5}
                    renderItem={this.renderAnimationItem.bind(this, item)}
                    activeClassName="tools-type__item--active"
                    data={ANIMATIONS}
                    onClick={this.handleSelectAnimation}
                  />

                  {/* 有的动画没有方向设置 */}
                  {directions && directions.length > 0 ? (
                    <React.Fragment>
                      <h5>
                        <span>方向1</span>
                        <label>
                          <input
                            type="checkbox"
                            checked={currentAnimation['alternate']}
                            onChange={this.handleChangeCheckBox.bind(this, 'alternate')}
                          />
                          往复
                        </label>
                      </h5>
                      <Grid
                        hasLine={true}
                        columnNum={5}
                        renderItem={this.renderAnimationItem.bind(this, item)}
                        activeClassName="tools-type__item--active"
                        data={directions}
                        onClick={this.handleSelectDirection}
                      />
                    </React.Fragment>
                  ) : (
                    ''
                  )}

                  <div className="animation-settings">
                    {SETTINGS.map((setting, i) => {
                      return this.renderSetting(setting, i)
                    })}
                  </div>
                </Accordion.Panel>
              )
            })}
          </Accordion>
        </div>
        <div className="tools-item__footer">
          <div className="u-btn u-btn--green" onClick={this.handleAddAnimation}>
            添加动画
          </div>
          <div className="u-btn u-btn--green" onClick={this.handlePreview}>
            动画预览
          </div>
        </div>
      </div>
    )
  }
}

export default AnimationSetting
