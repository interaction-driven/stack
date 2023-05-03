import {useLayoutEffect, useRef} from "react";
import {Cell, Graph, Node} from "@antv/x6";
import * as activityData from './data/activity'
import {Activity, Group, Interaction, Payload} from "../../base/types";
import { DagreLayout } from '@antv/layout'
import { register } from '@antv/x6-react-shape'
import useGlobalCodeEditor from "./store/code";
import useConceptEditor from "./store/concpet";
import * as concepts from "./data/concept";






Graph.registerNode(
    'event',
    {
        inherit: 'circle',
        attrs: {
            body: {
                strokeWidth: 2,
                stroke: '#5F95FF',
                fill: '#FFF',
            },
        },
    },
    true,
)



Graph.registerNode(
    'gateway',
    {
        inherit: 'polygon',
        attrs: {
            body: {
                refPoints: '0,10 10,0 20,10 10,20',
                strokeWidth: 2,
                stroke: '#5F95FF',
                fill: '#EFF4FF',
            },
            label: {
                text: '+',
                fontSize: 40,
                fill: '#5F95FF',
            },
        },
    },
    true,
)


register({
    shape: 'interaction',
    width: 200,
    height: 50,
    effect: ['data'],
    component: InteractionNode,
})


function capitalize(str: string) {
    return str[0].toUpperCase() + str.slice(1)
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


function renderAs(value: any) {
    return value?.as?
        (<>
            <span className="px-1">as</span>
            {value.as === 'to' ?  renderRoleIcon(true) : renderRoleIcon()}
            <span className={value.as === 'to' ? 'text-cyan-400' : 'text-purple-600'}>{value.as}</span>
        </>)
        : null
}

function renderRef(value: any) {
    return value.ref ?
        <>
            {renderRoleIcon(value.ref === 'to')}
            <span className={value.ref === 'to' ? "text-cyan-400" : "text-purple-600"}>{value.ref}</span>
        </> :
        <span className="text-teal-600 underline cursor-pointer">{value.name}</span>
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


function InteractionNode({ node }) {
    const data: Interaction = node.prop('data')
    return <div style={{width: '100%', height: '100%'}} className="overflow-hidden bg-white shadow sm:rounded-lg px-4 py-2 text-slate-400">
        <div className="flex content-center">
            {renderRef(data.role)}
            {renderAs(data.role)}
        </div>
        <div className="text-slate-800 font-bold">{data.action}</div>
        {renderPayload(data.payload)}
    </div>
}

register({
    shape: 'group',
    width: 120,
    height: 50,
    effect: ['data'],
    component: GroupNode,
})

function GroupNode({ node }) {
    const data: Group= node.prop('data')
    return <div style={{width: '100%', height: '100%'}}  className="overflow-hidden bg-white py-2 shadow sm:rounded-lg">
        <div style={{textAlign: 'center'}}>{data.type.toUpperCase()} group</div>
    </div>
}

register({
    shape: 'end',
    width: 50,
    height: 50,
    effect: ['data'],
    component: EndNode,
})

function EndNode( ) {
    return <div style={{width: '100%', height: '100%', borderRadius: '50%'}}  className="overflow-hidden bg-black shadow sm:rounded-lg">
    </div>
}

function createGraphNodeFromActivity(graph: Graph, activity: Activity, parent?: Node) {
    Object.entries(activity.interactions).forEach(([interactionName, interaction]) => {
        const nodeData = {shape: 'interaction', height: 60, width: 100, label: interactionName, data: interaction}
        const node = parent ? parent.addChild(graph.createNode(nodeData)) : graph.addNode(nodeData)
    })

    Object.entries(activity.groups||{}).forEach(([groupName, group]) => {
        const node = graph.addNode({shape: 'group', height:60, width: 100, label: groupName, data: group})
        createGraphNodeFromActivity(graph, group, node)
    })
}

const generateId = (() => {
   let i = 0
   return () => {
       return (i++).toString()
   }
})()

const objectToId = new Map<any, string>()

const nodeSize = {
    height: 100,
    width: 200
}

function createGraphNodeDataFromActivity(activity: Activity, parent?: string) {
    const nodes = Object.entries(activity.interactions).map(([interactionName, interaction]) => {
        const id = generateId()
        objectToId.set(interaction, id)
        return {id, shape: 'interaction', ...nodeSize, label: interactionName, data: interaction, parent}
    })

    const children: any[] = []

    const groups = Object.entries(activity.groups||{}).map(([groupName, group]) => {
        const id = generateId()
        objectToId.set(group, id)
        const data = {id, shape: 'group', ...nodeSize, label: groupName, data: group, parent}
        children.push(createGraphNodeDataFromActivity(group, id))
        return data
    })

    const edges = activity.directions?.map((direction) => {
        return {
            source: objectToId.get(direction.from)!,
            target: objectToId.get(direction.to)!,
            attrs: {
                line: {
                    stroke: '#A2B1C3',
                    strokeWidth: 2,
                },
            }
        }
    })

    return {
        nodes: [
            ...nodes,
            ...groups,
            ...([]).concat(...children.map(child => child.nodes)),
        ],
        edges,
    }
}





export default function ActivityGraph() {

    useLayoutEffect(() => {
        const graph = new Graph({
            container: containerRef.current!,
            autoResize: true,
            connecting: {
                router: 'orth',
            },
            interacting: {
                nodeMovable: false
            },
            grid: {
                size: 10,
                visible: true,
                type: "dot", // 'dot' | 'fixedDot' | 'mesh'
                args: {
                    color: "#a0a0a0", // 网格线/点颜色
                    thickness: 1, // 网格线宽度/网格点大小
                },
            },
        })


        // createGraphNodeFromActivity(graph, activityData)


        graph.fromJSON(activityData)

        // fetch('/data/bpmn.json')
        //     .then((response) => response.json())
        //     .then((data) => {
        //         const cells: Cell[] = []
        //         data.forEach((item: any) => {
        //             if (item.shape === 'bpmn-edge') {
        //                 cells.push(graph.createEdge(item))
        //             } else {
        //                 cells.push(graph.createNode(item))
        //             }
        //         })
        //         graph.resetCells(cells)
        //         graph.zoomToFit({ padding: 10, maxScale: 1 })
        //     })
    })

    const containerRef = useRef(null)

    return <div ref={containerRef} className=""></div>
}