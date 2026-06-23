import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { sendResponse } from '../../utils/sendResponse';
import { sellerService } from './seller.service';
import { SellerModel } from './seller.model';
import { ApiError } from '../../utils/ApiError';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';

export const sellerController = {
  listAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sellers = await SellerModel.find({ isActive: true })
        .select('-password')
        .sort({ createdAt: -1 })
        .lean();
      sendResponse({ res, message: 'Sellers fetched', data: sellers });
    } catch (error) {
      next(error);
    }
  },

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

  getMe: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const email = (req as any).user?.email;
      if (!email) {
        throw new ApiError(401, 'Unauthorized');
      }
      const seller = await SellerModel.findOne({ email }).lean();
      if (!seller) {
        sendResponse({ res, statusCode: 200, message: 'Seller profile not found', data: null });
        return;
      }
      sendResponse({ res, message: 'Seller profile fetched', data: seller });
    } catch (error) {
      next(error);
    }
  },

  registerShop: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const email = (req as any).user?.email;
      if (!email) {
        throw new ApiError(401, 'Unauthorized');
      }
      
      const existing = await SellerModel.findOne({ email });
      if (existing) {
        throw new ApiError(409, 'Seller profile already exists');
      }

      if (req.body.shopImage && req.body.shopImage.startsWith('data:image')) {
        req.body.shopImage = await uploadToCloudinary(req.body.shopImage, 'sellers');
      }

      const hashedPassword = await bcrypt.hash('seller_password_123', 12);

      const seller = await SellerModel.create({
        ...req.body,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        isApproved: true,
      });

      sendResponse({ res, statusCode: 201, message: 'Seller profile registered', data: seller });
    } catch (error) {
      next(error);
    }
  },

  updateMe: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const email = (req as any).user?.email;
      if (!email) {
        throw new ApiError(401, 'Unauthorized');
      }

      if (req.body.shopImage && req.body.shopImage.startsWith('data:image')) {
        req.body.shopImage = await uploadToCloudinary(req.body.shopImage, 'sellers');
      }

      const seller = await SellerModel.findOneAndUpdate({ email }, req.body, { new: true });
      if (!seller) {
        throw new ApiError(404, 'Seller profile not found');
      }
      sendResponse({ res, message: 'Seller profile updated', data: seller });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const seller = await SellerModel.findById(String(req.params.id)).select('-password').lean();
      if (!seller) {
        throw new ApiError(404, 'Seller profile not found');
      }
      sendResponse({ res, message: 'Seller profile fetched', data: seller });
    } catch (error) {
      next(error);
    }
  },
};
