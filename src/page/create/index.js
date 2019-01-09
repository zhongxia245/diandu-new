import 'animate.css'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import { getData } from '@/ajax'
import queryString from 'common/js/utils/query_string'

let id = queryString('id')

const render = (id, data) => {
  let defaultData = {
    title: '',
    keywords: '',
    charge: 0,
    cost: 0,
    competence: 0,
    share: { imgUrl: 'https://www.catics.org/edu/public/img/logo-index.png', title: '', desc: '' },
    pages: [{ points: [] }]
  }
  data = { ...defaultData, ...data }

  ReactDOM.render(<App id={id} data={data} />, document.getElementById('app'))
}

// 存在id，则表示编辑，否则标识创建
if (id) {
  getData(id).then(data => {
    render(id, data)
  })
} else {
  render()
}
