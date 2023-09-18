import * as fs from "fs";
import * as path from "path";

import * as jwt from "jsonwebtoken";
import { Db, MongoClient, ObjectId } from "mongodb";
import { ApolloServer, } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { Role, User } from "../graphql/type";
import { FineResolver, MutationResolver, PermissionResolver, QueryResolver, ScalarResolver, UserResolver } from "../graphql/resolver";
import { JWT_SECRET } from "./const";
import { Context } from "./interface";

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
            Permission: PermissionResolver,
            Fine: FineResolver
        },
    });

    static async connectToDatabase() {
        await this.dbDriver.connect();
        this.db = this.dbDriver.db("finePay");
        console.log({
            component: "Database Driver",
            status: true,
            database: "finePay"
        });
    }

    static async start() {
        await startStandaloneServer(this.app, {
            listen: { port: this.port },
            context: async ({ req, res }): Promise<Context> => {
                const token = req.headers.authorization || '';
                try {
                    const result = jwt.verify(token, JWT_SECRET) as any;

                    const user = await Server.db.collection<User>("users").findOne({ _id: new ObjectId(result.userId) }) as User;

                    user.role = await Server.db.collection<Role>("roles").findOne({ _id: user.roleId }) as Role;
    
                    return { user };
                } catch(err) {
                    console.error(err);
                    return { user: null };
                }
            }
        });

        console.log({
            component: "Server",
            status: true,
            port: this.port,
            cwd: __dirname
        });
    }
}