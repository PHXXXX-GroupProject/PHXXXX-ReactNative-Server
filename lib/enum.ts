import { ObjectId } from "bson";
import { readFileSync } from "fs";
import { Binary } from "mongodb";

export enum OperationIndex { CREATE, RETRIEVE, UPDATE, DELETE }

export enum ModuleId {
    USERS = "609de42dc2b27cd8f1401798",
    THEMES = "609de42dc2b27cd8f1401799",
    ROLES = "609de42bc2b27cd8f1401797"
}

export enum DefaultStrings {
    HASH = "c4e2f652bd880880515066f567a57659d2212761"
}

export class DefaultObjectIds {
    static readonly THEME_ID = new ObjectId("609de42dc2b27cd8f140179c");
}

export class DefaultBinData {
    static readonly AVATAR = new Binary(readFileSync(__dirname + "/../media/images/icon_user_default.png"));
}