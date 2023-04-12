import {DerivedConceptType, FunctionBool, SystemState} from "../../../base/types";
import {Event, EventStack, User} from "../../../runtime/types";
import {deriveConcept} from "../../../runtime/derive";
import { role as userRole } from './user'

const otherUser: FunctionBool<User>['body'] = (stack: EventStack, event: Event, system: SystemState, user: User) => (user.id !== event.user.id)
export const role: DerivedConceptType<User> = deriveConcept<User>(userRole, otherUser)
