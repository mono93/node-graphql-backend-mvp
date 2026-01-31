import { userResolvers } from './user/user.resolver';
import { userTypeDefs } from './user/user.schema';
import { incidentResolvers } from './incident/incident.resolver';
import { incidentTypeDefs } from './incident/incident.schema';

export const typeDefs = [userTypeDefs, incidentTypeDefs];

export const resolvers: Record<string, any>[] = [userResolvers, incidentResolvers];
