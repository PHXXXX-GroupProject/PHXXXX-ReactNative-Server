import * as crypto from "crypto";

import * as jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";
import { GraphQLScalarType, Kind } from "graphql";

import * as Error from "../lib/error";
import { Server } from "../lib/app";
import { Fine, Module, Mutation, MutationPayFineArgs, MutationSignInArgs, Offense, Permission, Query, QueryGetFineArgs, QueryGetRoleArgs, QueryGetUserArgs, Role, User } from "./type";
import { DefaultBinData, ModuleId, ModuleName, OperationIndex, OperationName } from "../lib/enum";
import { JWT_SECRET } from "../lib/const";
import { Context, Resolver } from "../lib/interface";
import { PermissionManager } from "../lib/util";

export const QueryResolver: Resolver<Query> = {
    GetMe: async (parent: Query, args: any, ctx: Context, info: any): Promise<Query["GetMe"]> => {
        //WARNING: GetMe doesn't need any permission validation
        if (ctx.user) {
            return ctx.user;
        } else {
            throw new Error.NotSignedIn();
        }
    },

    GetUser: async (parent: Query, args: QueryGetUserArgs, ctx: Context, info: any): Promise<Query["GetUser"]> => {
        PermissionManager.queryPermission(ctx.user, ModuleId.USERS, OperationIndex.RETRIEVE);
        return await Server.db.collection<User>("users").findOne({
            _id: args.id
        }) as User;
    },

    GetRole: async (parent: Query, args: QueryGetRoleArgs, ctx: Context, info: any): Promise<Query["GetRole"]> => {
        PermissionManager.queryPermission(ctx.user, ModuleId.ROLES, OperationIndex.RETRIEVE);
        return await Server.db.collection<Role>("roles").findOne({
            _id: args.id
        }) as Role;
    },

    GetFine: async (parent: Query, args: QueryGetFineArgs, ctx: Context, info: any): Promise<Query["GetFine"]> => {
        PermissionManager.queryPermission(ctx.user, ModuleId.FINES, OperationIndex.RETRIEVE);
        return await Server.db.collection<Fine>("fines").findOne({
            _id: args.id
        }) as Fine;
    },

    GetUsers: async (parent: Query, args: any, ctx: Context, info: any): Promise<Query["GetUsers"]> => {
        PermissionManager.queryPermission(ctx.user, ModuleId.USERS, OperationIndex.RETRIEVE);
        return await Server.db.collection<User>("users").find().toArray();
    },

    GetRoles: async (parent: Query, args: any, ctx: Context, info: any): Promise<Query["GetRoles"]> => {
        PermissionManager.queryPermission(ctx.user, ModuleId.ROLES, OperationIndex.RETRIEVE);
        return await Server.db.collection<Role>("roles").find().toArray();
    }
};

export const MutationResolver: Resolver<Mutation> = {
    SignIn: async (parent: Mutation, args: MutationSignInArgs, ctx: Context, info: any): Promise<Mutation["SignIn"]> => {
        const user = await Server.db.collection<User>("users").findOne({
            username: args.username
        });

        if (user) {
            const generatedHash = crypto.createHash("sha1").update(args.password).digest("hex");
            if (generatedHash === user.secret!.hash) {
                return jwt.sign({ userId: ScalarResolver.ObjectId.serialize(user._id) }, JWT_SECRET);
            } else {
                throw new Error.PasswordMismatch(args.username);
            }
        } else {
            throw new Error.CouldNotFindUser(args.username);
        }
    },

    PayFine: async (parent: Mutation, args: MutationPayFineArgs, ctx: Context, info: any): Promise<Mutation["PayFine"]> => {
        console.log(args.info.fineId);
        
        let result = await Server.db.collection<Fine>("fines").updateOne({
            _id: args.info.fineId
        }, {
            $set: {
                payment: {
                    time: new Date()
                }
            }
        });

        if (result.acknowledged) {
            return true;
        } else {
            throw new Error.CouldNotPerformOperation(ModuleName.FINES, OperationName.UPDATE);
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

export const UserResolver: Resolver<User> = {
    _id: async (parent: User, args: any, ctx: Context, info: any) => parent._id,
    
    fineIds: async (parent: User, args: any, ctx: Context, info: any) => parent.fineIds,
    
    roleId: async (parent: User, args: any, ctx: Context, info: any) => parent.roleId,
    
    username: async (parent: User, args: any, ctx: Context, info: any) => parent.username,

    secret: async (parent: User, args: any, ctx: Context, info: any) => null, //DANGER: This field must always return null

    role: async (parent: User, args: any, ctx: Context, info: any) => {
        PermissionManager.queryPermission(ctx.user, ModuleId.ROLES, OperationIndex.RETRIEVE);
        return await Server.db.collection<Role>("roles").findOne({ _id: parent.roleId }) as Role;
    },

    avatar: async (parent: User, args: any, ctx: Context, info: any) => {
        if (parent.avatar) {
            return parent.avatar;
        } else {
            //Return the default avatar
            return DefaultBinData.AVATAR;
        }
    },

    fines: async (parent: User, args: any, ctx: Context, info: any) => {
        PermissionManager.queryPermission(ctx.user, ModuleId.FINES, OperationIndex.RETRIEVE);
        return await Server.db.collection<Fine>("fines").find({ offenderId: { $in: [parent._id] } }).toArray();
    },
};

export const PermissionResolver: Resolver<Permission> = {
    _id: async (parent: Permission, args: any, ctx: Context, info: any) => parent._id,

    moduleId: async (parent: Permission, args: any, ctx: Context, info: any) => parent.moduleId,
    
    value: async (parent: Permission, args: any, ctx: Context, info: any) => parent.value,

    module: async (parent: Permission, args: any, ctx: Context, info: any) => {
        //WARNING: Module details can be accessed by anyone
        return await Server.db.collection<Module>("modules").findOne({ _id: parent.moduleId }) as Module;
    }
};

export const FineResolver: Resolver<Fine> = {
    _id: async (parent: Fine, args: any, ctx: Context, info: any) => parent._id,
    
    offenderId: async (parent: Fine, args: any, ctx: Context, info: any) => parent.offenderId,
    
    officerId: async (parent: Fine, args: any, ctx: Context, info: any) => parent.officerId,

    offenseIds: async (parent: Fine, args: any, ctx: Context, info: any) => parent.offenseIds,

    time: async (parent: Fine, args: any, ctx: Context, info: any) => parent.time,

    offender: async (parent: Fine, args: any, ctx: Context, info: any) => {
        PermissionManager.queryPermission(ctx.user, ModuleId.USERS, OperationIndex.RETRIEVE);
        return await Server.db.collection<User>("users").findOne({_id: parent.offenderId }) as User;
    },

    officer: async (parent: Fine, args: any, ctx: Context, info: any) => {
        PermissionManager.queryPermission(ctx.user, ModuleId.USERS, OperationIndex.RETRIEVE);
        return await Server.db.collection<User>("users").findOne({_id: parent.officerId }) as User;
    },

    offenses: async (parent: Fine, args: any, ctx: Context, info: any) => {
        PermissionManager.queryPermission(ctx.user, ModuleId.OFFENSES, OperationIndex.RETRIEVE);
        return await Server.db.collection<Offense>("offenses").find({ _id: { $in: parent.offenseIds } }).toArray();
    },
}