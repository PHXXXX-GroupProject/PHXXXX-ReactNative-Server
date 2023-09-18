import { User } from "../graphql/type";

export interface Context {
    user: User | null;
}

export type Resolver<P> = {
    [K in keyof P]: (parent: P, args: any, ctx: Context, info: any) => Promise<P[K]>;
}