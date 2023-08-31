import { readFileSync } from "fs";
import { Binary } from "mongodb";

export enum OperationIndex { CREATE, RETRIEVE, UPDATE, DELETE }

export enum ModuleId {
    USERS = "609de42dc2b27cd8f1401798",
    THEMES = "609de42dc2b27cd8f1401799",
    ROLES = "609de42bc2b27cd8f1401797",
    EXAMS = "609de42dc2b27cd8f1401799",
    QUESTIONS = "609de42dc2b27cd8f140179a"
}

export class DefaultBinData {
    static readonly AVATAR = new Binary(readFileSync(__dirname + "/../media/images/icon_user_default.png"));
}