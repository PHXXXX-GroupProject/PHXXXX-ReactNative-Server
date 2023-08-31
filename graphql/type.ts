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

export type Answer = {
  __typename?: 'Answer';
  _id: Scalars['ObjectId']['output'];
  questionId: Scalars['ObjectId']['output'];
  text: Scalars['String']['output'];
};

export type Exam = {
  __typename?: 'Exam';
  _id: Scalars['ObjectId']['output'];
  durationHours: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  questionIds: Array<Scalars['ObjectId']['output']>;
  questions: Array<Question>;
  startTime: Scalars['Date']['output'];
};

export type ExamSitting = {
  __typename?: 'ExamSitting';
  _id: Scalars['ObjectId']['output'];
  answers: Array<Answer>;
  exam: Exam;
  user: User;
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

export type Permission = {
  __typename?: 'Permission';
  _id: Scalars['ObjectId']['output'];
  module: Module;
  moduleId: Scalars['ObjectId']['output'];
  value: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  GetExam?: Maybe<Exam>;
  GetExams: Array<Exam>;
  GetMe: User;
  GetRole?: Maybe<Role>;
  GetRoles: Array<Role>;
  GetUser?: Maybe<User>;
  GetUsers: Array<User>;
};


export type QueryGetExamArgs = {
  id: Scalars['ObjectId']['input'];
};


export type QueryGetRoleArgs = {
  id: Scalars['ObjectId']['input'];
};


export type QueryGetUserArgs = {
  id: Scalars['ObjectId']['input'];
};

export type Question = {
  __typename?: 'Question';
  _id: Scalars['ObjectId']['output'];
  prompt: Scalars['String']['output'];
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
  preferredName?: Maybe<Scalars['String']['output']>;
  role: Role;
  roleId: Scalars['ObjectId']['output'];
  secret?: Maybe<Secret>;
  username: Scalars['String']['output'];
};
