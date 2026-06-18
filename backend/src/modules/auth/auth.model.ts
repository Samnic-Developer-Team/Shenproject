import { Schema, model } from 'mongoose';
import type { Role } from '../../constants/roles';
import type { RegisterPayload } from './auth.interface';

export interface AuthUserDocument extends Omit<RegisterPayload, 'role'> {
  _id: string;
  password: string;
  isActive: boolean;
  role: Role;
}

const authUserSchema = new Schema<AuthUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['USER', 'SELLER', 'ADMIN'], default: 'USER' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const AuthUserModel = model<AuthUserDocument>('AuthUser', authUserSchema);
