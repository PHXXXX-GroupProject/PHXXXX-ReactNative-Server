import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

import { Db, MongoClient, ObjectId } from "mongodb";
import { ApolloServer,  } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import * as Error from "./error"
import { OperationIndex } from "./enum";
import { UUID } from "./util";
import { Role, User } from "../graphql/type";
import { MutationResolver, PermissionResolver, QueryResolver, ScalarResolver, UserResolver } from "../graphql/resolver";

export class Server {
    private static readonly port = 8080;
    private static readonly dbDriver = new MongoClient("mongodb://127.0.0.1");
    static db: Db;
    static readonly app = new ApolloServer({
        typeDefs: fs.readFileSync(path.resolve(__dirname + "/../graphql/schema.graphql"), "utf-8"),
        resolvers: {
            ObjectId: ScalarResolver.ObjectId,
            Date: ScalarResolver.Date,
            Query: QueryResolver,
            Mutation: MutationResolver,
            User: UserResolver,
            Permission: PermissionResolver
        },
    });

    static async connectToDatabase() {
        await this.dbDriver.connect();
        this.db = this.dbDriver.db("exam");
        console.log({
            component: "Database Driver",
            status: true,
            database: "exam"
        });
    }

    static async start() {
        await startStandaloneServer(this.app, {
            listen: { port: this.port },
        });

        console.log({
            component: "Server",
            status: true,
            port: this.port,
            cwd: __dirname
        });
    }
}

export class Session {
    private id: string;
    private userId: ObjectId | null = null;
    private role: Role | null = null;

    constructor() {
        this.id = UUID.generateNew();
    }

    getId() {
        return this.id;
    }

    async signIn(userId: ObjectId, cellCombination: string) {
        const user = await Server.db.collection<User>("users").findOne({ _id: userId });

        if (user) {
            const generatedHash = crypto.createHash("sha1").update(cellCombination).digest("hex");
            if (generatedHash === user.secret!.hash) {
                this.userId = user._id;
                this.role = await Server.db.collection<Role>("roles").findOne({ _id: user.roleId });

                return true;
            } else {
                throw new Error.PatternMismatchError(userId.toHexString());
            }
        } else {
            throw new Error.CouldNotFindUserError(userId.toHexString());
        }
    }

    signOut() {
        this.userId = null;
        this.role = null;
        return true;
    }

    getSignedUserId() {
        if (this.userId) {
            return this.userId;
        } else {
            throw new Error.NotSignedInError();
        }
    }

    getSignedRole() {
        if (this.role) {
            return this.role;
        } else {
            throw new Error.NotSignedInError();
        }
    }

    queryPermission(moduleId: string, operationIndex: OperationIndex) {
        if (this.getSignedRole().permissions) {
            for (const permission of this.getSignedRole().permissions) {
                if (permission.moduleId.toHexString() === moduleId && permission.value[operationIndex] === "1") {
                    return true;
                }
            }
            throw new Error.NoPermissionsError(this.getSignedRole()._id.toHexString(), moduleId, operationIndex);
        } else {
            throw new Error.NoPermissionsError(this.getSignedRole()._id.toHexString(), moduleId, operationIndex);
        }
    }
}