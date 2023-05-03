import {DerivedConceptType, FunctionBool, SystemState} from "../../../base/types.ts";
import {Event, EventStack, User} from "../../../runtime/types.ts";
import {deriveConcept} from "../../../runtime/derive.ts";
import { role as userRole } from './user.ts'

const otherUser: FunctionBool<User>['body'] = (stack: EventStack, event: Event, system: SystemState, user: User) => (user.id !== event.user.id)
export const role: DerivedConceptType<User> = deriveConcept<User>(userRole, otherUser)
