import { ApiError } from '../../utils/ApiError';
import { SellerModel } from './seller.model';

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
};
