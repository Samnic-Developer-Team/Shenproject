import { ApiError } from '../../utils/ApiError';
import { SellerModel } from './seller.model';
import { AuthUserModel } from '../auth/auth.model';
import { ServiceModel } from '../service/service.model';
import { ProductModel } from '../product/product.model';

export const sellerService = {
  async create(payload: Record<string, unknown>) {
    return SellerModel.create(payload);
  },

  async approve(sellerId: string) {
    const seller = await SellerModel.findByIdAndUpdate(sellerId, { isApproved: true }, { new: true });
    if (!seller) {
      throw new ApiError(404, 'Seller not found');
    }
    return seller;
  },

  async listAllAdmin() {
    const sellers = await SellerModel.find({}).sort({ createdAt: -1 }).lean();
    return Promise.all(
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
  },

  async toggleActive(sellerId: string) {
    const seller = await SellerModel.findById(sellerId);
    if (!seller) {
      throw new ApiError(404, 'Seller not found');
    }

    seller.isActive = !seller.isActive;
    await seller.save();

    await AuthUserModel.findOneAndUpdate(
      { email: seller.email },
      { isActive: seller.isActive }
    );

    return { id: String(seller._id), email: seller.email, isActive: seller.isActive };
  },
};
