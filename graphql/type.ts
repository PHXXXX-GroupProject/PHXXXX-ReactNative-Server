import { ObjectId } from "mongodb";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: Date; output: Date; }
  ObjectId: { input: ObjectId; output: ObjectId; }
};

export type Fine = {
  __typename?: 'Fine';
  _id: Scalars['ObjectId']['output'];
  offender: User;
  offenderId: Scalars['ObjectId']['output'];
  offenseIds: Array<Scalars['ObjectId']['output']>;
  offenses: Array<Offense>;
  officer: User;
  officerId: Scalars['ObjectId']['output'];
  payment?: Maybe<Payment>;
  time: Scalars['Date']['output'];
};

export type Module = {
  __typename?: 'Module';
  _id: Scalars['ObjectId']['output'];
  name: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  SignIn: Scalars['String']['output'];
};


export type MutationSignInArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Offense = {
  __typename?: 'Offense';
  _id: Scalars['ObjectId']['output'];
  amount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type Payment = {
  __typename?: 'Payment';
  time: Scalars['Date']['output'];
};

export type Permission = {
  __typename?: 'Permission';
  _id: Scalars['ObjectId']['output'];
  module: Module;
  moduleId: Scalars['ObjectId']['output'];
  value: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  GetMe: User;
  GetRole: Role;
  GetRoles: Array<Role>;
  GetUser: User;
  GetUsers: Array<User>;
};


export type QueryGetRoleArgs = {
  id: Scalars['ObjectId']['input'];
};


export type QueryGetUserArgs = {
  id: Scalars['ObjectId']['input'];
};

export type Role = {
  __typename?: 'Role';
  _id: Scalars['ObjectId']['output'];
  name: Scalars['String']['output'];
  permissions: Array<Permission>;
};

export type Secret = {
  __typename?: 'Secret';
  hash: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ObjectId']['output'];
  avatar?: Maybe<Scalars['String']['output']>;
  fineIds: Array<Scalars['ObjectId']['output']>;
  fines: Array<Fine>;
  preferredName?: Maybe<Scalars['String']['output']>;
  role: Role;
  roleId: Scalars['ObjectId']['output'];
  secret?: Maybe<Secret>;
  username: Scalars['String']['output'];
};
