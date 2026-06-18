import { Schema, model, type Types } from 'mongoose';
import type { ServicePayload } from './service.interface';

export interface ServiceDocument extends Omit<ServicePayload, 'sellerId'> {
  _id: string;
  sellerId: Types.ObjectId;
}

const serviceImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: String,
  },
  { _id: false },
);

const serviceSchema = new Schema<ServiceDocument>(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    images: { type: [serviceImageSchema], default: [] },
    isActive: { type: Boolean, default: true },
    benefits: String,
    image: String,
    subCategory: String,
    fullDescription: String,
    availableDays: { type: [String], default: [] },
    gender: { type: String, enum: ['Men', 'Women', 'Unisex'], default: 'Unisex' },
    status: { type: String, enum: ['Active', 'Draft'], default: 'Active' },
    homeServiceAvailable: { type: Boolean, default: false },
    featuredService: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const ServiceModel = model<ServiceDocument>('Service', serviceSchema);
