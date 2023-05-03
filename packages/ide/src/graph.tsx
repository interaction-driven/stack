import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Activity from './ActivityGraph/ActivityGraph'
import './App.css'

import {activity, interactions} from '../../example/activity/friendRequest'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <Activity data={activity} />
  </React.StrictMode>,
)
