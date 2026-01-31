export type Action = 'CREATE' | 'READ' | 'READALL' | 'UPDATE' | 'DELETE';
export type Role = 'Admin' | 'User';
export type Resource = 'incident' | 'User';

export type PolicyMap = Record<
  Action,
  {
    allowedRoles: Role[];
    enforceOwnership?: boolean;
  }
>;

export const INCIDENT_POLICIES: PolicyMap = {
  CREATE: {
    allowedRoles: ['Admin', 'User'],
    enforceOwnership: false,
  },
  READ: {
    allowedRoles: ['Admin', 'User'],
    enforceOwnership: true,
  },
  READALL: {
    allowedRoles: ['Admin'], // Admin-only
    enforceOwnership: false,
  },
  UPDATE: {
    allowedRoles: ['Admin', 'User'],
    enforceOwnership: true,
  },
  DELETE: {
    allowedRoles: ['Admin'], // Admin-only
  },
};

export const USER_POLICIES: PolicyMap = {
  CREATE: {
    allowedRoles: ['Admin'], // Admin-only
    enforceOwnership: false,
  },
  READ: {
    allowedRoles: ['Admin', 'User'],
    enforceOwnership: true,
  },
  READALL: {
    allowedRoles: ['Admin'], // Admin-only
    enforceOwnership: false,
  },
  UPDATE: {
    allowedRoles: ['Admin', 'User'],
    enforceOwnership: true,
  },
  DELETE: {
    allowedRoles: ['Admin'], // Admin-only
  },
};

async function authorizeAccess(
  User: { id: string; roles: Role[] } | null,
  policyMap: PolicyMap,
  action: Action,
  resourceId?: string,
  ownershipService?: {
    isOwner(userId: string, resourceId: string): Promise<boolean>;
  },
): Promise<any> {
  if (!User) {
    return {
      allowed: false,
      statusCode: 401,
      message: 'Unauthenticated',
    };
  }

  const policy = policyMap[action];
  const userRoles = User.roles;

  const hasAllowedRole = policy.allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAllowedRole) {
    return {
      allowed: false,
      statusCode: 403,
      message: 'Forbidden',
    };
  }

  // Admin always bypasses ownership
  if (userRoles.includes('Admin')) {
    return { allowed: true, statusCode: 200 };
  }

  if (policy.enforceOwnership) {
    if (!resourceId) {
      return {
        allowed: false,
        statusCode: 403,
        message: 'Resource ID required',
      };
    }

    const isOwner = await ownershipService!.isOwner(User.id, resourceId);

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

export async function authorizeIncidentAccess(
  User: { id: string; roles: Role[] } | null,
  action: Action,
  incidentId?: string,
  incidentService?: {
    isOwner(userId: string, incidentId: string): Promise<boolean>;
  },
): Promise<any> {
  return authorizeAccess(User, INCIDENT_POLICIES, action, incidentId, incidentService);
}

export async function authorizeUserAccess(
  User: { id: string; roles: Role[] } | null,
  action: Action,
  targetUserId?: string,
  userService?: {
    isOwner(userId: string, targetUserId: string): Promise<boolean>;
  },
): Promise<any> {
  return authorizeAccess(User, USER_POLICIES, action, targetUserId, userService);
}
