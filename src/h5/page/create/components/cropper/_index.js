import './_index.less'
import React, { Component } from 'react'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { uploadBase64Img } from '@h5/ajax'

export default class ModalCropper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imgData: ''
    }
  }

  onCropper = () => {
    uploadBase64Img(this.cropper.getCroppedCanvas()).then(result => {
      this.props.onClose(result.data)
    })
  }

  render() {
    const { onClose, url } = this.props
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
          <button onClick={onClose}>取消</button>
          <button onClick={this.onCropper}>确定</button>
        </div>
      </div>
    )
  }
}
