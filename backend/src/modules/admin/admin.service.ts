import { AdminModel } from './admin.model';
import { AuthUserModel } from '../auth/auth.model';
import { SellerModel } from '../seller/seller.model';
import { ProductModel } from '../product/product.model';
import { ServiceModel } from '../service/service.model';
import { BookingModel } from '../booking/booking.model';

export const adminService = {
  async findAll() {
    return AdminModel.find().sort({ createdAt: -1 }).lean();
  },

  async getStats() {
    const [
      totalUsers,
      totalSellers,
      totalServices,
      totalProducts,
      totalBookings,
      recentSellers,
      recentBookings,
    ] = await Promise.all([
      AuthUserModel.countDocuments({ role: 'USER' }),
      SellerModel.countDocuments({}),
      ServiceModel.countDocuments({}),
      ProductModel.countDocuments({}),
      BookingModel.countDocuments({}),
      SellerModel.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      BookingModel.find({}).sort({ createdAt: -1 }).limit(5).populate('userId sellerId serviceId').lean(),
    ]);

    return {
      totalUsers,
      totalSellers,
      totalServices,
      totalProducts,
      totalBookings,
      recentSellers,
      recentBookings,
    };
  },
};

