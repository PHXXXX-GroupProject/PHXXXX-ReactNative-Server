import { GraphQLError } from "graphql";
import { OperationIndex } from "./enum";

export class CouldNotFindUserError extends GraphQLError {
    constructor(username: string) {
        super(`No user as ${username}`, null, null, null, null, null, {
            title: "Couldn't find that user",
            suggestion: "Check your username",
            description: "Couldn't find a user with the specified username. Please provide a valid username",
            code: "COULD_NOT_FIND_USER"
        });
    }
}

export class PasswordMismatchError extends GraphQLError {
    constructor(username: string) {
        super(`Incorrect password for user ${username}`, null, null, null, null, null, {
            title: "Oops! password mismatch",
            suggestion: "Type your password again",
            description: "The password you typed is incorrect",
            code: "PASSWORD_MISMATCH"
        });
    }
}

export class NoPermissionsError extends GraphQLError {
    constructor(roleId: string, cardId: string, operationIndex: OperationIndex) {
        super(`Permissions denied to perform operation ${operationIndex} on card ${cardId} for role ${roleId}`, null, null, null, null, null, {
            title: "Whoa! Go no further",
            suggestion: "Check your permissions",
            description: "Looks like you don't have permissions for the requested operation",
            code: "NO_PERMISSIONS"
        });
    }
}

export class NotSignedInError extends GraphQLError {
    constructor() {
        super("No user for session", null, null, null, null, null, {
            title: "You're not signed in",
            suggestion: "Just sign in to the system",
            description: "Some operations in the system require the user to be validated. Therefore, signing in with a valid user account is compulsory",
            code: "NOT_SIGNED_IN"
        });
    }
}

export class AttemptedSelfDestructionError extends GraphQLError {
    constructor() {
        super("Attempted self deletion", null, null, null, null, null, {
            title: "Cannot delete yourself",
            suggestion: "Sign in as another user",
            description: "You are signed in as the user you attempted to delete. You cannot delete the user you are signed in as.",
            code: "ATTEMPTED_SELF_DESTRUCTION"
        });
    }
}