import {
    Activity as OriginActivity,
    InnerInteraction as OriginInnerInteraction,
    Interaction as OriginInteraction
} from "../base/types";

type AddId<Origin> = Origin & {id:string}

// TODO  Activity 里面所有字段的类型也要加 id 啊？
export type Activity = OriginActivity
export type InnerInteraction = Activity['interactions'][0];
type GatewayType = Activity['gateways']!
export type Gateway = GatewayType[number];
type DirectionType = Activity['directions']!
export type Direction = DirectionType[number];
export type Interaction = OriginInteraction


export interface User {
    id: string,
    [k: string]: any
}


export interface Payload {
    [k: string]: any
}

export interface Event {
    name: string,
    // TODO 根据所有的 Role Type 生成
    user: User,
    action: string,
    // TODO 根据所有的 Payload 信息生成
    payload: Payload
}
export type EventStack = Event[]
