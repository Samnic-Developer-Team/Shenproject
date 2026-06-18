import { Schema, model, type Types } from 'mongoose';
import type { ProductPayload } from './product.interface';

export interface ProductDocument extends Omit<ProductPayload, 'sellerId'> {
  _id: string;
  sellerId: Types.ObjectId;
}

const productImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: String,
  },
  { _id: false },
);

const productSchema = new Schema<ProductDocument>(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    brand: String,
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    images: { type: [productImageSchema], default: [] },
    ratings: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    size: { type: String, required: false },
    ingredients: String,
    howToUse: String,
    subCategory: String,
    productType: String,
    mrp: Number,
    discount: Number,
    status: { type: String, enum: ['Active', 'Draft', 'Out of Stock'], default: 'Active' },
    gallery: { type: [String], default: [] },
    fullDescription: String,
    skinType: String,
    hairType: String,
    tags: { type: [String], default: [] },
    weight: String,
    shippingCharge: Number,
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true },
);

export const ProductModel = model<ProductDocument>('Product', productSchema);
