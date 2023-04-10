import { ActivityGraph } from "../server/AcitivityGraph";
import {} from "../types";
import {RoleType, Activity} from "../../base/types";
import * as Types from "../baseTypes";
import {describe, expect} from "@jest/globals";
import { activity } from '../../example/activity/friendRequest'
// import {expect} from 'chai'

const userRole: RoleType = {
    type: 'role',  // role type
    attributes: {
        id: Types.Id,
        name: Types.String
    }
}




describe('complex friend request activity test', () => {
    test('one interaction', () => {
        const graph = ActivityGraph.from(activity)
        const state = graph.getInitialState()
        expect(graph.isInteractionAvailable(['sendInteraction'], state)).toBeTruthy()

        const nextState = graph.completeInteraction(['sendInteraction'], state)
        expect(graph.isInteractionAvailable(['sendInteraction'], nextState)).toBeFalsy()

        expect(graph.isInteractionAvailable(['responseGroup', 'approveInteraction'], nextState)).toBeTruthy()
        expect(graph.isInteractionAvailable(['responseGroup', 'rejectInteraction'], nextState)).toBeTruthy()
        expect(graph.isInteractionAvailable(['responseGroup', 'cancelInteraction'], nextState)).toBeTruthy()

        const nextState2 = graph.completeInteraction(['responseGroup', 'approveInteraction'], state)
        expect(graph.isInteractionAvailable(['responseGroup', 'approveInteraction'], nextState2)).toBeFalsy()
        expect(graph.isInteractionAvailable(['responseGroup', 'rejectInteraction'], nextState2)).toBeFalsy()
        expect(graph.isInteractionAvailable(['responseGroup', 'cancelInteraction'], nextState2)).toBeFalsy()

        debugger
    })
})

export {}
