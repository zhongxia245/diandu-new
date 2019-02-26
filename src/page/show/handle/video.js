/*
 * 点击视频点读点播放处理
 */
import { Toast } from 'antd-mobile'
import CustomModal from 'common/js/components/custom_modal.js'
import Event from 'common/js/event.js'
import { EVENT_NAME } from '../common/const'

Event.on(EVENT_NAME.VIDEO_PLAY, ({ src }) => {
  if (src) {
    Event.emit(EVENT_NAME.AUDIO_STOP)
    Event.emit(EVENT_NAME.BGAUDIO_STOP)
    CustomModal.show({
      closable: true,
      wrapClassName: 'custom-modal--video',
      render: () => (
        <div>
          <video controls controlsList="nodownload" src={src} />
        </div>
      )
    })
  } else {
    Toast.info('该点读点未上传视频文件', 3, null, false)
  }
})
