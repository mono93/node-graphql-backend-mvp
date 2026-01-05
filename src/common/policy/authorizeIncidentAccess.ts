export type IncidentAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';

export interface AuthResult {
  allowed: boolean;
  statusCode: 200 | 401 | 403;
  message?: string;
}

export async function authorizeIncidentAccess(
  user: { id: string; roles: string[] } | null,
  action: IncidentAction,
  incidentId?: string,
  incidentService?: {
    isOwner(userId: string, incidentId: string): Promise<boolean>;
  },
): Promise<AuthResult> {
  if (!user) {
    return {
      allowed: false,
      statusCode: 401,
      message: 'Unauthenticated',
    };
  }

  // Admin → full access
  if (user.roles.includes('admin')) {
    return { allowed: true, statusCode: 200 };
  }

  // User role logic
  if (user.roles.includes('user')) {
    // CREATE is always allowed for users
    if (action === 'CREATE') {
      return { allowed: true, statusCode: 200 };
    }

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

    return { allowed: true, statusCode: 200 };
  }

  return {
    allowed: false,
    statusCode: 403,
    message: 'Forbidden',
  };
}
