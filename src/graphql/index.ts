import { userResolvers } from './user/user.resolver';
import { userTypeDefs } from './user/user.schema';

export const typeDefs = [userTypeDefs];

export const resolvers = [userResolvers];
