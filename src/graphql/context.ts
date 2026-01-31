import { Request } from 'express';
import userService, { UserServiceType } from '../common/service/user.service';
import incidentService, { IncidentServiceType } from '../common/service/incident.service';
import { envConfig } from '../config';

export interface GraphQLContext {
  user: {
    id: string;
    roles: string[];
  } | null;
  services: {
    userService: UserServiceType;
    incidentService: IncidentServiceType;
  };
}

export const createContext = async ({ req }: { req: Request }): Promise<GraphQLContext> => {
  const payload = (req as any).auth?.payload;
  let user: { id: string; roles: string[] } | null = null;

  if (payload) {
    const auth0Id = payload.sub;
    // Fetch the user from MongoDB to get their _id
    const dbUser = await userService.getByAuth0Id(auth0Id);
    if (dbUser) {
      user = {
        id: dbUser.id || '',
        roles: payload[`${envConfig.nameSpace}/roles`] || [],
      };
    }
  }

  return {
    user,
    services: {
      userService,
      incidentService,
    },
  };
};
