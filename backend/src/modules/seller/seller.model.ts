import { Schema, model } from 'mongoose';
import type { SellerProfile } from './seller.interface';

export interface SellerDocument extends SellerProfile {
  _id: string;
  role: 'SELLER';
  password: string;
  isApproved: boolean;
  isActive: boolean;
}

const sellerSchema = new Schema<SellerDocument>(
  {
    salonName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    shopLicence: { type: String, required: true, trim: true },
    shopImage: { type: String, required: true, trim: true },
    bio: String,
    profileImage: String,
    role: { type: String, default: 'SELLER' },
    password: { type: String, required: true, select: false },
    isApproved: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const SellerModel = model<SellerDocument>('Seller', sellerSchema);
