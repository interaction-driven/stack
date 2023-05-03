import {
    Activity as OriginActivity, BoolExpression, ConceptType,
    InnerInteraction as OriginInnerInteraction,
    Interaction as OriginInteraction
} from "../base/types";
import {ActivityEvent, QueryArg} from "./server/callInteraction";


// TODO  Activity 里面所有字段的类型也要加 id 啊？
export type Activity = OriginActivity
export type InnerInteraction = Exclude<Activity['interactions'], undefined>[0];
export type Gateway = Exclude<Activity['gateways'], undefined>[0];
export type Direction = Exclude<Activity['directions'], undefined>[0];
export type Interaction = OriginInteraction


export interface User {
    id: string|number,
    [k: string]: any
}

export interface Payload {
    [k: string]: any
}

export type Event = {
    id: string,
    // TODO 根据所有的 Role Type 生成
    user: User,
    interactionIndex: string[],
    action: string,
    // TODO 根据所有的 Payload 信息生成
    payload: Payload,
    queryArg: QueryArg
}

export type EventStack = Map<string, Event>
export type ActivityStack = Map<string, ActivityEvent>

export interface System {
    setState: (stateName: string, index: string, nextState: any) => void
    getState: (stateName: string, index: string) => any,
    stack: {
        stackHistory: EventStack,
        saveInteractionEvent: (event: Event) => void
        activityStack: ActivityStack
        saveActivityEvent: (id: string, interactionIndex: string[], event: Event) => void
    }
    storage:  {
        get: (concept: ConceptType, attributives: BoolExpression[], queryArg?: QueryArg) => any
        set: (concept: ConceptType, item: any) => void
    },
    util: {
        uuid: () => string
    }
}