import { ObjectId } from 'mongodb';

export type UserType = 'Admin' | 'User';

export interface User {
  id?: string;
  name: string;
  email: string;
  userType: UserType;
  createdBy?: ObjectId;
  createdDate?: Date;
}

export interface UserAttrs extends User {}
