
import { Listbox } from '@headlessui/react'
import {useState} from "react";
import {CogIcon, PlusIcon} from "@heroicons/react/20/solid";

const people = [
    { id: 1, name: 'Durward Reynolds', unavailable: false },
    { id: 2, name: 'Kenton Towne', unavailable: false },
    { id: 3, name: 'Therese Wunsch', unavailable: false },
    { id: 4, name: 'Benedict Kessler', unavailable: true },
    { id: 5, name: 'Katelyn Rohan', unavailable: false },
]

export default function ConceptForm({ properties = [] }) {
    const [selectedPerson, setSelectedPerson] = useState(people[0])

    return (
        <form className="w-full max-w-lg mx-auto mt-8">
            {properties.map((property: any) => (
                <div className="flex flex-wrap mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <input
                            name={property.name}
                            type="text"
                            autoComplete="false"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            value={property.name}
                        />
                    </div>
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <select
                            name={`${property.name}-type`}
                            autoComplete="false"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            value={property.type}
                        >
                            <option value='text'>Text</option>
                            <option value='number'>Number</option>
                            <option value='email'>Email</option>
                            <option value='phone_number'>Phone Number</option>
                            <option value='reference'>Reference</option>
                        </select>
                    </div>
                </div>
            ))}

            <div className="flex flex-wrap mb-6">
                <button
                    className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
                >
                    <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                    add property
                </button>
            </div>
        </form>
    )
}