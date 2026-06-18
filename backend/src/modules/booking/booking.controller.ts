import type { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { bookingService } from './booking.service';

export const bookingController = {
  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const booking = await bookingService.create(req.body);
      sendResponse({ res, statusCode: 201, message: 'Booking created', data: booking });
    } catch (error) {
      next(error);
    }
  },

  findAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookings = await bookingService.findAll(req.query as Record<string, unknown>);
      sendResponse({ res, message: 'Bookings fetched', data: bookings });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const booking = await bookingService.update(String(req.params.id), req.body);
      sendResponse({ res, message: 'Booking updated', data: booking });
    } catch (error) {
      next(error);
    }
  },

  getUserBookings: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.userId as string | undefined;
      const bookings = await bookingService.findAll({ userId });
      sendResponse({ res, message: 'User bookings fetched', data: bookings });
    } catch (error) {
      next(error);
    }
  },

  getSellerBookings: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sellerId = (req as any).user?.userId as string | undefined;
      const bookings = await bookingService.findAll({ sellerId });
      sendResponse({ res, message: 'Seller bookings fetched', data: bookings });
    } catch (error) {
      next(error);
    }
  },
};
