/**
 * 该文件会先构建出来，放在common/js/dist目录下
 * 然后在html文件里面直接引用
 */
import 'babel-polyfill'
import jQuery from 'jquery/dist/jquery.min.js'
import React from 'react'
import ReactDOM from 'react-dom'

import queryString from './utils/query_string'
import './lib/calculate_rem'
import './lib/fastclick'

FastClick && FastClick.attach(document.body)

global.$ = jQuery
global.jQuery = jQuery
global.React = React
global.ReactDOM = ReactDOM

if (queryString('debug')) {
  if (jQuery) {
    jQuery.getScript('https://res.wx.qq.com/mmbizwap/zh_CN/htmledition/js/vconsole/3.0.0/vconsole.min.js', () => {
      window.vConsole = new window.VConsole()
    })
  }
}
