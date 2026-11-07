import { ApiError } from '../../utils/ApiError';
import { ReviewModel } from './review.model';

export const reviewService = {
  async create(payload: Record<string, unknown>) {
    return ReviewModel.create(payload);
  },

  async findAll(query: Record<string, unknown>) {
    const { limit, page, sortBy, sortOrder, ...filters } = query;
    const mongooseQuery = ReviewModel.find(filters);
    if (limit) {
      mongooseQuery.limit(Number(limit));
    }
    if (page && limit) {
      mongooseQuery.skip((Number(page) - 1) * Number(limit));
    }
    const sortField = (sortBy as string) || 'createdAt';
    const order = sortOrder === 'asc' ? 1 : -1;
    return mongooseQuery.sort({ [sortField]: order }).lean();
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
