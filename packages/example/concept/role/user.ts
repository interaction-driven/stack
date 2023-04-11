import {RoleType} from "../../../base/types";
import * as Types from "../../../runtime/baseTypes";

export const role: RoleType = {
    type: 'role',  // role type
    attributes: {
        id: Types.Id,
        name: Types.String
    }
}