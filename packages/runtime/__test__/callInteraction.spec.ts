import { ActivityGraph } from "../server/AcitivityGraph";
import {RoleType, Activity, DerivedConceptType} from "../../base/types";
import * as Types from "../baseTypes";
import {describe, expect} from "@jest/globals";
import { activity } from '../../example/activity/friendRequest'
import {Interaction} from "../types";
import {recursiveConvertActivityInteraction} from "../server/callInteraction";
// import {expect} from 'chai'

const userRole: RoleType = {
    type: 'role',  // role type
    attributes: {
        id: Types.Id,
        name: Types.String
    }
}



describe('interaction tests', () => {
    test('convert activity interaction', () => {
        const [startEntry, ...interactionEntries] = recursiveConvertActivityInteraction(activity, [], activity, { userRole })
        expect(startEntry[0].join('-')).toBe('createActivity')

        expect(interactionEntries.length).toBe(4)
        expect(interactionEntries[0][0].join('-')).toBe('sendInteraction')
        expect(interactionEntries[1][0].join('-')).toBe('responseGroup-approveInteraction')
        expect(interactionEntries[2][0].join('-')).toBe('responseGroup-rejectInteraction')
        expect(interactionEntries[3][0].join('-')).toBe('responseGroup-cancelInteraction')

        // 检查 availableCondition
        expect(interactionEntries.every(([_, interaction])=> interaction.condition!.name === 'combinedInnerInteractionAvailable')).toBeTruthy()

        // 检查 saveRef side effect
        // 检查 state  transfer side effect
        expect(interactionEntries.every(([_, interaction])=> {
            return interaction.sideEffects!.length === 2 &&
                interaction.sideEffects![0].name === 'saveRef' &&
                interaction.sideEffects![1].name === 'transfer'
        })).toBeTruthy()

        // 检查 role ref attributive
        expect(interactionEntries.slice(1).every(([_, interaction])=> {
            return (interaction.role as DerivedConceptType<any>).attributive!.name === 'asRef'
        })).toBeTruthy()

        // TODO 检查 Payload attributive

    })

})

export {}
