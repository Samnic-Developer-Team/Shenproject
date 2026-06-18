import type { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { productService } from './product.service';

export const productController = {
  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await productService.create(req.body);
      sendResponse({ res, statusCode: 201, message: 'Product created', data: product });
    } catch (error) {
      next(error);
    }
  },

  findAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const products = await productService.findAll(req.query as Record<string, unknown>);
      sendResponse({ res, message: 'Products fetched', data: products });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await productService.update(String(req.params.id), req.body);
      sendResponse({ res, message: 'Product updated', data: product });
    } catch (error) {
      next(error);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await productService.remove(String(req.params.id));
      sendResponse({ res, message: 'Product deleted', data: product });
    } catch (error) {
      next(error);
    }
  },
};
