import { ApiError } from '../../utils/ApiError';
import { UserModel } from './user.model';
import { orderService } from '../order/order.service';
import { bookingService } from '../booking/booking.service';

export const userService = {
  async getProfile(userId: string) {
    const user = await UserModel.findById(userId).lean();
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  },

  async updateProfile(userId: string, payload: Record<string, unknown>) {
    const user = await UserModel.findByIdAndUpdate(userId, payload, { new: true }).lean();
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  },

  async addAddress(userId: string, address: Record<string, unknown>) {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $push: { addresses: address } },
      { new: true },
    ).lean();
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  },

  async toggleWishlist(userId: string, productId: string) {
    const user = await UserModel.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');

    const exists = user.wishlist?.some(id => String(id) === productId);
    if (exists) {
      user.wishlist = user.wishlist.filter(id => String(id) !== productId);
    } else {
      user.wishlist.push(productId as any);
    }
    await user.save();
    return user.toObject();
  },

  async getOrders(userId: string) {
    return orderService.findAll({ userId });
  },

  async getBookings(userId: string) {
    return bookingService.findAll({ userId });
  },
};
