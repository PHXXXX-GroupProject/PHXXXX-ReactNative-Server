import { readFileSync } from "fs";

export enum OperationIndex { CREATE, RETRIEVE, UPDATE, DELETE }

export enum OperationName {
    CREATE = "CREATE",
    RETRIEVE = "RETRIEVE",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}

export enum ModuleId {
    USERS = "609de42dc2b27cd8f1401798",
    ROLES = "609de42bc2b27cd8f1401797",
    OFFENSES = "609de42dc2b27cd8f1401799",
    FINES = "609de42dc2b27cd8f1401700",
}

export enum ModuleName {
    USERS = "USERS",
    ROLES = "ROLES",
    OFFENSES = "OFFENSES",
    FINES = "FINES",
}

export class DefaultBinData {
    static readonly AVATAR = readFileSync(__dirname + "/../media/images/icon_user_default.png").toString();
}