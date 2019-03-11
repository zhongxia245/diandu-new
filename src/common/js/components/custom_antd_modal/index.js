/**
 * 把Antd-mobile 的 Model 组件，封装成函数调用的方式
 import CustomAntdModal from 'common/js/components/custom_antd_modal'
 CustomAntdModal.show({render:(props)=><div>Hello Modal!</div>})
 */
import { Modal, Row, Button } from 'antd'
import classnames from 'classnames'
import './index.less'

// 因为用自带的底部按钮，用函数调用的形式，无法使用关闭回调处理
export const CustomAntdFooter = ({ cancelText = '取消', okText = '确定', onOk = () => {}, onCancel = () => {} }) => (
  <Row className="custom-antd-modal__footer">
    <Button onClick={onCancel}>{cancelText}</Button>
    <Button type="primary" onClick={onOk}>
      {okText}
    </Button>
  </Row>
)

const CustomAntdModal = props => {
  const { title, render, className, visible, ...otherProps } = props
  if (!visible) return null
  return (
    <Modal
      id="custom-antd-modal"
      title={title}
      footer={null}
      visible={visible}
      wrapClassName={classnames('custom-antd-modal', className)}
      {...otherProps}
    >
      {render && render(props)}
    </Modal>
  )
}

let render = props => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  render = nextProps => {
    props = { ...props, ...nextProps }
    ReactDOM.render(<CustomAntdModal {...props} />, container)
  }
  render()
}

export default {
  show({ callback, ...param }) {
    render({
      visible: true,
      maskClosable: false,
      keyboard: false,
      width: 900,
      cancelText: '取消',
      okText: '确定',
      onCancel: () => {
        this.hide()
      },
      onOk: data => {
        this.hide()
        callback && callback(data)
      },
      ...param
    })
  },
  hide() {
    render({ visible: false })
  },
  destroyAll() {
    Modal.destroyAll()
  }
}
