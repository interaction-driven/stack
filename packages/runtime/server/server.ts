

import {
    ConceptTypeLike,
    InstanceRef,
    SystemState,
    InteractionStackComputation,
    AND, InActivityRole, SideEffect,
    RoleType
} from "../../base/types";

import { Activity, Interaction, InnerInteraction, Event, EventStack } from "../types";

import {deriveConcept} from "../derive";
import {ActivityGraph, ActivityState} from "./AcitivityGraph";


const GET_ACTION_TYPE = 'get'

function combineAttributive(payload: ConceptTypeLike) {
    return {
        // TODO
        combinedAttributive: null,
        baseConcept: null,
    }
}


type System = {
    [k: string] : any
}

type User = {
    [k: string] : any
}

type Payload = {
    [k: string] : any
}

/**
 * 与 interaction 无关，但与当前 query 有关的信息。例如数据获取的 viewPort，innerInteraction 的 activity id
 */
type QueryArg = {
    [k: string] : any
}

type RuntimeArg = {
    user: User,
    payload: Payload,
    queryArg: QueryArg
}

type Context = {
    interaction: Interaction,
    system: System
}

// 通过外部就已经把 api call 和具体的 interaction/activity 定义找到了。
function callInteraction({ user, payload, queryArg }: RuntimeArg, system: System, interaction: Interaction | InnerInteraction, activity?: Activity, ) {
    const response = {
        error: null,
        data: null
    }

    // TODO 1 validate User

    // TODO 2 validate payload

    // TODO 3 记录事件
    system.interaction.save(user, payload, queryArg)

    // TODO 4 执行 effect


    // TODO 5 get 请求按照 attributive 和 请求的数据格式反水数据
        // TODO 要先研究一下 payload 里面的结构，具体的存储可以先考虑用大宽表实现。
    if (interaction.action === GET_ACTION_TYPE) {

        const { combinedAttributive, baseConcept } = combineAttributive(interaction.payload as ConceptTypeLike)
        response.data = system.storage.get(baseConcept, combinedAttributive, queryArg)
    }

    // TODO 返回值
    return response
}

function callInnerInteraction() {
    //
}


/**
 * TODO
 *
 *
 * 1. 设计表达当前可用 interaction 的数据结构。要同时方便读和写（写的时候可能有复杂的判断）。
 * 2. 设计保存 as 的数据结构。
 * 3. 设计转化成 ref 的数据结构。
 * 4. 实现状态转移
 */

/**
 * 把 activity 中的 interaction 转换成和普通 interaction 一样，把  activity 中的 state 转换也看做是一种 sideEffect
 * @param interaction
 * @param activity
 */
type Concepts = {
    userRole: RoleType
}



function convertActivityInteraction(interactionIndex: string[], interaction: InnerInteraction, activity: Activity, { userRole }:Concepts) {
    const outputInteraction = {...interaction} as Interaction

    // 1. 当前状态是否允许 interaction 执行
    const checkIfInteractionVisible = {
        type: 'functionBool',
        // TODO 要改成具体名字
        name: 'InnerInteractionAvailable',
        body: ({ user, payload, queryArg }: RuntimeArg, { system } : Context) => {
            // 如果是 startEvent activity 可以为 空
            const { activityId } = queryArg
            const state: ActivityState = system.getState('activity', activityId)
            const graph = ActivityGraph.from(activity)
            return graph.isInteractionAvailable(interactionIndex, state)
        }
    }

    outputInteraction.condition = {
        type: 'interactionStackComputation',
        name: 'combinedInnerInteractionAvailable',
        body: interaction.condition ? ({
            type: 'and',
            left: checkIfInteractionVisible,
            right: interaction.condition
        } as AND) : checkIfInteractionVisible
    }

    // 2. 有 as 的 interaction 需要保存一下 instance 信息，因为后面有  ref 的地方需要用。
    const sideEffects: SideEffect[] = (outputInteraction.sideEffects || [])
    const saveRefSideEffect: SideEffect = {
        type: 'state',
        name: 'saveRef',
        body: ({ user, payload, queryArg }: RuntimeArg, { system } : Context) => {
            const activityState: ActivityState = system.getState('activity', queryArg.activityId!)

            const roleAs = (interaction.role as InActivityRole).as
            if (roleAs) {
                activityState.instances[roleAs] = user
            }

            if (interaction.payload instanceof Map) {
                // TODO 遍历一下，这里只遍历了第一层。
                for( const [k, v] of interaction.payload) {
                    if (v.as) {
                        // CAUTION payload 默认就是 object
                        activityState.instances[v.as] = payload[k]
                    }
                }
            } else if(Array.isArray(interaction.payload)){
                // TODO 数组
            } else {
                // TODO 普通形式
            }
            // TODO 可能还有更复杂的树形结构的 payload

            system.setState('activity', queryArg.activityId!, activityState)

            return true
        }
    }

    sideEffects.push(saveRefSideEffect)


    // 3.1 转化 ref 成普通匹配的形式
    if ((interaction.role as InstanceRef).ref !== undefined) {
        const convertedRole = deriveConcept<User>(userRole, ({ user, payload, queryArg }: RuntimeArg, { system } : Context) => {
            const activityState: ActivityState = system.getState('activity', queryArg.activityId!)
            const userInstance = activityState.instances[(interaction.role as InstanceRef).ref]
            return userInstance?.id === user.id
        })
        outputInteraction.role = convertedRole
    }

    // 3.2 TODO payload 里面的 ref 转换。一般只有 gateway 里面的判断可能需要。不太可能在 interaction 里面去引用其他的 payload instance。




    // 5. 如果满足了转移，针对当前的 activity 需要产生新的 sideEffect 来赚转移 state。
    const transformSideEffect: SideEffect = {
        type: 'state',
        name: 'transform',
        body: ({queryArg}: RuntimeArg, { system } : Context) => {
            //   如果是 startEvent，要产生一个 effect 该生成 activityId。
            const activityState: ActivityState = interaction === activity.start ? { id: system.util.uuid()} : system.getState('activity', queryArg.activityId!)
            const graph = ActivityGraph.from(activity)
            const nextState = graph.completeInteraction(interaction, activityState)
            system.setState('activity', nextState)
            return true
        }
    }
    sideEffects.push(transformSideEffect)

    outputInteraction.sideEffects = sideEffects

    return outputInteraction
}

