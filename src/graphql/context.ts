import { Request } from 'express';
import userService, { UserServiceType } from '../common/service/user.service';
import incidentService, { IncidentServiceType } from '../common/service/incident.service';

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
  const user = (req as any).user || null;

  return {
    user,
    services: {
      userService,
      incidentService,
    },
  };
};
