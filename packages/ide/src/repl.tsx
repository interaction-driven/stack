import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Activity from './ActivityGraph/ActivityGraph'
import './App.css'

import * as socialModule from '../../example/activity/friendRequest'


import Program from "../../program/Program";

import {recursiveConvertActivityInteraction, callInteraction} from '../../runtime/server/callInteraction'
import createAPIs from '../../runtime/server/api'
import { MemorySystem } from '../../program/MemorySystem'
import {RoleType} from "../../base/types";
import * as Types from "../../runtime/baseTypes";


const userRole: RoleType = {
    type: 'role',  // role type
    attributes: {
        id: Types.Id,
        name: Types.String
    }
}

const system = new MemorySystem()

const program = new Program(socialModule)

const apis = createAPIs(program)


// TODO 需要展示静态的从 plugin 转换、修改的 concepts  interaction

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <div>repl</div>
  </React.StrictMode>,
)
