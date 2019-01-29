import 'webuploader/dist/webuploader.css'
import './index.less'
import React, { Component } from 'react'
import WebUploader from 'webuploader/dist/webuploader.html5only.min.js'
import uuid from 'uuid/v4'
import _ from 'lodash'
import { isDev } from 'common/js/utils'
import { Toast } from 'antd-mobile'

let BASE_URL = '/edu/course/diandu_v1'
if (isDev()) {
  BASE_URL = ''
}

const DEFAULT_PICK = 'picker'
const DEFAULT_CONFIG = {
  auto: true,
  server: BASE_URL + '/php/webuploader.php', // 'http://webuploader.duapp.com/server/fileupload.php',
  pick: '',
  // 分片上传，上传大文件的时候，需要分片，否则会撑爆内存
  chunked: true,
  chunkSize: 5 * 1024 * 1024, // 默认值 5M
  threads: 1,
  accept: {
    title: 'Images',
    extensions: 'gif,jpg,jpeg,bmp,png',
    mimeTypes: 'image/*'
  }
}

/**
 * 使用方法
 * 1. 设置 id ， config [对应webuploader的配置 ]
 * 2. 提供了几个参数 uploadProgress ,uploadSuccess , uploadError , uploadComplete
 */
export default class ReactWebUploader extends Component {
  initWebUploader = props => {
    const {
      id,
      config,
      uploadProgress,
      uploadSuccess,
      uploadError,
      uploadComplete,
      filesQueued,
      startUpload,
      error
    } = props

    this.uploader = WebUploader.create({
      ...DEFAULT_CONFIG,
      pick: '#' + (id || DEFAULT_PICK),
      formData: {
        uuid: uuid()
      },
      ...config
    })

    this.uploader.on('uploadProgress', (file, percentage) => {
      uploadProgress && uploadProgress(file, percentage)
    })

    this.uploader.on('uploadSuccess', (file, result) => {
      if (result && result.indexOf('error') === -1) {
        uploadSuccess && uploadSuccess(file, result)
      } else {
        Toast.info(`上传文件失败:${result}`)
      }
    })

    this.uploader.on('startUpload', (file, result) => {
      startUpload && startUpload(file, result)
    })

    this.uploader.on('uploadError', (file, reason) => {
      uploadError && uploadError(file)
    })

    this.uploader.on('filesQueued', file => {
      filesQueued && filesQueued(file)
    })

    this.uploader.on('uploadComplete', (file, result) => {
      uploadComplete && uploadComplete(file, result)
    })

    this.uploader.on('error', type => {
      if (error) {
        error(type)
      } else {
        if (type === 'Q_TYPE_DENIED') {
          Toast.info('不支持上传该类型的文件', 3, null, false)
        }
      }
    })
  }

  componentDidMount = () => {
    this.initWebUploader(this.props)
  }

  componentWillUnmount() {
    try {
      this.uploader.destroy()
    } catch (error) {}
  }

  componentWillReceiveProps(nextProps) {
    // 属性改变，则重新初始化上传组件
    if (!_.isEqual(this.props, nextProps)) {
      try {
        this.uploader.destroy()
      } catch (error) {}
      this.initWebUploader(nextProps)
    }
  }

  render() {
    const { id, label, className, style } = this.props
    return (
      <div className={className} style={style} id={id || DEFAULT_PICK}>
        {label}
      </div>
    )
  }
}
