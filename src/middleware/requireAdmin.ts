import { Request, Response, NextFunction } from 'express';
import { envConfig } from '../config';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const roles = (req as any).auth?.payload?.[`${envConfig.nameSpace}/roles`];

  if (!Array.isArray(roles) || !roles.includes('Admin')) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }

  next();
};
