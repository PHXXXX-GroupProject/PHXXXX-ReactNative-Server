import * as Error from "./error";
import { Role, User } from "../graphql/type";
import { Server } from "./app";
import { ModuleId, OperationIndex } from "./enum";

export class PermissionManager {
    static async queryPermission(user: User | null, moduleId: ModuleId, operationIndex: OperationIndex) {
        if (user) {
            const role = await Server.db.collection<Role>("roles").findOne({
                _id: user.roleId
            }) as Role;
    
            for (const permission of role.permissions) {
                if (permission.moduleId.toHexString() === moduleId && permission.value[operationIndex] === "1") {
                    return true;
                }
            }
            throw new Error.NoPermissions(role, moduleId, operationIndex);
        } else {
            throw new Error.NotSignedIn();
        }
    }
}