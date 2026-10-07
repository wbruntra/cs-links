import { render } from 'preact'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/styles.css'

import { App } from './app.jsx'

render(<App />, document.getElementById('app'))
