import {Event, EventStack,User} from '../../../runtime/types.ts'
import {DerivedConceptType, SystemState} from "../../../base/types.ts";
import {deriveConcept} from "../../../runtime/derive.ts";
import { role as userRole } from './user.ts'

const isBadUser = (stack: EventStack, event: Event, system: SystemState, user: User) => (false)
export const role: DerivedConceptType<User> = deriveConcept<User>(userRole, isBadUser)