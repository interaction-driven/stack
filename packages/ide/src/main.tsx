import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import Module from './Module'
import Activity from './ActivityPage'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [{
            index: true,
            element: <Module />,
        },{
            path: 'module',
            element: <Module />,
        }, {
            path: 'module/:moduleId/activity',
            element: <Activity />
        }]
    },
]);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
