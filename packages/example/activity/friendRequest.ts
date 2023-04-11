
// TEST TODO
import * as Types from "../../runtime/baseTypes";
import { deriveConcept,  } from "../../runtime/derive";
import {} from '../../runtime/types'
import {
    Interaction,
    RoleType,
    SystemState,
    DerivedConceptType,
    FunctionBool,
    Activity,
    Gateway,
    Direction,
    InActivityPayload, InActivityRole, InnerInteraction, AddAs, ConceptTypeLike, Group, End
} from "../../base/types";
import { User, Event, EventStack } from '../types.gen'
import { role as otherUserRole } from '../concept/role/otherUser'
import { role as badUserRole } from '../concept/role/badUser'
import { role as blockedUserRole } from '../concept/role/blockedUser'
import { role as userRole } from '../concept/role/user'


const MessageConcept = {
    type: 'message',
    attributes: {
        content: Types.String
    }
}


const sendInteraction: InnerInteraction = {
    role: ({
        ...userRole,
        as: 'from',
    } as InActivityRole) ,
    action: 'sendFriendRequest',
    payload: new Map<string, any>([
      ['to', ({ as: 'to', ...otherUserRole } as AddAs<ConceptTypeLike>)],
      ['message', MessageConcept]
    ])
}

const approveInteraction = {
    role: {
        ref: 'to'
    },
    action: 'approve',
}

const rejectInteraction = {
    role: {
        ref: 'to'
    },
    action: 'reject',
}

const cancelInteraction = {
    role: {
        ref: 'from'
    },
    action: 'cancel',
}


const responseGroup:Group = {
    type: 'or',
    interactions: {
        approveInteraction,
        rejectInteraction,
        cancelInteraction
    },
}


const sendToResponse: Direction = {
    from: sendInteraction,
    to: responseGroup
}

const end: End = {
    type: 'end'
}



export const activity: Activity = {
    interactions: {
        sendInteraction,
    },
    gateways: [],
    directions: [
        sendToResponse,
    ],
    groups: {
        responseGroup
    },
    events: [],
    sideEffects: [
        // TODO request 的 message sideEffect
    ],
}
