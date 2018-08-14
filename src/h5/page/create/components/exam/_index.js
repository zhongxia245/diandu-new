import Exam from './_exam'
import CustomModal from 'common/js/components/_custom_modal.js'

export const showExamModal = ({ onSubmit, questions }) => {
  CustomModal.show({
    className: 'modal__exam',
    maskClosable: false,
    title: '上传试卷',
    render: props => {
      return <Exam {...props} questions={questions} onSubmit={onSubmit} />
    }
  })
}
