import {useLayoutEffect, useRef, useEffect} from "react";
import {Cell, Graph, Node} from "@antv/x6";
import * as activityData from '../data/activity'
import {Activity, Group, Interaction, Payload} from "../../../base/types";
import { DagreLayout } from '@antv/layout'
import { register } from '@antv/x6-react-shape'
import useGlobalCodeEditor from "../store/code";
import useConceptEditor from "../store/concpet";
import * as concepts from "../data/concept";
import layout from './layout'


import GroupNode from './GroupNode'
import InteractionNode from './InteractionNode'


export default function ActivityGraph({ data} : {data: Activity}) {
    const container = useRef(null)
    const nodes = []
    const nodeRefs = {}

    if (data.interactions) {
        Object.entries(data.interactions).forEach(([name, interaction]) => {
            interaction.id = name
            nodes.push(interaction)
        })

    }

    if (data.groups) {
        Object.entries(data.groups).forEach(([name, group]) => {
            group.id = name
            nodes.push(group)
        })
    }


    useLayoutEffect(() => {
        const boxes = nodes.map((node) => {
            const rect = nodeRefs[node.id].getBoundingClientRect()
            return {
                id: node.id,
                width: Math.ceil(rect.width),
                height: Math.ceil(rect.height)
            }
        })

        const edges = data.directions?.map(direction => {
            return {
                source: direction.from.id,
                target: direction.to.id
            }
        }) || []

        const { nodeMap: layoutMap, width: boxWidth, height: boxHeight } = layout(boxes, edges, 50, 50)
        for(let [id, layoutNode] of layoutMap) {
            nodeRefs[id].style.left = `${layoutNode.x}px`
            nodeRefs[id].style.top = `${layoutNode.y}px`
        }

        container.current!.style!.width = `${boxWidth}px`
        container.current!.style!.height = `${boxHeight}px`
    })


    return <div className="relative inline-block" ref={container}>
        {data.interactions && Object.entries(data.interactions).map(([name, interaction]) => {
            return <div className="absolute inline-block" ref={(r) => nodeRefs[name] = r}>
                <InteractionNode data={ interaction as Interaction} />
            </div>
        })}

        {data.groups && Object.entries(data.groups).map(([name, group]) => {
            return <div className="absolute  inline-block" ref={(r) => nodeRefs[name] = r}>
                <GroupNode data={ group} />
            </div>
        })}
    </div>
}