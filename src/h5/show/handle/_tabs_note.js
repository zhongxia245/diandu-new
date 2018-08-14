import Event from 'common/js/event.js'
import { EVENT_NAME } from '../common/_const'
import CustomModal from 'common/js/components/_custom_modal.js'
import { Tabs } from 'antd-mobile'

Event.on(EVENT_NAME.MODAL_TABSNOTE_SHOW, pointData => {
  let tabs = (pointData.data && pointData.data.tabs) || []
  CustomModal.show({
    wrapClassName: 'modal__tabs_note',
    render: prpos => <TabsNote tabs={tabs} />
  })
})

const TabsNote = ({ tabs }) => (
  <Tabs tabs={tabs}>
    {tabs.map(item => {
      console.log(item)
      return (
        <div
          className="u-padding-10"
          key={item['key']}
          dangerouslySetInnerHTML={{ __html: decodeURIComponent(item.content) }}
        />
      )
    })}
  </Tabs>
)
