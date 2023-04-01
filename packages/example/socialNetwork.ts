
// TEST TODO
import * as Types from "../runtime/baseTypes";
import { deriveConcept } from "../runtime/derive";
import { Interaction, RoleType, SystemState, DerivedConceptType, FunctionBool} from "../base/types";
import { User, Event, EventStack } from './types.gen'

const userRole: RoleType = {
    type: 'role',  // role type
    attributes: {
        id: Types.Id,
        name: Types.String
    }
}


// CAUTION User 其实是根据上面的 userRole 定义自动生成出来的，生成的类型在 types.gen 里面，并且要继承 Concept，用在真正的运行时里，
const isOtherUser: FunctionBool<User>['body'] = (stack: EventStack, event: Event, system: SystemState, user: User) => (user.id !== event.user.id)
const otherUserRole: DerivedConceptType<User> = deriveConcept<User>(userRole, isOtherUser)
// TODO 1 这里应该也有 RuntimeOtherUser，还可以继续派生，搞个 otherUserButNotAdminRole。

// TODO 2 怎么写"用户的注册时间小于 1 小时"，用"表达式形式"，
const isNewUser = (stack: EventStack, event: Event, system: SystemState, user: User) => (false)
const newUserRole: DerivedConceptType<User> = deriveConcept<User>(userRole, isNewUser)

// TODO 3再搞个没有系统变量的，春表达式的，例如被拒绝过 10 次的用户
const isBadUser = (stack: EventStack, event: Event, system: SystemState, user: User) => (false)
const badUserRole: DerivedConceptType<User> = deriveConcept<User>(userRole, isBadUser)



const userFollowOtherUser:Interaction = {
    role: userRole,
    action: 'follow',
    payload: otherUserRole
}


export const concepts = {
    userRole,
    otherUserRole,
    newUserRole,
    badUserRole
}


export const interactions = {
    userFollowOtherUser
}
