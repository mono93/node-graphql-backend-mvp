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
  const user = payload
    ? {
        id: payload.sub,
        roles: payload[`${envConfig.nameSpace}/roles`] || [],
      }
    : null;

  return {
    user,
    services: {
      userService,
      incidentService,
    },
  };
};
