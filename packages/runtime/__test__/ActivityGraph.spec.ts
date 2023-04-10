import { ActivityGraph } from "../server/AcitivityGraph";
import {} from "../types";
import {RoleType, Activity} from "../../base/types";
import * as Types from "../baseTypes";
import {describe, expect} from "@jest/globals";
// import {expect} from 'chai'

const userRole: RoleType = {
    type: 'role',  // role type
    attributes: {
        id: Types.Id,
        name: Types.String
    }
}


describe("basic available interaction __test__", () => {

    describe('isInteractionAvailable', () => {
        test('one interaction', () => {
            const activity: Activity = {
                interactions: {
                    testInteract: {
                        role: userRole,
                        action: 'test',
                    }
                },
                directions: []
            }

            const graph = ActivityGraph.from(activity)
            const state = graph.getInitialState()
            expect(graph.isInteractionAvailable(['testInteract'], state)).toBeTruthy()

            const nextState = graph.completeInteraction(['testInteract'], state)
            expect(graph.isInteractionAvailable(['testInteract'], nextState)).toBeFalsy()
        })
    })


    // TODO group 的情况

})

describe('complex friend request activity test', () => {

})

export {}
