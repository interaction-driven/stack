import {System, User, Payload, QueryArg} from "../server/callInteraction";
import {BoolExpression, ConceptType} from "../../base/types";
import { randomUUID } from 'crypto'

export class MockSystem implements System {
    state = new Map<string, Map<string, any>>()
    setState(stateName: string, index: string, nextState: any) {
        let stateMap = this.state.get(stateName)
        if (!stateMap) this.state.set(stateName, (stateMap = new Map<string, any>))

        stateMap.set(index, nextState)
    }
    getState(stateName: string, index: string){
        return this.state.get(stateName)!.get(index)
    }

    stack = {
        stackHistory: [],
        save(user: User, action: string, payload?: Payload, queryArg?: QueryArg) {
            // this.stackHistory.push([user, action, payload, queryArg])
        }
    }
    storage = {
        get(concept: ConceptType, attributives: BoolExpression[], queryArg?: QueryArg) {

        },
        set(concept: ConceptType, item: any) {

        }
    }
    util = {
        uuid() {
            return randomUUID()
        }
    }
}
