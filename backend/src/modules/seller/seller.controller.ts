import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { sendResponse } from '../../utils/sendResponse';
import { sellerService } from './seller.service';
import { SellerModel } from './seller.model';
import { ApiError } from '../../utils/ApiError';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';
import { ServiceModel } from '../service/service.model';
import { ProductModel } from '../product/product.model';
import { AuthUserModel } from '../auth/auth.model';
import { locationService } from '../location/location.service';

export const sellerController = {
  listAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sellers = await SellerModel.find({ isActive: true })
        .select('-password')
        .sort({ createdAt: -1 })
        .lean();

      const sellersWithCounts = await Promise.all(
        sellers.map(async (seller) => {
          const [serviceCount, productCount] = await Promise.all([
            ServiceModel.countDocuments({ sellerId: seller._id }),
            ProductModel.countDocuments({ sellerId: seller._id }),
          ]);
          return {
            ...seller,
            serviceCount,
            productCount,
          };
        })
      );

      sendResponse({ res, message: 'Sellers fetched', data: sellersWithCounts });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const seller = await sellerService.create(req.body);
      if (seller && seller.city && seller.state) {
        await locationService.autoUpsert(seller.city, seller.state);
      }
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

      if (seller && seller.city && seller.state) {
        await locationService.autoUpsert(seller.city, seller.state);
      }

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
      if (seller.city && seller.state) {
        await locationService.autoUpsert(seller.city, seller.state);
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

  listAllAdmin: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sellers = await sellerService.listAllAdmin();
      sendResponse({ res, message: 'Sellers fetched for admin', data: sellers });
    } catch (error) {
      next(error);
    }
  },

  toggleActive: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await sellerService.toggleActive(String(req.params.id));
      sendResponse({ res, message: 'Seller active status toggled', data: result });
    } catch (error) {
      next(error);
    }
  },

  updateById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (req.body.shopImage && req.body.shopImage.startsWith('data:image')) {
        req.body.shopImage = await uploadToCloudinary(req.body.shopImage, 'sellers');
      }

      const oldSeller = await SellerModel.findById(id);
      if (!oldSeller) {
        throw new ApiError(404, 'Seller profile not found');
      }

      const seller = await SellerModel.findByIdAndUpdate(id, req.body, { new: true });
      
      // Sync credentials if name or email changed
      if (req.body.email || req.body.ownerName) {
        const updateFields: any = {};
        if (req.body.email) updateFields.email = req.body.email;
        if (req.body.ownerName) updateFields.name = req.body.ownerName;
        
        await AuthUserModel.findOneAndUpdate(
          { email: oldSeller.email },
          updateFields
        );
      }

      if (seller && seller.city && seller.state) {
        await locationService.autoUpsert(seller.city, seller.state);
      }

      sendResponse({ res, message: 'Seller profile updated', data: seller });
    } catch (error) {
      next(error);
    }
  },
};
