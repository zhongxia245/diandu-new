/**
 * 把Antd-mobile 的 Model 组件，封装成函数调用的方式
 import CustomAntdModal from 'common/js/components/custom_antd_modal.js'
 CustomAntdModal.show({render:(props)=><div>Hello Modal!</div>})
 */
import { Modal } from 'antd'
import classnames from 'classnames'

const CustomAntdModal = props => {
  const { title, render, className, ...otherProps } = props
  return (
    <Modal title={title} wrapClassName={classnames('custom-antd-modal', className)} {...otherProps}>
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
      width: 720,
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
