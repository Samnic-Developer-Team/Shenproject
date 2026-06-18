import type { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { serviceService } from './service.service';

export const serviceController = {
  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const service = await serviceService.create(req.body);
      sendResponse({ res, statusCode: 201, message: 'Service created', data: service });
    } catch (error) {
      next(error);
    }
  },

  findAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const services = await serviceService.findAll(req.query as Record<string, unknown>);
      sendResponse({ res, message: 'Services fetched', data: services });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const service = await serviceService.update(String(req.params.id), req.body);
      sendResponse({ res, message: 'Service updated', data: service });
    } catch (error) {
      next(error);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const service = await serviceService.remove(String(req.params.id));
      sendResponse({ res, message: 'Service deleted', data: service });
    } catch (error) {
      next(error);
    }
  },
};
