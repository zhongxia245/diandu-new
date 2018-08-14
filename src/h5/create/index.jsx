import 'animate.css'
import App from './app/_index'
import { getData } from './ajax/_ajax'
import queryString from 'common/js/utils/query_string'

let id = queryString('id')

const render = (id, data) => {
  let defaultData = {
    charge: 0,
    cost: 0,
    competence: 0,
    share: { imgUrl: 'https://www.catics.org/edu/public/img/logo-index.png' },
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
