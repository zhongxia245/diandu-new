/*
 * 点击视频点读点播放处理
 */
import { message } from 'antd'
import CustomAntdModal from 'common/js/components/custom_antd_modal'
import Event from 'common/js/event.js'
import { EVENT_NAME } from '../handle/const'

Event.on(EVENT_NAME.VIDEO_PLAY, ({ src }) => {
  if (src) {
    Event.emit(EVENT_NAME.AUDIO_STOP)
    Event.emit(EVENT_NAME.BGAUDIO_STOP)

    CustomAntdModal.show({
      title: '视频播放',
      centered: true,
      wrapClassName: 'custom-modal--video',
      render: () => (
        <div>
          <video controls controlsList="nodownload" src={src} />
        </div>
      )
    })
  } else {
    message.warning('该点读点未上传视频文件', 3, null, false)
  }
})
