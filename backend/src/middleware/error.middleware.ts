import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';

export const notFound = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new ApiError(404, 'Route not found'));
};

export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || 'Something went wrong';

  res.status(statusCode).json({
    success: false,
    message,
  });
};
