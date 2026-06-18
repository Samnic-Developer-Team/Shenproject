import type { NextFunction, Request, Response } from 'express';
import { authService } from './auth.service';
import { sendResponse } from '../../utils/sendResponse';

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await authService.register(req.body);
      sendResponse({ res, statusCode: 201, message: 'User registered', data: result });
    } catch (error) {
      next(error);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await authService.login(req.body);
      sendResponse({ res, message: 'Login successful', data: result });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Clear cookie if used and return success
      res.clearCookie('accessToken');
      sendResponse({ res, message: 'Logged out successfully', data: null });
    } catch (error) {
      next(error);
    }
  },

  me: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.userId as string | undefined;
      if (!userId) {
        sendResponse({ res, statusCode: 401, message: 'Not authenticated', data: null });
        return;
      }
      const result = await authService.findById(userId);
      sendResponse({ res, message: 'User profile', data: result });
    } catch (error) {
      next(error);
    }
  },
};
