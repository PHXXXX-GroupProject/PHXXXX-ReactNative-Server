import * as crypto from "crypto";

import * as jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";
import { GraphQLScalarType, Kind } from "graphql";

import * as Error from "../lib/error";
import { Server } from "../lib/app";
import { Module, Mutation, MutationSignInArgs, Permission, Query, Role, User } from "./type";
import { DefaultBinData } from "../lib/enum";
import { JWT_SECRET } from "../lib/const";
import { Context } from "../lib/interface";

export const QueryResolver = {
    GetMe: async (parent: Query, args: any, ctx: Context, info: any): Promise<Query["GetMe"]> => {
        if (ctx.user) {
            return ctx.user;
        } else {
            throw new Error.NotSignedInError();
        }
    },

    GetUsers: async (parent: Query, args: any, ctx: Context, info: any): Promise<Query["GetUsers"]> => {
        const cursor =  await Server.db.collection<User>("users").find();
        const users = [] as User[];
        for await (const item of cursor) {
            users.push(item);
        }
        return users;
    },
};

export const MutationResolver = {
    SignIn: async (parent: Mutation, args: MutationSignInArgs, ctx: Context, info: any): Promise<Mutation["SignIn"]> => {
        const user = await Server.db.collection<User>("users").findOne({
            username: args.username
        });

        if (user) {
            const generatedHash = crypto.createHash("sha1").update(args.password).digest("hex");
            if (generatedHash === user.secret!.hash) {
                return jwt.sign({ userId: ScalarResolver.ObjectId.serialize(user._id) }, JWT_SECRET);
            } else {
                throw new Error.PasswordMismatchError(args.username);
            }
        } else {
            throw new Error.CouldNotFindUserError(args.username);
        }
    }
};

export const ScalarResolver = {
    ObjectId: new GraphQLScalarType<ObjectId | null, string>({
        name: "ObjectId",
        description: "The GraphQL frontend for BSON.ObjectId from MongoDB",
        serialize(value) {
            if (value instanceof ObjectId) {
                return value.toHexString();
            }
            throw new GraphQLError(`Error serializing "${value}" from ObjectId`);
        },
        parseValue(value) {
            if (value instanceof ObjectId) {
                return new ObjectId(value);
            }
            throw new GraphQLError(`Error parsing "${value}" to ObjectId`);
        },
        parseLiteral(valueNode) {
            if (valueNode.kind === Kind.STRING) {
                return new ObjectId(valueNode.value)
            }
            return null;
        }
    }),

    Date: new GraphQLScalarType<Date | null, number>({
        name: "Date",
        description: "Date custom scalar type",
        serialize(value) {
            if (value instanceof Date) {
                return value.getTime();
            }
            throw new GraphQLError(`Error serializing "${value}" from Date`);
        },
        parseValue(value) {
            if (typeof value === "number") {
                return new Date(value);
            }
            throw new GraphQLError(`Error parsing "${value}" to Date`);
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return new Date(parseInt(ast.value, 10));
            }
            return null;
        },
    })
}

export const UserResolver = {
    secret: () => null, //DANGER: This field must always return null

    role: async (parent: User, args: any, ctx: Context, info: any) => {
        // session.queryPermission(ModuleId.USERS, OperationIndex.RETRIEVE);
        return await Server.db.collection<Role>("roles").findOne({ _id: parent.roleId });
    },

    avatar: async (parent: User, args: any, ctx: Context, info: any) => {
        if (parent.avatar) {
            return parent.avatar;
        } else {
            //Return the default avatar
            return DefaultBinData.AVATAR;
        }
    }
};

export const PermissionResolver = {
    module: async (parent: Permission, args: any, ctx: Context, info: any) => {
        // session.queryPermission(CardId.ROLES, OperationIndex.RETRIEVE);
        return await Server.db.collection<Module>("modules").findOne({ _id: parent.moduleId });
    }
};