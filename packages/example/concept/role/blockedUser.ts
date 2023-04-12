import {Event, EventStack,User} from '../../../runtime/types'
import {DerivedConceptType, SystemState} from "../../../base/types";
import {deriveConcept} from "../../../runtime/derive";
import { role as userRole } from './user'

const isBadUser = (stack: EventStack, event: Event, system: SystemState, user: User) => (false)
export const role: DerivedConceptType<User> = deriveConcept<User>(userRole, isBadUser)