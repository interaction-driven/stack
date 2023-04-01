// TODO 这里应该是根据所有的 interaction 定义生成出来的。

import {PayloadTypeLike} from "../base/types";


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