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
    return ProductModel.find(query).sort({ createdAt: -1 }).lean();
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
