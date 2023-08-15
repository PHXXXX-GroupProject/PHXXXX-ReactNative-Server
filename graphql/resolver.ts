import { ObjectId } from "mongodb";
import { GraphQLScalarType, Kind } from "graphql";

import { Server } from "../lib/app";
import { Module, Mutation, Permission, Query, QueryGetUserArgs, Role, User } from "./type";
import { DefaultBinData } from "../lib/enum";

export const QueryResolver = {
    GetUsers: async (parent: Query, args: any, ctx: any, info: any): Promise<Query["GetUsers"]> => {
        const cursor =  await Server.db.collection<User>("users").find();
        const users = [] as User[];
        for await (const item of cursor) {
            users.push(item);
        }
        return users;
    },

    GetUser: async (parent: Query, args: QueryGetUserArgs, ctx: any, info: any): Promise<Query["GetUser"]> => {
        return await Server.db.collection<User>("users").findOne( {
            username: args.username
        });
    }
};

export const MutationResolver = {
    OverwriteRegistry: async (parent: Mutation, args: any, ctx: any, info: any): Promise<Mutation["OverwriteRegistry"]> => {
        return true;
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
            throw Error(`Error serializing '${value}' from ObjectId`);
        },
        parseValue(value) {
            if (value instanceof ObjectId) {
                return new ObjectId(value);
            }
            throw Error(`Error parsing '${value}' to ObjectId`);
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
            throw Error(`Error serializing '${value}' from Date`);
        },
        parseValue(value) {
            if (typeof value === "number") {
                return new Date(value);
            }
            throw Error(`Error parsing '${value}' to Date`);
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

    role: async (parent: User, params: any, session: any, info: any) => {
        // session.queryPermission(ModuleId.USERS, OperationIndex.RETRIEVE);
        return await Server.db.collection<Role>("roles").findOne({ _id: parent.roleId });
    },

    avatar: async (parent: User, params: any, session: any, info: any) => {
        if (parent.avatar) {
            return parent.avatar;
        } else {
            //Return the default avatar
            return DefaultBinData.AVATAR;
        }
    }
};

export const PermissionResolver = {
    module: async (parent: Permission, params: any, session: any, info: any) => {
        // session.queryPermission(CardId.ROLES, OperationIndex.RETRIEVE);
        return await Server.db.collection<Module>("modules").findOne({ _id: parent.moduleId });
    }
};