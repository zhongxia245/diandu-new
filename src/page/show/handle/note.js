import Event from 'common/js/event.js'
import { EVENT_NAME } from '../handle/const'
import CustomAntdModal from 'common/js/components/custom_antd_modal'

Event.on(EVENT_NAME.MODAL_NOTE_SHOW, pointData => {
  let content = (pointData.data && pointData.data.content) || ''

  CustomAntdModal.show({
    centered: true,
    wrapClassName: 'modal__note',
    render: () => <div className="u-padding-10" dangerouslySetInnerHTML={{ __html: decodeURIComponent(content) }} />
  })
})
