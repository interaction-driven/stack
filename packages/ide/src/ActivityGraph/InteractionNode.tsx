import {Interaction, Payload} from "../../../base/types";
import useGlobalCodeEditor from "../store/code";
import useConceptEditor from "../store/concpet";
import * as concepts from "../data/concept";


function renderRef(value: any) {
    return value.ref ?
        <>
            {renderRoleIcon(value.ref === 'to')}
            <span className={value.ref === 'to' ? "text-cyan-400" : "text-purple-600"}>{value.ref}</span>
        </> :
        <span className="text-teal-600 underline cursor-pointer">{value.name}</span>
}


function renderPayload(payload?: Payload) {
    if (!payload) return null

    const showData = useGlobalCodeEditor((state) => state.showData)
    const showConceptData = useConceptEditor((state) => state.showData)

    const showEditor = (item: string) => {
        // @ts-ignore
        if (concepts[item]) {
            // @ts-ignore
            if (concepts[item].type === 'entity') {
                // @ts-ignore
                showConceptData(concepts[item])
            }else {
                // @ts-ignore
                showData(concepts[item])
            }
        } else {
            alert(item)
        }
    }


    return (
        <div className="">
            {Array.from((payload as Map<string, any>).entries()).map(([key, value]) => {
                return <div className="flex content-center">
                    <span>{key}</span>
                    <span className="px-1">:</span>
                    <span className="text-teal-600 underline cursor-pointer" onClick={() => showEditor(capitalize(value.name || value.type))} >{value.name || capitalize(value.type)}</span>
                    {renderAs(value)}
                </div>
            })}
        </div>
    )
}

function capitalize(str: string) {
    return str[0].toUpperCase() + str.slice(1)
}


function renderRoleIcon(color?: any) {
    const className = color ? '-6 h-6 text-cyan-400 inline-block' : '-6 h-6 text-purple-600 inline-block'

    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
             className={className}>
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>

    )
}

function renderAs(value: any) {
    return value?.as?
        (<>
            <span className="px-1">as</span>
            {value.as === 'to' ?  renderRoleIcon(true) : renderRoleIcon()}
            <span className={value.as === 'to' ? 'text-cyan-400' : 'text-purple-600'}>{value.as}</span>
        </>)
        : null
}

export default function InteractionNode({ data} : {data: Interaction}) {
    return <div className="inline-block overflow-hidden bg-white shadow sm:rounded-lg px-4 py-2 text-slate-400">
        <div className="flex content-center">
            {renderRef(data.role)}
            {renderAs(data.role)}
        </div>
        <div className="text-slate-800 font-bold">{data.action}</div>
        {renderPayload(data.payload)}
    </div>
}