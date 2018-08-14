/**
 * 右侧内容，点读内容上传
 */
import React, { Component } from 'react'
import { getPointConfigByType } from '@h5/config'
import { ReactWebUploader } from 'common/js/components'

class ContentUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uploading: false,
      uploadProgress: 0
    }
  }

  handleStartUpload = () => {
    this.setState({ uploading: true })
  }

  handleUploadSuccess = (file, path) => {
    this.props.setPointData({ data: { src: path, name: file.name } })
    this.setState({ uploadProgress: 0, uploading: false })
  }

  handleUploadProgress = (file, progress) => {
    this.setState({ uploadProgress: progress * 100 })
  }

  render() {
    const { uploading, uploadProgress } = this.state
    const pointData = this.props.getPointData()
    const isUpload = (pointData['data'] && pointData['data']['src']) || false

    const POINT_CONFIG = getPointConfigByType(pointData.type)

    let uploadJsxDom = (
      <div className="content-upload">
        <p>暂无内容</p>
      </div>
    )

    // 已经上传
    if (isUpload) {
      uploadJsxDom = (
        <div className="content-upload">
          <p>{pointData['data']['name']}</p>
          <a download={pointData['data']['name']} href={pointData['data']['src']}>
            下载
          </a>
        </div>
      )
    }

    // 正在上传则显示进度
    if (uploading) {
      uploadJsxDom = (
        <div className="content-upload">
          <p>{uploadProgress}%</p>
          <div style={{ width: `${uploadProgress.toFixed(2)}%` }} className="content-upload__progress" />
        </div>
      )
    }

    let otherProps = {
      id: `upload_point_content_${this.props.pageIndex}`,
      className: 'u-btn u-white u-btn--green',
      style: { width: '100%' },
      label: isUpload ? '重新上传' : '上传文件',
      startUpload: this.handleStartUpload,
      uploadSuccess: this.handleUploadSuccess,
      uploadProgress: this.handleUploadProgress
    }
    if (POINT_CONFIG) {
      otherProps.config = { accept: POINT_CONFIG.accept }
    } else {
      otherProps.config = {}
    }

    return (
      <div className="tools__item">
        <h4>内容上传</h4>
        <div className="tools-item__content">
          {uploadJsxDom}
          <ReactWebUploader {...otherProps} />
        </div>
      </div>
    )
  }
}

export default ContentUpload
