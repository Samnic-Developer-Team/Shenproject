import { Schema, model, type Types } from 'mongoose';
import type { UserProfile } from './user.interface';

export interface UserDocument extends Omit<UserProfile, 'wishlist'> {
  _id: string;
  role: 'USER';
  password: string;
  isActive: boolean;
  wishlist: Types.ObjectId[];
}

const addressSchema = new Schema(
  {
    label: String,
    city: { type: String, required: true },
    state: String,
    country: { type: String, required: true },
    postalCode: String,
    street: String,
  },
  { _id: false },
);

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: String,
    avatar: String,
    addresses: { type: [addressSchema], default: [] },
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    role: { type: String, default: 'USER' },
    password: { type: String, required: true, select: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const UserModel = model<UserDocument>('User', userSchema);
