import './index.less'
import React, { Component } from 'react'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { uploadBase64Img } from '@/ajax'
import { Button } from 'antd'

export default class ModalCropper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imgData: ''
    }
  }

  onCropper = () => {
    uploadBase64Img(this.cropper.getCroppedCanvas()).then(result => {
      this.props.onOk && this.props.onOk(result.data)
    })
  }

  render() {
    const { url, onCancel = () => {} } = this.props
    return (
      <div className="react-cropper">
        <Cropper
          ref={dom => {
            this.cropper = dom
          }}
          src={url}
          style={{ height: 400, width: '100%' }}
          // Cropper.js options
          aspectRatio={1}
          dragMode={'move'}
          cropBoxData={{
            width: 200,
            height: 200
          }}
          guides={true}
        />
        <div className="cropper__btns">
          <Button onClick={onCancel} style={{ marginRight: '15px' }}>
            取消
          </Button>
          <Button type="primary" onClick={this.onCropper}>
            确定
          </Button>
        </div>
      </div>
    )
  }
}
