import type { NextFunction, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { userService } from './user.service';
import type { AuthRequest } from '../../middleware/auth.middleware';

export const userController = {
  me: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await userService.getProfile(String(req.user?.userId));
      sendResponse({ res, message: 'Profile fetched', data: user });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await userService.updateProfile(String(req.user?.userId), req.body);
      sendResponse({ res, message: 'Profile updated', data: user });
    } catch (error) {
      next(error);
    }
  },
  addAddress: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await userService.addAddress(String(req.user?.userId), req.body);
      sendResponse({ res, statusCode: 201, message: 'Address added', data: result });
    } catch (error) {
      next(error);
    }
  },

  toggleWishlist: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await userService.toggleWishlist(String(req.user?.userId), String(req.params.productId));
      sendResponse({ res, message: 'Wishlist updated', data: result });
    } catch (error) {
      next(error);
    }
  },

  orders: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await userService.getOrders(String(req.user?.userId));
      sendResponse({ res, message: 'Orders fetched', data: orders });
    } catch (error) {
      next(error);
    }
  },

  bookings: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookings = await userService.getBookings(String(req.user?.userId));
      sendResponse({ res, message: 'Bookings fetched', data: bookings });
    } catch (error) {
      next(error);
    }
  },
};
