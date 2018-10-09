import 'animate.css'
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
  ReactDOM.render(<App id={id} data={data || defaultData} />, document.getElementById('container'))
}

if (id) {
  getData(id).then(data => {
    render(id, data)
  })
} else {
  render()
}
