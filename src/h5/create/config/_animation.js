/**
 * 动画相关设置
 */

export const DIRECTIONS = [
  { title: '从左往右', className: 'Right', icon: 'right' },
  { title: '从上往下', className: 'Down', icon: 'down' },
  { title: '从右往左', className: 'Left', icon: 'left' },
  { title: '从下往上', className: 'Up', icon: 'up' }
]

export const XY = [
  { title: 'X轴翻转', className: 'X', icon: 'flipx' },
  { title: 'Y轴翻转', className: 'Y', icon: 'flipy' }
]

export const ANIMATIONS = [
  { icon: 'bounce', title: '弹跳', className: 'bounce', directions: DIRECTIONS },
  { icon: 'fade', title: '透明', className: 'fade', directions: DIRECTIONS },
  { icon: 'slide', title: '滑动', className: 'slide', directions: DIRECTIONS },
  { icon: 'zoom', title: '变焦', className: 'zoom', directions: DIRECTIONS },
  { icon: 'flip', title: '翻转', className: 'flip', directions: XY },
  { icon: 'flash', title: '闪烁', className: 'flash' },
  { icon: 'pulse', title: '跳动', className: 'pulse' },
  { icon: 'shake', title: '摇动', className: 'shake' },
  { icon: 'swing', title: '摇摆', className: 'swing' },
  { icon: 'tada', title: '突显', className: 'tada' },
  { icon: 'wobble', title: '摇晃', className: 'wobble' },
  { icon: 'jello', title: '晃动', className: 'jello' }
]

export const SETTINGS = [
  {
    title: '时间',
    type: 'slider',
    key: 'duration',
    min: 0,
    max: 10,
    step: 0.1
  },
  { title: '延迟', type: 'slider', key: 'delay', min: 0, max: 10, step: 0.1 },
  {
    type: 'custom',
    min: 0,
    max: 5,
    key: 'count',
    key1: 'cycle'
  }
]
