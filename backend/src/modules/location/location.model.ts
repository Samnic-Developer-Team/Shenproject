import { Schema, model } from 'mongoose';
import type { Location } from './location.interface';

export interface LocationDocument extends Location {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new Schema<LocationDocument>(
  {
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Ensure unique city + state combination (case-insensitive can be handled in logic or collation, index suffices for standard unique check)
locationSchema.index({ city: 1, state: 1 }, { unique: true });

export const LocationModel = model<LocationDocument>('Location', locationSchema);
