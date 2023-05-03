import * as monaco from 'monaco-editor';
import {useLayoutEffect, useRef, useState} from "react";
import Monaco from '@monaco-editor/react';
import globalCommand from './store/command.ts'

export default function Editor({ code }: {code?: any }) {

    const [codeDisplay, setCodeDisplay] = useState(typeof code !== "string" ? '//未能生成，待补充' : code)

    if (typeof code === 'function') {
        globalCommand.showCode = () => {
            setCodeDisplay(code())
        }
    }

    return <div className="h-96" >
        <Monaco height="50vh" defaultLanguage="typescript" theme='vs-dark'  value={codeDisplay} options={{minimap: {enabled: false}}} />
    </div>
}