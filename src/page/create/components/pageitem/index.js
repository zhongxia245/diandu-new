/**
 * 2018-07-16 21:53:09
 * 重构一下代码，保持代码在300行内
 *
 * 创建页面点读页功能
 * 1. 点读页工具栏的相关逻辑处理
 * 2. 点读点的展示
 * 3. 删除点读点
 * 4. 点读点移动
 */
import './index.less'
import React, { Component } from 'react'
import { ReactWebUploader } from 'common/js/components'
import { Modal, message } from 'antd'
import html2canvas from 'html2canvas'
import _ from 'lodash'

import { calculateWHByDom } from 'common/js/utils'
import { IconFont } from 'common/js/components'
import { CustomAntdModal } from 'common/js/components'

import { Drag, getImageWH } from '@/page/create/utils'
import { savePageTpl, getPageTpl, uploadBase64Img } from '@/ajax'
import { PageItemTools, PageShape, PageTplList, Point } from '../index'
import { ALLOW_ADD_POINT, initEvent } from './event_handle'
import { POINT_SIZE, PAGE_SIZE, PRE_PAGE_ID, PRE_POINT_CLASS, PRE_PAGE_CLASS, PAGE_CONTENT_TYPE } from '@/config'

let uploadedCount = 0 // 成功上传数量
let fileCount = 0 // 上传文件列表数量

class PageItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentSelectPointIndex: 0
    }
  }

  componentDidMount() {
    initEvent({ form: this.props.form })

    /**
     * 点读点功能移动功能
     * 1. 计算点读点在容器中的位置（百分比形式，因为容器大小不固定，如果存具体多少px,则有问题）
     * 2. 计算点读点的大小
     */
    Drag({
      selector: `.${PRE_PAGE_CLASS + this.props.pageIndex} .${PRE_POINT_CLASS}`,
      notMoveClassName: 'not-drag',
      callback: result => {
        if (result) {
          let pageData = this.getPageData()
          let index = result.index
          let points = pageData.points
          let baseInfo = pageData.baseInfo
          let pointConfig = {}
          let autoWH = this.getPageItemBgAutoWH(baseInfo) || {}
          pointConfig = {
            ...points[index],
            x: result.x / autoWH.width,
            y: result.y / autoWH.height
          }
          points[index] = pointConfig
          this.setPageData(pageData, index)
        }
      }
    })
  }

  // 获取点读页数据
  getPageData = () => {
    const { pageIndex } = this.props
    const { getFieldValue } = this.props.form
    let pagesData = getFieldValue('pages') || []
    return pagesData[pageIndex]
  }

  // 设置点读页数据
  setPageData = (pageData, currentSelectPointIndex) => {
    const { pageIndex } = this.props
    const { getFieldValue, setFieldsValue } = this.props.form
    let pagesData = getFieldValue('pages') || []
    pagesData[pageIndex] = pageData
    setFieldsValue({ pages: pagesData })
    if (currentSelectPointIndex !== undefined) {
      this.setState({ currentSelectPointIndex: currentSelectPointIndex })
    }
  }

  // 获取未删除的点读页数量
  getPagesCount = () => {
    const { getFieldValue } = this.props.form
    let count = 0
    let pagesData = getFieldValue('pages') || []
    for (let i = 0; i < pagesData.length; i++) {
      if (!pagesData[i]['isRemove']) {
        count++
      }
    }
    return count
  }

  // 获取背景图片适合的宽高
  getPageItemBgAutoWH = ({ width, height }) => {
    return calculateWHByDom({
      width: width,
      height: height,
      domWidth: PAGE_SIZE.width,
      domHeight: PAGE_SIZE.height
    })
  }

  /**
   * 根据图片地址获取点读页的相关信息
   */
  getPageDataByPath = (path, callback) => {
    getImageWH(path).then(data => {
      // 点读页数据保存图片的真实大小，然后根据不同的设备带下，去计算最适合的展示比例
      let baseInfo = {
        width: data.w,
        height: data.h,
        bgSrc: path
      }
      callback({ baseInfo: baseInfo })
    })
  }

  // 添加点读点
  handleAddPoint = e => {
    if (ALLOW_ADD_POINT && e.target.className === 'pageitem-content__wrapper') {
      let pageData = this.getPageData()
      // 点击的位置，算是圆心中心点，所以减去圆的半径（即圆点大小/2）
      let x = e.nativeEvent.offsetX - POINT_SIZE / 2
      let y = e.nativeEvent.offsetY - POINT_SIZE / 2
      let autoWH = this.getPageItemBgAutoWH(pageData.baseInfo)
      let pointConfig = {
        x: x / autoWH.width,
        y: y / autoWH.height,
        pointSize: POINT_SIZE
      }
      pageData.points.push(pointConfig)
      this.setPageData(pageData, pageData.points.length - 1)
    }
  }

  handleSelectPoint = index => {
    this.setState({ currentSelectPointIndex: index })
  }

  handleDelPage = () => {
    Modal.confirm({
      title: '确定删除该点读页吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        let pageData = this.getPageData()
        pageData.isRemove = true
        this.setPageData(pageData)
      }
    })
  }

  filesQueued = files => {
    fileCount = files.length
  }
  /**
   * 上传点读页成功
   */
  uploadSuccess = (file, path) => {
    if (uploadedCount < fileCount) {
      uploadedCount++
      if (uploadedCount === 1) {
        this.getPageDataByPath(path, newPageData => {
          console.log('当前点读页添加')
          let pageData = this.getPageData()
          this.setPageData({ ...pageData, ...newPageData })
        })
      } else {
        this.getPageDataByPath(path, newPageData => {
          console.log('外部添加')
          this.props.onAddCallback && this.props.onAddCallback(newPageData)
        })
      }
    }
  }

  uploadComplete = () => {
    if (uploadedCount === fileCount) {
      console.log('全部上传完成')
      uploadedCount = 0
    }
  }

  // 绘制文本框
  handleDrawPageInput = () => {
    let pageData = this.getPageData()
    let pointConfig = {
      x: 0.5,
      y: 0.5,
      width: 0.3,
      height: 0.2,
      type: PAGE_CONTENT_TYPE['input']['name'],
      data: {
        text: ''
      }
    }
    pageData.points.push(pointConfig)
    this.setPageData(pageData, pageData.points.length - 1)
  }

  // 插入形状或者图片
  handleDrawPageShape = () => {
    CustomAntdModal.show({
      width: 900,
      title: '图形库',
      className: 'modal__shape',
      footer: null,
      render: props => (
        <PageShape
          {...props}
          callback={item => {
            // 添加图片的回调
            let pageData = this.getPageData()
            let pointConfig = {
              x: 0.5,
              y: 0.5,
              width: item.width / pageData.w || 0.2,
              height: item.height / pageData.h || 0.2,
              type: PAGE_CONTENT_TYPE['shape']['name'],
              data: {
                ...item
              }
            }
            pageData.points.push(pointConfig)
            this.setPageData(pageData, pageData.points.length - 1)
          }}
        />
      )
    })
  }

  // 绘制层级关系
  handleLevelSetting = () => {
    message.info('努力建设中...')
  }

  // 动画设置
  handleAnimationSetting = () => {
    message.info('努力建设中...')
  }

  handleSaveTpl = async () => {
    let name = prompt('请输入点读页模板的名称？')

    if (name) {
      message.loading('保存中...')
      // 把当前点读页生成一张图片，然后保存在背景图片
      let canvas = await html2canvas(document.querySelector(`#${PRE_PAGE_ID}${this.props.pageIndex}`))
      let result = await uploadBase64Img(canvas)

      let tplData = {
        name: name,
        type: 'normal',
        pic: result.data,
        data: JSON.stringify(this.getPageData()),
        desc: '' // 暂无描述，
      }
      await savePageTpl(tplData)
      message.destroy()
      message.success('已把当前点读页保存成模板！')
    }
  }

  handleShowTplList = async () => {
    let result = await getPageTpl()

    let list = []
    for (let i = 0; i < result.length; i++) {
      if (result[i].data && result[i].data !== undefined && result[i].pic) {
        list.push(result[i])
      }
    }

    CustomAntdModal.show({
      width: 900,
      title: '点读页模板列表',
      className: 'modal__pagetpl',
      footer: null,
      render: props => (
        <PageTplList {...props} data={list} setPageData={this.setPageData} getPageData={this.getPageData} />
      )
    })
  }

  handleToggleHide = flag => {
    const pageData = this.getPageData()
    pageData['hide'] = flag
    this.setPageData(pageData)
  }

  handleMovePre = () => {
    const { pageIndex, form } = this.props
    const { getFieldsValue, setFieldsValue } = form
    let allData = getFieldsValue()
    let pagesData = allData['pages'] || []

    if (pageIndex - 1 > 0) {
      // 第一个点读页
      message.info('已经是第一个点读页了')
    } else {
      let tempIndex = pagesData[pageIndex - 1]['sort']
      pagesData[pageIndex - 1]['sort'] = pagesData[pageIndex]['sort']
      pagesData[pageIndex]['sort'] = tempIndex
      pagesData = _.sortBy(pagesData, 'sort')
      setFieldsValue({ pages: pagesData })
    }
  }
  handleMoveNext = () => {
    const { pageIndex, form } = this.props
    const { getFieldsValue, setFieldsValue } = form
    let allData = getFieldsValue()
    let pagesData = allData['pages'] || []

    if (pageIndex + 1 >= pagesData.length) {
      // 最后一个点读页
      message.info('已经是最后一个点读页了')
    } else {
      let tempIndex = pagesData[pageIndex + 1]['sort']
      pagesData[pageIndex + 1]['sort'] = pagesData[pageIndex]['sort']
      pagesData[pageIndex]['sort'] = tempIndex
      pagesData = _.sortBy(pagesData, 'sort')
      setFieldsValue({ pages: pagesData })
    }
  }

  /**
   * 渲染点读点
   * 传入点读点数据，生成点读点
   * 具体点读点有何操作，在Point里面处理
   */
  renderPoints() {
    const { points, ...other } = this.getPageData()
    const { currentSelectPointIndex } = this.state
    return points.map((item, index) => {
      if (item.isRemove) {
        return ''
      }
      return (
        <Point
          className={PRE_POINT_CLASS}
          active={currentSelectPointIndex === index}
          key={index}
          other={other}
          data={item}
          form={this.props.form}
          pointIndex={index}
          pageIndex={this.props.pageIndex}
          onClick={this.handleSelectPoint.bind(this, index)}
        />
      )
    })
  }

  /**
   * 渲染点读页
   * 计算图片的宽高在当前容易里面如何展示
   */
  renderPage() {
    const { baseInfo, hide = false } = this.getPageData()
    const { getFieldValue } = this.props.form
    let globalSettingData = getFieldValue('globalSetting') || []

    let JsxDom = (
      <div className="pageitem-content__tip">
        <h3>提示</h3>
        <p>手机横屏比例为16:9，对应像素通常为1920*1080。建议上传小于此分辨率的图片作为背景图</p>
        <p>
          选择图片时,可批量上传,按CTRL键加选,按shift链选(第一个和最后一个之间的所有,可以按ctrl+a
          选择一个文件夹下的所有图片)
        </p>
      </div>
    )

    if (baseInfo && baseInfo.bgSrc) {
      let autoWH = this.getPageItemBgAutoWH(baseInfo)
      let style = {
        width: autoWH.width,
        height: autoWH.height,
        backgroundImage: `url(${baseInfo.bgSrc})`
      }
      JsxDom = (
        <div
          id={`${PRE_PAGE_ID}${this.props.pageIndex}`}
          className="pageitem-content__wrapper"
          style={style}
          onClick={this.handleAddPoint}
        >
          {this.renderPoints()}
        </div>
      )
    }

    return (
      <div className="pageitem__content" style={{ backgroundColor: globalSettingData.pageBgColor }}>
        {hide ? <div className="pageitem__mask">该点读页处于隐藏状态,不会展示页面展示</div> : ''}
        {JsxDom}
      </div>
    )
  }

  render() {
    const { pageIndex, form } = this.props
    const { currentSelectPointIndex } = this.state
    const pageData = this.getPageData()
    let isHide = pageData['hide']
    let pageCount = this.getPagesCount()

    return (
      <div className={`pageitem ${PRE_PAGE_CLASS + pageIndex}`}>
        <div className="pageitem__left">
          {/* 点读页上传图片按钮，点读页工具按钮等 */}
          <div className="pageitem__header">
            <div className="pageitem-header__upload">
              <ReactWebUploader
                id={`btnUpload_${pageIndex}`}
                className="u-btn u-white u-btn--green"
                label="选择背景图"
                filesQueued={this.filesQueued}
                uploadSuccess={this.uploadSuccess}
                uploadComplete={this.uploadComplete}
              />
              <span>竖屏背景图比例9：16</span>

              <div>
                {pageCount > 1 && (
                  <React.Fragment>
                    <div
                      style={{ display: pageIndex === 0 ? 'none' : '' }}
                      className="u-btn u-btn--small u-btn--green u-mr-10"
                      onClick={this.handleMovePre}
                    >
                      上移
                    </div>
                    <div
                      style={{
                        display: pageIndex + 1 === pageCount ? 'none' : ''
                      }}
                      className="u-btn u-btn--small u-btn--green u-mr-10"
                      onClick={this.handleMoveNext}
                    >
                      下移
                    </div>
                  </React.Fragment>
                )}

                {isHide ? (
                  <div
                    className="u-btn u-btn--small u-btn--green u-mr-10"
                    onClick={this.handleToggleHide.bind(this, false)}
                  >
                    显示
                  </div>
                ) : (
                  <div
                    className="u-btn u-btn--small u-btn--red u-mr-10"
                    onClick={this.handleToggleHide.bind(this, true)}
                  >
                    隐藏
                  </div>
                )}

                <div className="u-btn u-btn--small u-btn--red" onClick={this.handleDelPage}>
                  删除
                </div>
              </div>
            </div>

            <ul className="pageitem-header__setting">
              <li onClick={this.handleLevelSetting}>
                <IconFont type="shezhi" />
                <span>点读点层次设置</span>
              </li>
              <li onClick={this.handleAnimationSetting}>
                <IconFont type="shezhi" />
                <span>动画设置</span>
              </li>
              <li style={{ flex: 1 }} />
              <li onClick={this.handleDrawPageInput}>
                <IconFont type="twenbenkuang" />
                <span>文本框</span>
              </li>
              <li onClick={this.handleDrawPageShape}>
                <IconFont type="tuxing" />
                <span>图形</span>
              </li>
              <li onClick={this.handleSaveTpl}>
                <IconFont type="baocun" />
                <span>存入素材库</span>
              </li>
              <li onClick={this.handleShowTplList}>
                <IconFont type="dakai" />
                <span>从素材库中提取</span>
              </li>
            </ul>
          </div>

          {/* 点读页 */}
          {this.renderPage()}
        </div>

        <div className="pageitem__right">
          {/* 工具栏 */}
          <PageItemTools pointIndex={currentSelectPointIndex} pageIndex={pageIndex} form={form} />
        </div>
      </div>
    )
  }
}

export default PageItem
