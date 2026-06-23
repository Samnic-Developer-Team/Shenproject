import { apiRequest } from "@/lib/api";

export interface Review {
  _id: string;
  userId: string;
  targetId: string;
  type: "PRODUCT" | "SERVICE" | "SALON";
  rating: number;
  comment?: string;
  createdAt?: string;
  user?: { name?: string; email?: string };
}

export interface CreateReviewPayload {
  userId: string;
  targetId: string;
  type: "PRODUCT" | "SERVICE" | "SALON";
  rating: number;
  comment?: string;
}

export async function listReviews(targetId?: string): Promise<Review[]> {
  const endpoint = targetId ? `/reviews/${targetId}` : "/reviews";
  const res = await apiRequest<{ data: Review[] }>(endpoint);
  return res.data || [];
}

export async function createReview(payload: CreateReviewPayload): Promise<Review> {
  const res = await apiRequest<{ data: Review }>("/reviews", {
    method: "POST",
    bodyData: payload,
  });
  return res.data;
}

export async function deleteReview(id: string): Promise<void> {
  await apiRequest(`/reviews/${id}`, {
    method: "DELETE",
  });
}
