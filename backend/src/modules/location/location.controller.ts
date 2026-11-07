import type { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { locationService } from './location.service';

export const locationController = {
  list: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const activeOnly = req.query.active === 'true';
      const locations = await locationService.findAll(activeOnly);
      sendResponse({
        res,
        message: 'Locations retrieved successfully',
        data: locations
      });
    } catch (error) {
      next(error);
    }
  },

  listShopownerLocations: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const shopownerLocations = await locationService.findShopownerLocations();
      sendResponse({
        res,
        message: 'Shopowner locations retrieved successfully',
        data: shopownerLocations
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const location = await locationService.create(req.body);
      sendResponse({
        res,
        statusCode: 201,
        message: 'Location created successfully',
        data: location
      });
    } catch (error) {
      next(error);
    }
  },

  toggleActive: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const location = await locationService.toggleActive(String(req.params.id));
      sendResponse({
        res,
        message: 'Location active status toggled successfully',
        data: location
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await locationService.delete(String(req.params.id));
      sendResponse({
        res,
        message: 'Location deleted successfully',
        data: null
      });
    } catch (error) {
      next(error);
    }
  },
};
