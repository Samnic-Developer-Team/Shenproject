import type { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { adminService } from './admin.service';

export const adminController = {
  findAll: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const admins = await adminService.findAll();
      sendResponse({ res, message: 'Admins fetched', data: admins });
    } catch (error) {
      next(error);
    }
  },
};
