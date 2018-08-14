import './_index.less'
import React, { Component } from 'react'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { uploadBase64Img } from '@create/ajax/_ajax.js'

export default class ModalCropper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imgData: ''
    }
  }

  onCropper = () => {
    // let imgData = this.refs.cropper.getCroppedCanvas().toDataURL()
    // let blobImg = convertBase64UrlToBlob(imgData)
    // let formData = new FormData()
    // let nameImg = `${new Date().getTime()}.png`
    // formData.append('file', blobImg, nameImg)
    // Axios.post(BASE_URL + '/php/webuploader.php', formData).then(resp => {
    //   this.props.onClose(resp.data)
    // })

    uploadBase64Img(this.refs.cropper.getCroppedCanvas()).then(result => {
      this.props.onClose(result.data)
    })
  }

  render() {
    const { onClose, url } = this.props
    return (
      <div className="react-cropper">
        <Cropper
          ref="cropper"
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
