import { PlayIcon, StopIcon, ArrowDownOnSquareStackIcon, Cog6ToothIcon } from '@heroicons/react/20/solid'
import {useState} from "react";
import apiData from './data/api'





export default function CommandWidget() {

    const [status, setStatus] = useState(0)

    const changeStatus = () => {
        const current = status
        if (current === 1) return;

        setStatus(1)
        setTimeout(() => {
            setStatus(current === 0 ? 2 : 0)


        }, 3000)
    }

    const downloadApi = () => {
        const blob = new Blob([JSON.stringify(apiData, null, 2)], { type: 'application/json' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = 'api.json'
        a.click()
    }


    return (
        <div
            className="fixed top-12 right-2 mt-8 overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="p-4">
                <div className="flex items-start">
                    <span className="isolate inline-flex rounded-md shadow-sm">
                      <button
                          type="button"
                          className="w-50 relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                          onClick={changeStatus}
                      >
                          {status === 0 && <PlayIcon color={"green"} fontSize={12} className="-ml-0.5 h-5 w-5" aria-hidden="true" />}
                          {status === 1 && <Cog6ToothIcon  color={"blue"} className="-ml-0.5 h-5 w-5 animate-spin" aria-hidden="true" />}
                          {status === 2 && <StopIcon color={"red"} className="-ml-0.5 h-5 w-5" aria-hidden="true" />}
                          {status === 0 && 'Run Server'}
                          {status === 1 && 'waiting'}
                          {status === 2 && 'Stop Server'}
                      </button>
                      <button
                          onClick={downloadApi}
                          type="button"
                          className=" relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                      >
                          <ArrowDownOnSquareStackIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                          Export APIs

                      </button>
                    </span>
                </div>
            </div>
        </div>
    )
}

