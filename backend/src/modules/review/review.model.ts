import { Schema, model, type Types } from 'mongoose';
import { ReviewType } from '../../constants/reviewTypes';
import type { ReviewPayload } from './review.interface';

export interface ReviewDocument extends Omit<ReviewPayload, 'userId' | 'targetId'> {
  _id: string;
  userId: Types.ObjectId;
  targetId: Types.ObjectId;
}

const reviewSchema = new Schema<ReviewDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: Object.values(ReviewType), required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: true },
);

export const ReviewModel = model<ReviewDocument>('Review', reviewSchema);
