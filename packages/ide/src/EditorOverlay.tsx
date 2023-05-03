import { Fragment, useState } from 'react'
import { Transition, Popover } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Editor from "./Editor";
import useGlobalCodeEditor from './store/code'

export default function EditorOverlay() {

    // @ts-ignore
    const visible = useGlobalCodeEditor((state) => state.visible)
    // @ts-ignore
    const clear = useGlobalCodeEditor((state) => state.clear)
    // @ts-ignore
    const { name, description, code }: {name: string, description: string, code: string} = useGlobalCodeEditor((state) => state.data)

    return (
        <Transition.Root show={visible} as={Fragment}>
            <Popover as="div" className="relative z-10" >
                <div className="pointer-events-none fixed inset-y-0 right-0 flex w-[72rem] max-w-full pl-10 sm:pl-16">
                    <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-500 sm:duration-700"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-500 sm:duration-700"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                    >
                        <Popover.Panel className="pointer-events-auto w-screen ">
                            <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl mt-14">
                                <div className="px-4 sm:px-6">
                                    <div className="flex items-start justify-between">
                                        <h1 className="text-base font-semibold leading-6 text-gray-900">
                                            {name}
                                        </h1>
                                        <button
                                            type="button"
                                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            onClick={clear}
                                        >
                                            <span className="sr-only">Close panel</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                    <p className="mt-1 mb-2 max-w-2xl text-sm leading-6 text-gray-500">
                                        {description}
                                    </p>
                                    <Editor code={code} />
                                </div>
                            </div>
                        </Popover.Panel>
                        </Transition.Child>
                </div>
            </Popover>
        </Transition.Root>
    )
}
