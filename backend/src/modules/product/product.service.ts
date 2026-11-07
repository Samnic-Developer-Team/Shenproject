import { ApiError } from '../../utils/ApiError';
import { ProductModel } from './product.model';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';

export const productService = {
  async create(payload: Record<string, unknown>) {
    if (payload.image && typeof payload.image === 'string' && payload.image.startsWith('data:image')) {
      payload.image = await uploadToCloudinary(payload.image, 'products');
    }

    if (Array.isArray(payload.gallery)) {
      payload.gallery = await Promise.all(
        payload.gallery.map(async (img: string) => {
          if (img.startsWith('data:image')) {
            return uploadToCloudinary(img, 'products');
          }
          return img;
        })
      );
    }

    return ProductModel.create(payload);
  },

  async findAll(query: Record<string, unknown>) {
    const { limit, page, sortBy, sortOrder, ...filters } = query;
    const mongooseQuery = ProductModel.find(filters).populate('sellerId');
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

  async update(productId: string, payload: Record<string, unknown>) {
    if (payload.image && typeof payload.image === 'string' && payload.image.startsWith('data:image')) {
      payload.image = await uploadToCloudinary(payload.image, 'products');
    }

    if (Array.isArray(payload.gallery)) {
      payload.gallery = await Promise.all(
        payload.gallery.map(async (img: string) => {
          if (img.startsWith('data:image')) {
            return uploadToCloudinary(img, 'products');
          }
          return img;
        })
      );
    }

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
