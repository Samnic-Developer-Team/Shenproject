import { ApiError } from '../../utils/ApiError';
import { ProductModel } from './product.model';

export const productService = {
  async create(payload: Record<string, unknown>) {
    return ProductModel.create(payload);
  },

  async findAll(query: Record<string, unknown>) {
    return ProductModel.find(query).sort({ createdAt: -1 }).lean();
  },

  async update(productId: string, payload: Record<string, unknown>) {
    const product = await ProductModel.findByIdAndUpdate(productId, payload, { new: true });
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return product;
  },

  async remove(productId: string) {
    const product = await ProductModel.findByIdAndDelete(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return product;
  },
};
