import { ActivityGraph } from "../server/AcitivityGraph";
import {} from "../types";
import {RoleType, Activity} from "../../base/types";
import * as Types from "../baseTypes";
import {describe, expect} from "@jest/globals";
import { activity } from '../../example/activity/friendRequest'
import {recursiveConvertActivityInteraction, callInteraction} from "../server/callInteraction";
import { MockSystem } from "./MockSystem";


const userRole: RoleType = {
    type: 'role',  // role type
    attributes: {
        id: Types.Id,
        name: Types.String
    }
}




describe('complex friend request activity test', () => {
    test('graph check/complete interaction', () => {
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
    })

    test('integrate with callInteraction', () => {
        const system = new MockSystem()
        const [
            [createIndex, createActivityInteraction],
            [sendRequestIndex, sendRequestInteraction],
            [approveIndex, approveInteraction],
            [rejectIndex, rejectInteraction],
            [cancelIndex, cancelInteraction],
        ] = recursiveConvertActivityInteraction(activity, [], activity, { userRole })

        const user1 = { id: 1}
        const user2 = { id: 2}

        const response1 = callInteraction(
            { user: user1, payload: {}, queryArg: {}},
            system,
            createIndex,
            createActivityInteraction
        )

        expect(response1.sideEffects.initialize!.id).toBeDefined()
        const activityId = response1.sideEffects.initialize!.id

        const response2 = callInteraction(
            { user: user1, payload: { to: user2 }, queryArg: { activityId }},
            system,
            sendRequestIndex,
            sendRequestInteraction,
        )

        expect(response2.sideEffects.transfer!.availableInteractions!.children.responseGroup).toBeDefined()
        expect(Object.keys(response2.sideEffects.transfer!.availableInteractions!.children.responseGroup.children).join(','))
            .toBe('approveInteraction,rejectInteraction,cancelInteraction')

        // 错误的 interaction
        expect(() => callInteraction(
            { user: user1, payload: {}, queryArg: { activityId }},
            system,
            sendRequestIndex,
            sendRequestInteraction,
        )).toThrow()

        // 错误的 user
        expect(() => callInteraction(
            { user: user1, payload: {}, queryArg: { activityId }},
            system,
            approveIndex,
            approveInteraction,
        )).toThrow()

        // 错误的 user
        expect(() => callInteraction(
            { user: user1, payload: {}, queryArg: { activityId }},
            system,
            rejectIndex,
            rejectInteraction,
        )).toThrow()

        // 错误的 user2
        expect(() => callInteraction(
            { user: user2, payload: {}, queryArg: { activityId }},
            system,
            cancelIndex,
            cancelInteraction,
        )).toThrow()


        // 正确的 approve
        const response3 = callInteraction(
            { user: user2, payload: {}, queryArg: { activityId }},
            system,
            approveIndex,
            approveInteraction,
        )

        expect(Object.keys(response3.sideEffects.transfer!.availableInteractions!.children).length).toBe(0)
    })

})

export {}
