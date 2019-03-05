import Event from 'common/js/event.js'
import { EVENT_NAME } from '../handle/const'
import CustomAntdModal from 'common/js/components/custom_antd_modal'
import { Tabs } from 'antd'

Event.on(EVENT_NAME.MODAL_TABSNOTE_SHOW, pointData => {
  let tabs = (pointData.data && pointData.data.tabs) || []
  CustomAntdModal.show({
    centered: true,
    wrapClassName: 'modal__tabs_note',
    render: () => <TabsNote tabs={tabs} />
  })
})

const TabsNote = ({ tabs }) => (
  <Tabs>
    {tabs.map(item => {
      return (
        <Tabs.TabPane tab={item['title']} key={item['key']}>
          <div className="u-padding-10" dangerouslySetInnerHTML={{ __html: decodeURIComponent(item.content) }} />
        </Tabs.TabPane>
      )
    })}
  </Tabs>
)
