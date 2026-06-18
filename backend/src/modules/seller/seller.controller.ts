import type { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { sellerService } from './seller.service';

export const sellerController = {
  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const seller = await sellerService.create(req.body);
      sendResponse({ res, statusCode: 201, message: 'Seller created', data: seller });
    } catch (error) {
      next(error);
    }
  },

  approve: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const seller = await sellerService.approve(String(req.params.id));
      sendResponse({ res, message: 'Seller approved', data: seller });
    } catch (error) {
      next(error);
    }
  },
};
