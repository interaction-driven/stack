// TODO 这里应该是根据所有的 interaction 定义生成出来的。

import {
    Activity as OriginActivity,
    ConceptType,
    ConceptTypeLike,
    InActivityRole,
    InnerInteraction as OriginInnerInteraction,
    InstanceRef,
    Interaction as OriginInteraction, SystemState
} from "../base/types";
import {QueryArg} from "../runtime/server/callInteraction";


export interface User {
    id: string,
    [k: string]: any
}


export interface Payload {
    [k: string]: any
}


