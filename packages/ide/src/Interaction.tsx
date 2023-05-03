import * as concepts from './data/concept'
import useGlobalCodeEditor from './store/code'
import useConceptEditor from './store/concpet'

export default function Interaction({ role, action, payload } : { role: string, action: string, payload: string }) {
    const showData = useGlobalCodeEditor((state) => state.showData)
    const showConceptData = useConceptEditor((state) => state.showData)

    const showEditor = (item) => {
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
            alert(concepts, item)
        }
    }

    return <div className="">
        <span className="text-teal-600 underline cursor-pointer" onClick={() => showEditor(role)}>{role}</span>
        <span className="text-slate-800 font-bold px-4">{action}</span>
        <span className="text-teal-600 underline cursor-pointer" onClick={() => showEditor(payload)}>{payload}</span>
    </div>
}