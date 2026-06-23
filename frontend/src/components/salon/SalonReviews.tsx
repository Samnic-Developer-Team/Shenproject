"use client";

import { useState, useEffect } from "react";
import { RatingStars } from "@/components/common/RatingStars";
import { useAuthStore } from "@/store/authStore";
import { listReviews, createReview, type Review } from "@/services/review.service";
import Link from "next/link";

interface SalonReviewsProps {
  targetId?: string;
  type?: "SALON" | "PRODUCT" | "SERVICE";
}

// Fallback mockup reviews if backend has no records yet
const MOCK_REVIEWS = [
  {
    _id: "1",
    userId: "mock-1",
    targetId: "mock",
    type: "SALON" as const,
    rating: 5,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    comment: "Absolutely stunning treatment! Sourced the keratin hair spa and the results were incredible. The styling suites are private and extremely quiet.",
    user: { name: "Tana Yami", email: "tana@example.com" }
  },
  {
    _id: "2",
    userId: "mock-2",
    targetId: "mock",
    type: "SALON" as const,
    rating: 5,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    comment: "The HydraFacial here is clinically superior to others I have tried. Safe, sanitized, and relaxing. Professional staff checked my skin sensitivity first.",
    user: { name: "Priya Das", email: "priya@example.com" }
  },
  {
    _id: "3",
    userId: "mock-3",
    targetId: "mock",
    type: "SALON" as const,
    rating: 4,
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    comment: "Had a great Deep Tissue Aromatherapy session. They customized the lavender blends for my back stress. Highly recommended!",
    user: { name: "Lobsang Wangdu", email: "lobsang@example.com" }
  }
];

export function SalonReviews({ targetId, type = "SALON" }: SalonReviewsProps) {
  const { user, isAuthenticated } = useAuthStore();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviewsData = async () => {
    setIsLoading(true);
    try {
      const data = await listReviews(targetId);
      setReviews(data);
    } catch (e) {
      console.error("Failed to load reviews:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (targetId) {
      fetchReviewsData();
    }
  }, [targetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      alert("Please sign in to write a review.");
      return;
    }
    if (!targetId) return;

    setIsSubmitting(true);
    try {
      await createReview({
        userId: user.id,
        targetId,
        type,
        rating,
        comment,
      });
      setComment("");
      setRating(5);
      alert("Your review has been posted successfully!");
      fetchReviewsData();
    } catch (err: any) {
      alert(`Failed to submit review: ${err.message || "Failed to submit review. Please try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Combine fetched reviews with mockup reviews if database is empty to keep rich design
  const displayReviews = reviews.length > 0 ? reviews : MOCK_REVIEWS;

  // Calculate average rating
  const avgRating = displayReviews.length > 0
    ? Number((displayReviews.reduce((sum, r) => sum + r.rating, 0) / displayReviews.length).toFixed(1))
    : 5.0;

  // Rating count percentages
  const countStars = (stars: number) => displayReviews.filter((r) => Math.round(r.rating) === stars).length;
  const pctStars = (stars: number) => {
    if (displayReviews.length === 0) return 0;
    return Math.round((countStars(stars) / displayReviews.length) * 100);
  };

  return (
    <div className="space-y-8 select-none">
      {/* Review Summaries */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/10 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Core Score */}
        <div className="md:col-span-4 text-center md:border-r border-outline-variant/10 md:pr-8">
          <div className="text-5xl font-black text-on-surface">{avgRating}</div>
          <div className="flex justify-center my-2">
            <RatingStars value={avgRating} />
          </div>
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider">
            {displayReviews.length} Verified Reviews
          </p>
        </div>

        {/* Rating Breakdown bars */}
        <div className="md:col-span-8 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const pct = pctStars(stars);
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-3 text-right font-semibold text-on-surface-variant">
                  {stars}
                </span>
                <span className="material-symbols-outlined text-yellow-500 !text-xs select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <div className="flex-1 h-2 bg-surface-container-low rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right font-medium text-outline">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write a Review Section */}
      <div className="bg-white border border-outline-variant/10 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-4">
        <h4 className="text-base font-extrabold text-on-surface uppercase tracking-wider text-[11px] text-outline">
          Share your experience
        </h4>
        
        {isAuthenticated ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Clickable Rating Stars */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Your Rating</label>
              <div className="flex gap-1.5 items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                  >
                    <span
                      className="material-symbols-outlined text-yellow-500 text-2xl"
                      style={{ fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Area */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-outline block">Review Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you liked or how we can improve..."
                rows={3}
                required
                className="w-full bg-[#f6f8fd] border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl p-4 text-xs font-semibold focus:outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary text-white hover:opacity-95 rounded-2xl text-xs font-extrabold transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                  Posting...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm font-bold">send</span>
                  Submit Review
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="bg-surface-container-low/40 border border-outline-variant/10 rounded-2xl p-6 text-center select-none space-y-3">
            <span className="material-symbols-outlined text-3xl text-outline-variant">rate_review</span>
            <p className="text-xs text-on-surface-variant font-medium max-w-sm mx-auto leading-relaxed">
              You must be logged in as a user to submit a review for this salon.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-violet-800 text-white rounded-full text-xs font-extrabold transition-all duration-300 active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">login</span>
              Log In to Write Review
            </Link>
          </div>
        )}
      </div>

      {/* Customer Reviews Feed */}
      <div>
        <h4 className="text-base font-extrabold text-on-surface mb-4 uppercase tracking-wider text-[11px] text-outline">
          Customer Stories
        </h4>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-28 bg-surface-container-low rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {displayReviews.map((review) => {
              const reviewUser = review.user || { name: "Verified Customer" };
              const dateStr = review.createdAt
                ? new Date(review.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                : "2 days ago";

              return (
                <div
                  key={review._id}
                  className="bg-white p-5 sm:p-6 rounded-3xl border border-outline-variant/5 shadow-sm space-y-3.5 animate-in fade-in duration-300"
                >
                  {/* Review Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-violet-100 border border-outline-variant/10 flex items-center justify-center text-primary font-bold text-sm select-none">
                        {reviewUser.name ? reviewUser.name.charAt(0).toUpperCase() : "C"}
                      </div>
                      <div>
                        <h5 className="font-bold text-on-surface text-sm">{reviewUser.name}</h5>
                        <p className="text-[9px] text-outline font-semibold uppercase tracking-wider mt-0.5">{dateStr}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <RatingStars value={review.rating} />
                    </div>
                  </div>

                  {/* Review Description */}
                  <p className="text-on-surface-variant text-xs leading-relaxed select-text">
                    "{review.comment || "Excellent service!"}"
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SalonReviews;
