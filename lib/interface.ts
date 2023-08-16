import { User } from "../graphql/type";

export interface Context {
    user: User | null;
}