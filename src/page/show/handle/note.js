import Event from 'common/js/event.js'
import { EVENT_NAME } from '../common/const'
import CustomModal from 'common/js/components/custom_modal.js'

Event.on(EVENT_NAME.MODAL_NOTE_SHOW, pointData => {
  let content = (pointData.data && pointData.data.content) || ''

  CustomModal.show({
    wrapClassName: 'modal__note',
    render: prpos => <div className="u-padding-10" dangerouslySetInnerHTML={{ __html: decodeURIComponent(content) }} />
  })
})
