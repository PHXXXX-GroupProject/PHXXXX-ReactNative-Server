export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};


export type Exam = {
  __typename?: 'Exam';
  name: Scalars['String'];
  startTime: Scalars['Date'];
  durationHours: Scalars['Int'];
  questions: Array<Maybe<Question>>;
};

export type Module = {
  __typename?: 'Module';
  name: Scalars['String'];
  url: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  OverwriteRegistry: Scalars['Boolean'];
};

export type Permission = {
  __typename?: 'Permission';
  module: Module;
  value: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  GetUser?: Maybe<User>;
};


export type QueryGetUserArgs = {
  username?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
};

export type Question = {
  __typename?: 'Question';
  prompt: Scalars['String'];
  expectedAnswer: Scalars['String'];
};

export type Role = {
  __typename?: 'Role';
  name: Scalars['String'];
  permissions: Array<Maybe<Permission>>;
};

export type Secret = {
  __typename?: 'Secret';
  hash: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  username: Scalars['String'];
  secret: Secret;
  preferredName: Scalars['String'];
  avatar: Scalars['String'];
  role: Role;
};
