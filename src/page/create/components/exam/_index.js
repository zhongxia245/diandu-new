import Exam from './_exam'
import { CustomAntdModal } from 'common/js/components'

export const showExamModal = ({ onSubmit, questions }) => {
  CustomAntdModal.show({
    footer: null,
    className: 'modal__exam',
    title: '上传试卷',
    render: props => {
      return <Exam {...props} questions={questions} onSubmit={onSubmit} />
    }
  })
}
