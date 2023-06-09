
// TEST TODO
import * as Types from "../../runtime/baseTypes.ts";
import {Event, System, User} from '../../runtime/types.ts'
import {
    Interaction,
    RoleType,
    SystemState,
    DerivedConceptType,
    FunctionBool,
    Activity,
    Gateway,
    Direction,
    InActivityPayload, InActivityRole, InnerInteraction, AddAs, ConceptTypeLike, Group, End, ConceptType
} from "../../base/types.ts";
import { role as otherUserRole } from '../concept/role/otherUser.ts'
import { role as badUserRole } from '../concept/role/badUser.ts'
import { role as blockedUserRole } from '../concept/role/blockedUser.ts'
import { role as userRole } from '../concept/role/user.ts'
import {ActivityEvent} from "../../runtime/server/callInteraction.ts";


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
      ['to', ({ as: 'to', name: 'OtherUser', ...otherUserRole } as AddAs<ConceptTypeLike>)],
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


const sendInteractionEvent: ConceptType = {
    type: 'event',
    ...sendInteraction
}



// TODO 获取所有新的请求
const getNewRequestsToMe: Interaction = {
    role: userRole,
    action: 'get',
    // TODO 应该有个 matcher 的写法
    targetData: function allNewRequests({ user }, { system}) {
        return (Array.from(system.stack.stackHistory.values()) as Event[]).filter(({action, payload}: Event) => (
            action === 'sendFriendRequest' && payload.to.id === user.id
        ))
    }
}

// TODO matcher 写法
const getAllFriends: Interaction = {
    role: userRole,
    action: 'get',
    targetData: function allFrineds({ user }, { system }) {
        const friends: User[] = []

        for (let activityEvent of system.stack.activityStack.values()) {
            const requestToMeApproved = activityEvent.sendInteraction?.payload?.to?.id === user.id
                && activityEvent.responseGroup?.approveInteraction

            const myRequestApproved = activityEvent.sendInteraction?.user.id === user.id
                && activityEvent.responseGroup?.approveInteraction


            if (requestToMeApproved) {
                friends.push(activityEvent.sendInteraction.user)
            } else if (myRequestApproved) {
                friends.push(activityEvent.sendInteraction.payload.to)
            }
        }


        return friends
    }
}

export const interactions = {
    getNewRequestsToMe,
    getAllFriends
}
