import { serve } from "https://deno.land/std@0.183.0/http/server.ts";
import { activity, interactions } from '../activity/friendRequest.ts'
import {recursiveConvertActivityInteraction, callInteraction} from '../../runtime/server/callInteraction.ts'
import { MemorySystem } from './MemorySystem.ts'
import {RoleType} from "../../base/types.ts";
import * as Types from "../../runtime/baseTypes.ts";
import { urlParse } from "https://deno.land/x/url_parse/mod.ts";


const userRole: RoleType = {
    type: 'role',  // role type
    attributes: {
        id: Types.Id,
        name: Types.String
    }
}

const system = new MemorySystem()
const [
    [createIndex, createActivityInteraction],
    [sendRequestIndex, sendRequestInteraction],
    [approveIndex, approveInteraction],
    [rejectIndex, rejectInteraction],
    [cancelIndex, cancelInteraction],
] = recursiveConvertActivityInteraction(activity, [], activity, { userRole })

const pathToInteractions = {
    '/peer/friendRequest/createActivity':[createIndex, createActivityInteraction],
    '/peer/friendRequest/sendFriendRequest':[sendRequestIndex, sendRequestInteraction],
    '/peer/friendRequest/approve':[approveIndex, approveInteraction],
    '/peer/friendRequest/reject':[rejectIndex, rejectInteraction],
    '/peer/friendRequest/cancel':[cancelIndex, cancelInteraction],
    '/peer/get/newFriendRequests' : ['getNewFriendRequests', interactions.getNewRequestsToMe],
    '/peer/get/allFriends' : ['getAllFriends', interactions.getAllFriends],
}


const handler = async (request: Request): Promise<Response> => {
    const body = await request.json()

    const {pathname} = urlParse(request.url)
    const [index, interaction] = pathToInteractions[pathname]!
    const activityEvent = {id: body.activityId}

    const response = callInteraction(
        body.argv,
        system,
        index,
        interaction,
        activityEvent
    )

    return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
            "content-type": "application/json",
        },
    });
};

serve(handler);