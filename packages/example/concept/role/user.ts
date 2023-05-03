import {RoleType} from "../../../base/types.ts";
import * as Types from "../../../runtime/baseTypes.ts";

export const role: RoleType = {
    type: 'role',  // role type
    attributes: {
        id: Types.Id,
        name: Types.String
    }
}

export type User = {

}