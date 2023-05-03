import * as monaco from 'monaco-editor';
import {useLayoutEffect, useRef, useState} from "react";

self.MonacoEnvironment = {
    getWorker: function (workerId, label) {
        const getWorkerModule = (moduleUrl: string, label: string) => {
            // @ts-ignore
            return new Worker(self.MonacoEnvironment.getWorkerUrl(moduleUrl), {
                name: label,
                type: 'module'
            });
        };

        switch (label) {
            case 'json':
                return getWorkerModule('/monaco-editor/esm/vs/language/json/json.worker?worker', label);
            case 'css':
            case 'scss':
            case 'less':
                return getWorkerModule('/monaco-editor/esm/vs/language/css/css.worker?worker', label);
            case 'html':
            case 'handlebars':
            case 'razor':
                return getWorkerModule('/monaco-editor/esm/vs/language/html/html.worker?worker', label);
            case 'typescript':
            case 'javascript':
                return getWorkerModule('/monaco-editor/esm/vs/language/typescript/ts.worker?worker', label);
            default:
                return getWorkerModule('/monaco-editor/esm/vs/editor/editor.worker?worker', label);
        }
    }
};


export default function Editor({ code }: {code?: string}) {

    const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoEl = useRef(null);

    useLayoutEffect(() => {
        if (monacoEl) {
            setTimeout(() => {
                setEditor((editor) => {
                    if (editor) return editor;

                    return monaco.editor.create(monacoEl.current!, {
                        value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
                        language: 'typescript'
                    });
                });
            }, 1000)

        }

        return () => editor?.dispose();
    })
    return <div className="h-96" ref={monacoEl}></div>
}