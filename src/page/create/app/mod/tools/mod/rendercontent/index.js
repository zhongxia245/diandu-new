import './index.less'
import ContentEditor from './content_editor'
import ContentUpload from './content_upload'
import ContentInput from './content_input'
// import ContentButton from './content_button'
import ContentModalEditor from './content_modal_editor'
import ContentModalExam from './content_modal_exam'

export default props => {
  let pointData = props.getPointData()
  switch (pointData.type) {
    case 'audio':
    case 'video':
    case '3d':
      return <ContentUpload {...props} />
    // 文本框
    case 'note':
      return <ContentEditor {...props} />
    case 'tabs_note':
      return <ContentModalEditor {...props} />
    case 'link':
      return <ContentInput {...props} />
    case 'input':
      return <div className="tools__tip">点击文本框区域，可快速编辑内容</div>
    case 'test':
      return <ContentModalExam {...props} />
    default:
      return <div className="tools__tip">请选择点读点类型</div>
  }
}
