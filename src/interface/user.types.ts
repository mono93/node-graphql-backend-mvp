import { ObjectId } from 'mongodb';

export type UserType = 'Admin' | 'User';

export interface User {
  id?: string;
  name: string;
  email: string;
  userType: UserType;
  auth0Id: string;
  createdBy?: ObjectId;
  createdDate?: Date;
}

export interface UserAttrs extends User {}
