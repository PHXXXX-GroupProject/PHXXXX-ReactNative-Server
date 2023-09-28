import { GraphQLError } from "graphql";
import { ModuleId, ModuleName, OperationIndex, OperationName } from "./enum";
import { Role } from "../graphql/type";

export class CouldNotFindUser extends GraphQLError {
    constructor(username: string) {
        super(`No user as ${username}`, null, null, null, null, null, {
            title: "Couldn't find that user",
            suggestion: "Check your username",
            description: "Couldn't find a user with the specified username. Please provide a valid username",
            code: "COULD_NOT_FIND_USER"
        });
    }
}

export class PasswordMismatch extends GraphQLError {
    constructor(username: string) {
        super(`Incorrect password for user ${username}`, null, null, null, null, null, {
            title: "Oops! password mismatch",
            suggestion: "Type your password again",
            description: "The password you typed is incorrect",
            code: "PASSWORD_MISMATCH"
        });
    }
}

export class NoPermissions extends GraphQLError {
    constructor(role: Role, moduleId: ModuleId, operationIndex: OperationIndex) {
        super(`Permissions denied to perform operation ${operationIndex} on module ${moduleId} for role ${role.name}`, null, null, null, null, null, {
            title: "Whoa! Go no further",
            suggestion: "Check your permissions",
            description: "Looks like you don't have sufficient permissions for the requested operation",
            code: "NO_PERMISSIONS"
        });
    }
}

export class NotSignedIn extends GraphQLError {
    constructor() {
        super("No user for session", null, null, null, null, null, {
            title: "You're not signed in",
            suggestion: "Just sign in to the system",
            description: "Some operations in the system require the user to be validated. Therefore, signing in with a valid user account is compulsory",
            code: "NOT_SIGNED_IN"
        });
    }
}

export class AttemptedSelfDestruction extends GraphQLError {
    constructor() {
        super("Attempted self deletion", null, null, null, null, null, {
            title: "Cannot delete yourself",
            suggestion: "Sign in as another user",
            description: "You are signed in as the user you attempted to delete. You cannot delete the user you are signed in as.",
            code: "ATTEMPTED_SELF_DESTRUCTION"
        });
    }
}

export class CouldNotPerformOperation extends GraphQLError {
    constructor(moduleName: ModuleName, operationName: OperationName) {
        super(`Could not perform operation ${operationName} on module ${moduleName}`, null, null, null, null, null, {
            title: "Couldn't perform the operation",
            suggestion: "Try again",
            description: "Couldn't perform the operation. Please try again",
            code: "COULD_NOT_PERFORM_OPERATION"
        });
    }
}