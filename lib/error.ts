import { GraphQLError } from "graphql";
import { OperationIndex } from "./enum";

export class CouldNotFindUserError extends GraphQLError {
    constructor(userId: string) {
        super(`No user as ${userId}`, null, null, null, null, null, {
            title: "Couldn't find the user",
            subtitle: "Check your user id or username",
            description: "I couldn't find a user with the specified id or username. Please give me a valid user id",
            code: "COULD_NOT_FIND_USER"
        });
    }
}

export class PatternMismatchError extends GraphQLError {
    constructor(userId: string) {
        super(`Incorrect pattern for user ${userId}`, null, null, null, null, null, {
            title: "Oops! pattern mismatch",
            subtitle: "Mark your pattern again",
            description: "The pattern you sent me doesn't match the one I have. Don't worry, try again",
            code: "PATTERN_MISMATCH"
        });
    }
}

export class NoPermissionsError extends GraphQLError {
    constructor(roleId: string, cardId: string, operationIndex: OperationIndex) {
        super(`Permissions denied to perform operation ${operationIndex} on card ${cardId} for role ${roleId}`, null, null, null, null, null, {
            title: "Whoa! Go no further",
            subtitle: "Check your permissions",
            description: "Looks like you don't have permissions for the requested operation",
            code: "NO_PERMISSIONS"
        });
    }
}

export class NotSignedInError extends GraphQLError {
    constructor() {
        super("No user for session", null, null, null, null, null, {
            title: "Ain't signed in",
            subtitle: "Just sign in to the system",
            description: "Some operations in the system require the user to be validated. Therefore, signing in with a valid user account is compulsory",
            code: "NOT_SIGNED_IN"
        });
    }
}

export class AttemptedSelfDestructionError extends GraphQLError {
    constructor() {
        super("Attempted self deletion", null, null, null, null, null, {
            title: "Cannot delete yourself",
            subtitle: "Sign in as another user",
            description: "You are signed in as the user you attempted to delete. You cannot delete the user you are signed in as.",
            code: "ATTEMPTED_SELF_DESTRUCTION"
        });
    }
}