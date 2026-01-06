export type IncidentAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
export type Role = 'admin' | 'user';

export type IncidentPolicyMap = Record<
  IncidentAction,
  {
    allowedRoles: Role[];
    enforceOwnership?: boolean;
  }
>;

export const INCIDENT_POLICIES: IncidentPolicyMap = {
  CREATE: {
    allowedRoles: ['admin', 'user'],
    enforceOwnership: false,
  },
  READ: {
    allowedRoles: ['admin', 'user'],
    enforceOwnership: true,
  },
  UPDATE: {
    allowedRoles: ['admin', 'user'],
    enforceOwnership: true,
  },
  DELETE: {
    allowedRoles: ['admin'], // admin-only
  },
};

export async function authorizeIncidentAccess(
  user: { id: string; roles: Role[] } | null,
  action: IncidentAction,
  incidentId?: string,
  incidentService?: {
    isOwner(userId: string, incidentId: string): Promise<boolean>;
  },
): Promise<any> {
  if (!user) {
    return {
      allowed: false,
      statusCode: 401,
      message: 'Unauthenticated',
    };
  }

  const policy = INCIDENT_POLICIES[action];
  const userRoles = user.roles;

  const hasAllowedRole = policy.allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAllowedRole) {
    return {
      allowed: false,
      statusCode: 403,
      message: 'Forbidden',
    };
  }

  // Admin always bypasses ownership
  if (userRoles.includes('admin')) {
    return { allowed: true, statusCode: 200 };
  }

  if (policy.enforceOwnership) {
    if (!incidentId) {
      return {
        allowed: false,
        statusCode: 403,
        message: 'Incident ID required',
      };
    }

    const isOwner = await incidentService!.isOwner(user.id, incidentId);

    if (!isOwner) {
      return {
        allowed: false,
        statusCode: 403,
        message: 'Forbidden',
      };
    }
  }

  return { allowed: true, statusCode: 200 };
}
