import './index.less'
import 'animate.css'
import './handle'

import React from 'react'
import ReactDOM from 'react-dom'
import { createForm } from 'rc-form'
import { message, LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import ReactIScroll from 'react-iscroll'
import iScroll from 'iscroll'

import queryString from 'common/js/utils/query_string'
import { getData } from '@/ajax'
import { setShare } from './common/share'
import Show from './show'

let id = queryString('id')

// TODO: 检查是否付费了，应该有一个接口来进行判断是否付费了, 目前先默认不判断
const checkCharge = data => {
  // if (data.cost > 0) {
  //   return false
  // }
  return true
}

// 增加rc-form来管理状态
let RcShow = createForm()(Show)
if (id) {
  getData(id).then((data = {}) => {
    console.log(data)

    if (checkCharge(data)) {
      setShare(data.share)
      document.title = `${data.title} - 点读`

      ReactDOM.render(
        <ReactIScroll iScroll={iScroll}>
          <LocaleProvider locale={zhCN}>
            <RcShow data={data} />
          </LocaleProvider>
        </ReactIScroll>,
        document.getElementById('app')
      )
    } else {
      message.warning('对不起，该点读为收费项目，请付费查看', 100, null, false)
    }
  })
} else {
  message.error('该点读页不存在', 100, null, false)
}
