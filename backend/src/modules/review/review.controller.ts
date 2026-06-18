import type { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { reviewService } from './review.service';

export const reviewController = {
  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const review = await reviewService.create(req.body);
      sendResponse({ res, statusCode: 201, message: 'Review created', data: review });
    } catch (error) {
      next(error);
    }
  },

  findAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reviews = await reviewService.findAll(req.query as Record<string, unknown>);
      sendResponse({ res, message: 'Reviews fetched', data: reviews });
    } catch (error) {
      next(error);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const review = await reviewService.remove(String(req.params.id));
      sendResponse({ res, message: 'Review deleted', data: review });
    } catch (error) {
      next(error);
    }
  },

  findByTarget: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { targetId } = req.params;
      const reviews = await reviewService.findByTarget(String(targetId));
      sendResponse({ res, message: 'Reviews fetched', data: reviews });
    } catch (error) {
      next(error);
    }
  },
};
