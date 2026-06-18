import type { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { trackingService } from './tracking.service';

export const trackingController = {
  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { orderId, status, note } = req.body as { orderId: string; status: string; note?: string };
      const result = await trackingService.updateTimeline(orderId, { status, note });
      sendResponse({ res, message: 'Tracking updated', data: result });
    } catch (error) {
      next(error);
    }
  },

  get: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId = String(req.params.orderId);
      const result = await trackingService.findByOrder(orderId);
      sendResponse({ res, message: 'Tracking fetched', data: result });
    } catch (error) {
      next(error);
    }
  },
};
