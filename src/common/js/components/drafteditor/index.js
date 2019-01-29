/**
 * 2018-05-29 12:11:40
 * 富文本编辑器
 * 如果把组件迁移到另外地方使用，则需要重新指定上传的路径
 * TODO:目前接口返回的图片路径是相对的，因此访问的时候需要注意相对路径
 * 目前返回的相对路径，在 /h5 根目录下的html 刚好可以访问这个图片路径。
 */
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './index.less'
import React, { Component } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import { isDev } from 'common/js/utils'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

let BASE_URL = '/edu/course/diandu_v1'
if (isDev()) {
  BASE_URL = ''
}

class DraftEditor extends Component {
  constructor(props) {
    super(props)
    // 工具栏配置
    this.toolbarConfig = {
      options: ['fontSize', 'colorPicker', 'fontFamily', 'image'],
      image: {
        urlEnabled: true,
        uploadEnabled: true,
        alignmentEnabled: true,
        previewImage: true,
        uploadCallback: this.uploadImageCallBack,
        inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg'
      },
      fontFamily: {
        options: ['Microsoft Yahei', 'Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana']
      }
    }

    // 默认值配置
    const contentBlock = htmlToDraft(decodeURIComponent(props.html) || '')
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      this.state = {
        editorState
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const contentBlock = htmlToDraft(decodeURIComponent(nextProps.html) || '')
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      this.state = {
        editorState
      }
    }
  }

  uploadImageCallBack = file => {
    let basePath = this.props.basePath || ''
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', BASE_URL + '/php/webuploader.php')
      const data = new FormData()
      data.append('file', file)
      xhr.send(data)
      xhr.addEventListener('load', () => {
        const path = JSON.parse(xhr.responseText)
        // 组件需要的图片返回格式
        resolve({ data: { link: basePath + path } })
      })
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText)
        reject(error)
      })
    })
  }

  getHtml = () => {
    let editorState = this.content.getEditorState()
    return encodeURIComponent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState
    })
    let html = this.getHtml()
    if (typeof html === 'string') {
      this.props.onChange && this.props.onChange(html)
    }
  }

  render() {
    const { editorState } = this.state

    return (
      <Editor
        ref={content => (this.content = content)}
        toolbar={this.toolbarConfig}
        localization={{ locale: 'zh' }}
        editorState={editorState}
        onEditorStateChange={this.onEditorStateChange}
        {...this.props}
      />
    )
  }
}

export default DraftEditor
