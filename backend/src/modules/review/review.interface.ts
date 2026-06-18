import type { ReviewTypeType } from '../../constants/reviewTypes';

export interface ReviewPayload {
  userId: string;
  targetId: string;
  type: ReviewTypeType;
  rating: number;
  comment?: string;
}
