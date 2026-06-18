import type { NextFunction, RequestHandler } from 'express';

export const catchAsync = (handler: RequestHandler) => {
  return (req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1], next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};
