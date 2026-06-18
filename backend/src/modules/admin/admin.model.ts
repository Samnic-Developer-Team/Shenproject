import { Schema, model } from 'mongoose';
import type { AdminProfile } from './admin.interface';

export interface AdminDocument extends AdminProfile {
  _id: string;
  role: 'ADMIN';
}

const adminSchema = new Schema<AdminDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    permissions: [{ type: String }],
    role: { type: String, default: 'ADMIN' },
  },
  { timestamps: true },
);

export const AdminModel = model<AdminDocument>('Admin', adminSchema);
