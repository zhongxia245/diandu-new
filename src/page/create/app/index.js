/**
 * 2018-03-07 07:52:53
 * 创建点读页面入口页
 */
import './index.less'
import 'antd-mobile/dist/antd-mobile.less'
import React, { Component } from 'react'
import { createForm } from 'rc-form'
import classnames from 'classnames'
import { message, Icon } from 'antd'
import { ReactWebUploader, IconFont, CustomAntdModal } from 'common/js/components'
import { isDev, queryString } from 'common/js/utils'
import { ModalCropper, GlobalPageSetting, PageItem, AppHeader } from '@/page/create/components'
import { saveData } from '@/ajax'
import { PAGE_SIZE } from '@/config'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uploadProgressBgAudio: null
    }
  }

  componentDidMount() {
    const { setFieldsValue, getFieldProps } = this.props.form

    // FIXED: 先注册表单，使用才不用警告
    getFieldProps('covers')
    getFieldProps('pages')
    getFieldProps('globalSetting')
    setFieldsValue(this.props.data)
  }

  handleChange = (fieldName, val) => {
    const { setFieldsValue } = this.props.form
    setFieldsValue({ [fieldName]: val })
  }

  handleSharePicSuccess = (file, path) => {
    const { setFieldsValue, getFieldValue } = this.props.form
    let shareInfo = getFieldValue('share')
    shareInfo['imgUrl'] = path
    setFieldsValue({ share: shareInfo })
  }

  uploadSuccessBgAudio = (file, path) => {
    const { setFieldsValue } = this.props.form
    setFieldsValue({
      bgAudio: {
        src: path,
        name: file.name
      }
    })
    this.setState({ uploadProgressBgAudio: null })
  }

  uploadProgressBgAudio = (file, progress) => {
    this.setState({ uploadProgressBgAudio: parseInt(progress * 100, 10) })
  }

  // 选择封面图片
  handleFileChange = (index, e) => {
    const { getFieldValue, setFieldsValue } = this.props.form
    let reader, file
    let files = e.target.files
    let done = url => {
      CustomAntdModal.show({
        title: '选择封面图片',
        className: 'modal__cropper',
        url: url,
        footer: null,
        render: props => {
          return <ModalCropper {...props} />
        },
        callback: result => {
          if (result) {
            let covers = getFieldValue('covers') || []
            if (isDev()) {
              covers[index] = result
            } else {
              covers[index] = `/edu/course/diandu_v1/${result}`
            }
            setFieldsValue({ covers: covers })
          }
        }
      })
    }
    // 获取图片数据
    if (files && files.length > 0) {
      file = files[0]
      if (URL) {
        done(URL.createObjectURL(file))
      } else if (FileReader) {
        reader = new FileReader()
        reader.onload = () => {
          done(reader.result)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  // 删除封面图片
  handleDelCovers = (item, index, e) => {
    e.stopPropagation()
    e.preventDefault()
    const { getFieldValue, setFieldsValue } = this.props.form
    let covers = getFieldValue('covers') || []
    covers.splice(index, 1)
    setFieldsValue({ covers: covers })
  }

  // 添加点读页
  handleAddPage = () => {
    const { setFieldsValue, getFieldValue } = this.props.form
    let pages = getFieldValue('pages')
    pages.push({
      w: PAGE_SIZE.width,
      h: PAGE_SIZE.height,
      points: []
    })
    setFieldsValue({ pages: pages })
  }

  // 批量上传图片，添加点读页
  handleAddCallback = pageData => {
    const { setFieldsValue, getFieldValue } = this.props.form
    let pages = getFieldValue('pages')
    pages.push({
      w: PAGE_SIZE.width,
      h: PAGE_SIZE.height,
      points: [],
      ...pageData
    })
    setFieldsValue({ pages: pages })
  }

  // 全局点读页设置
  // 设置点读页空白区域颜色，点读点大小，点读页切换的动画
  handleGlobalPageSetting = () => {
    CustomAntdModal.show({
      title: '全局点读页设置',
      footer: null,
      render: props => <GlobalPageSetting form={this.props.form} {...props} />
    })
  }

  // 提交点读页
  handleSubmit = () => {
    this.props.form.validateFields((err, data) => {
      if (err) {
        let firstError = ''
        for (const key in err) {
          if (err.hasOwnProperty(key)) {
            firstError = err[key]['errors'][0]['message']
            break
          }
        }
        message.error(firstError, 3, null)
      } else {
        saveData(this.props.id, data).then(id => {
          let unitId = queryString('unitid')
          let editId = queryString('editid')
          if (isDev()) {
            window.location.href = `create.html?id=${id}`
          } else {
            if (editId) {
              window.location.href = `/point-read/${editId}.html`
            } else {
              window.location.href = `/edu/course/unit_video.php?unitid=${unitId}`
            }
          }
        })
      }
    })
  }

  // 基本信息
  renderBaseInfo() {
    const { getFieldProps } = this.props.form
    return (
      <section>
        <div className="setting__title">基本信息</div>

        <div className="setting__item">
          <p>点读页名称</p>
          <input
            type="text"
            style={{ width: 423 }}
            placeholder="页面的标题"
            {...getFieldProps('title', { initialValue: '', rules: [{ required: true, message: '页面标题不能为空!' }] })}
          />
        </div>

        <div className="setting__item">
          <p>简介</p>
          <textarea
            style={{ width: 708, height: 100 }}
            placeholder="介绍测试的相关内容、注意点等,简洁不能超过100字"
            {...getFieldProps('intro', { initialValue: '', rules: [{ required: true, message: '简介不能为空!' }] })}
          />
        </div>

        <div className="setting__item">
          <p>关键词</p>
          <div>
            <div>
              <input type="text" style={{ width: 400 }} {...getFieldProps('keywords', { initialValue: '' })} />
              <a
                style={{ marginLeft: 10 }}
                className="u-btn u-btn--green"
                href="http://s.tool.chinaz.com/baidu/words.aspx#form"
                target="_blank"
              >
                长尾关键词查询
              </a>
            </div>
            <div className="setting__item-desc">
              (多个关键词之间用空格分割，为便于扩大影响力，请点击长尾关键词查询，尽量选择引擎排名靠前的长尾关键词)
            </div>
          </div>
        </div>

        <div className="setting__item">
          <p>缩略图</p>
          <div>
            {this.renderUploadBtns()}
            <div className="setting__item-desc">
              (缩略图像素要求为205x205,上传多个缩略图，可实现鼠标预选序号动画效果)
            </div>
          </div>
        </div>
      </section>
    )
  }

  // 上传封面图片
  renderUploadBtns() {
    const { getFieldValue } = this.props.form
    let covers = getFieldValue('covers') || []

    // 生成5个缩略图上传位置， 因此该数组只有长度有意义，其他没有意义
    const btnCount = [1, 2, 3, 4, 5]

    return (
      <div className="upload__btns">
        {btnCount.map((item, index) => {
          return (
            <label key={index} className="upload__btn" htmlFor={`file-input_${index}`}>
              {covers[index] ? (
                <React.Fragment>
                  <Icon
                    className="upload__btn-del"
                    type="close"
                    onClick={this.handleDelCovers.bind(this, item, index)}
                  />
                  <img src={covers[index]} />
                </React.Fragment>
              ) : (
                <Icon type="plus" />
              )}
              <input
                type="file"
                id={`file-input_${index}`}
                className="u-only"
                name="image"
                accept="image/*"
                onChange={this.handleFileChange.bind(this, index)}
              />
            </label>
          )
        })}
      </div>
    )
  }

  // 权限
  renderCompetence() {
    const { getFieldProps, getFieldValue } = this.props.form
    let fieldName = 'competence'
    const radioConfig = [
      { title: '公开</br>首页展示', value: 0 },
      { title: '仅在组内展示</br>(限组内成员展示)', value: 1 },
      { title: '仅限VIP访问', value: 2 }
    ]
    return (
      <section>
        <div className="setting__title">权限控制</div>
        <div className="setting__item">
          <p>可访问范围</p>
          <ul className="setting-item__radio-group">
            {radioConfig.map((item, index) => {
              return (
                <li
                  key={index}
                  className={classnames({
                    'radio--active': item.value === getFieldValue(fieldName)
                  })}
                  dangerouslySetInnerHTML={{ __html: item.title }}
                  onClick={this.handleChange.bind(this, fieldName, item.value)}
                  {...getFieldProps(fieldName, { initialValue: '' })}
                />
              )
            })}
          </ul>
        </div>
      </section>
    )
  }

  // 收费
  renderCharge() {
    const { getFieldProps, getFieldValue } = this.props.form
    let fieldName = 'charge'
    const radioConfig = [
      { title: '免费<br/>或由视频收费', value: 0 },
      { title: '收费但对VIP免费', value: 1 },
      { title: '收费但对VIP半价', value: 2 },
      { title: '全部收费', value: 3 }
    ]
    return (
      <section>
        <div className="setting__title">收费设置</div>
        <div className="setting__item">
          <p>收费设置</p>
          <ul className="setting-item__radio-group">
            {radioConfig.map((item, index) => {
              return (
                <li
                  key={index}
                  className={classnames({
                    'radio--active': item.value === getFieldValue(fieldName)
                  })}
                  dangerouslySetInnerHTML={{ __html: item.title }}
                  onClick={this.handleChange.bind(this, fieldName, item.value)}
                  {...getFieldProps(fieldName, { initialValue: '' })}
                />
              )
            })}
          </ul>
        </div>
        <div className="setting__item">
          <p>收费标准</p>
          <input style={{ width: 200 }} type="number" {...getFieldProps('cost', { initialValue: '' })} />
          <span className="setting__item-unit">元</span>
        </div>
      </section>
    )
  }

  // 分享信息
  renderShareInfo() {
    const { getFieldProps, getFieldValue } = this.props.form
    let shareInfo = getFieldValue('share') || {}
    let imgUrl = shareInfo.imgUrl
    let shareUploadStyle = {}
    if (imgUrl) {
      shareUploadStyle.backgroundImage = `url(${imgUrl})`
    }
    return (
      <section>
        <div className="setting__title">分享内容设置（访客可分享到 QQ和微信，可点击修改标题，简介和图片)</div>
        <div className="setting__item">
          <p>分享信息</p>
          <div className="setting-item__share">
            <div className="share__header">
              <textarea placeholder="分享标题" {...getFieldProps('share.title', { initialValue: '' })} />
              <div className="share__content">
                <textarea placeholder="分享描述" {...getFieldProps('share.desc', { initialValue: '' })} />
                <div
                  className="share__upload"
                  style={shareUploadStyle}
                  {...getFieldProps('share.imgUrl', { initialValue: '' })}
                >
                  <ReactWebUploader id="btn_upload-shareimg" uploadSuccess={this.handleSharePicSuccess} />
                </div>
              </div>
            </div>
            <div className="share__footer">
              <span>布丁云书</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // 背景音乐
  renderBgAudioInfo() {
    const { uploadProgressBgAudio } = this.state
    const { getFieldProps, getFieldValue, setFieldsValue } = this.props.form
    getFieldProps('bgAudio')
    let bgAudioInfo = getFieldValue('bgAudio')
    return (
      <section>
        <div className="setting__title">自动播放时的音乐设置(可选)</div>
        <div className="setting__item">
          <ReactWebUploader
            id="btn_uploadBgAudio"
            className="u-btn u-white u-btn--green upload__bgaudio"
            label={(bgAudioInfo && bgAudioInfo.name + ' (点击重新上传)') || '点击上传自动播放时的背景音乐(MP3格式)'}
            config={{
              accept: {
                title: 'audio files',
                extensions: 'mp3',
                mimeTypes: 'audio/mpeg'
              }
            }}
            uploadSuccess={this.uploadSuccessBgAudio}
            uploadProgress={this.uploadProgressBgAudio}
          />
          {uploadProgressBgAudio ? <div className="upload__bgaudio-progress">{uploadProgressBgAudio}%</div> : ''}
          {!uploadProgressBgAudio && bgAudioInfo ? (
            <div
              className="u-btn u-white u-btn--red"
              onClick={() => {
                setFieldsValue({ bgAudio: null })
              }}
            >
              删除
            </div>
          ) : (
            ''
          )}
        </div>
      </section>
    )
  }

  // 点读页
  renderPages() {
    const { getFieldValue } = this.props.form
    let pages = getFieldValue('pages') || []
    return (
      <section>
        <div className="setting__title">
          点读页全局设置 <IconFont type="shezhi" onClick={this.handleGlobalPageSetting} />
        </div>
        <div className="setting__item u-padding-0">
          <div style={{ width: '100%' }}>
            {pages.map((item, index) => {
              if (item.isRemove) {
                return ''
              }
              return (
                <PageItem
                  key={index}
                  pageIndex={index}
                  data={item}
                  onAddCallback={this.handleAddCallback} // 如果一次性上传多个图片，则生成多个点读页
                  form={this.props.form}
                />
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  render() {
    return (
      <React.Fragment>
        <AppHeader />
        <div className="page">
          <div className="page__header">创建点读页</div>
          <div className="page__setting">
            {/* 页面常规设置 renderBaseInfo  renderCompetence  renderCharge 会报不可控组件错误*/}
            {this.renderBaseInfo()}
            {this.renderCompetence()}
            {this.renderCharge()}
            {this.renderShareInfo()}
            {this.renderBgAudioInfo()}
            {/* 点读页相关 */}
            {this.renderPages()}
            {/* 添加点读页 */}
            <div style={{ width: '50%' }} className="u-btn u-btn--green pageitem__add" onClick={this.handleAddPage}>
              新增点读页
            </div>
            <br />
            <br />
            <div style={{ width: '70%' }} className="u-btn u-btn--green" onClick={this.handleSubmit}>
              提交
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default createForm()(App)
