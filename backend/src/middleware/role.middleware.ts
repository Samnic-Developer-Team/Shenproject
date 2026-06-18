import type { NextFunction, Response } from 'express';
import { Roles, type Role } from '../constants/roles';
import { ApiError } from '../utils/ApiError';
import type { AuthRequest } from './auth.middleware';

export const authorizeRoles = (...roles: Role[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(401, 'Authentication required'));
      return;
    }

    if (!roles.includes(req.user.role as Role)) {
      next(new ApiError(403, 'Forbidden'));
      return;
    }

    next();
  };
};

export const roleGuard = {
  admin: authorizeRoles(Roles.ADMIN),
  seller: authorizeRoles(Roles.SELLER),
  user: authorizeRoles(Roles.USER),
};
