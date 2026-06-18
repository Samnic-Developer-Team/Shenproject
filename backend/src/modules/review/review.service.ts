import { ApiError } from '../../utils/ApiError';
import { ReviewModel } from './review.model';

export const reviewService = {
  async create(payload: Record<string, unknown>) {
    return ReviewModel.create(payload);
  },

  async findAll(query: Record<string, unknown>) {
    return ReviewModel.find(query).sort({ createdAt: -1 }).lean();
  },

  async findByTarget(targetId: string) {
    return ReviewModel.find({ targetId }).sort({ createdAt: -1 }).lean();
  },

  async remove(reviewId: string) {
    const review = await ReviewModel.findByIdAndDelete(reviewId);
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }
    return review;
  },
};
