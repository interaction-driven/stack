import {PlayIcon, StopIcon, ArrowDownOnSquareStackIcon, CogIcon, Cog6ToothIcon} from '@heroicons/react/20/solid'
import {useState} from "react";
import globalCommand from './store/command.ts'

const commandToCall = ['showModule', 'showActivity', 'showCode']
export default function ChatWidget() {
    const [commandIndex, setCommandIndex] = useState(0)
    const [status, setStatus] = useState(0)
    const [inputValue, setInputValue] = useState('')

    const changeStatus = () => {
        if (status === 1) return

        // debugger
        setStatus(1)
        setTimeout(() => {

            setStatus(0)
            setCommandIndex(commandIndex+1)
            globalCommand[commandToCall[commandIndex]]()
            setInputValue('')
        }, 1000)
    }

    console.log('render', status)

    return (
        <div className="fixed bottom-12 w-full flex justify-center z-50">
            <div
                className="w-1/2 overflow-hidden rounded-lg bg-white shadow-lg">
                <div className="p-4">
                    <div className="sm:flex w-full sm:items-center justify-center">
                        <div className="w-full  grow">
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                name="command"
                                className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Say something"
                                autoComplete='false'
                            />
                        </div>
                        <button
                            className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
                            onClick={changeStatus}
                        >
                            { status === 0 ? 'Send' : <CogIcon  color={"slate"} className="-ml-0.5 h-5 w-5 animate-spin" aria-hidden="true" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

