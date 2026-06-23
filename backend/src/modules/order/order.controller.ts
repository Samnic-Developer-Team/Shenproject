import type { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { orderService } from './order.service';

export const orderController = {
  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await orderService.create(req.body);
      sendResponse({ res, statusCode: 201, message: 'Order created', data: order });
    } catch (error) {
      next(error);
    }
  },

  findAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await orderService.findAll(req.query as Record<string, unknown>);
      sendResponse({ res, message: 'Orders fetched', data: orders });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await orderService.findById(String(req.params.id));
      sendResponse({ res, message: 'Order fetched', data: order });
    } catch (error) {
      next(error);
    }
  },

  updateStatus: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const status = req.body.status as unknown as string;
      const order = await orderService.update(String(req.params.id), { status });
      sendResponse({ res, message: 'Order status updated', data: order });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await orderService.update(String(req.params.id), req.body);
      sendResponse({ res, message: 'Order updated', data: order });
    } catch (error) {
      next(error);
    }
  },

  getUserOrders: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.userId as string | undefined;
      const orders = await orderService.findAll({ userId });
      sendResponse({ res, message: 'User orders fetched', data: orders });
    } catch (error) {
      next(error);
    }
  },

  getSellerOrders: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sellerId = (req as any).user?.userId as string | undefined;
      const orders = await orderService.findAll({ sellerId });
      sendResponse({ res, message: 'Seller orders fetched', data: orders });
    } catch (error) {
      next(error);
    }
  },
};
