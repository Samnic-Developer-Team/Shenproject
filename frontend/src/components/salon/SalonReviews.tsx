"use client";

import { RatingStars } from "@/components/common/RatingStars";

interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
}

const REVIEWS: Review[] = [
  {
    id: "1",
    author: "Tana Yami",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuApwflffIz9yIPJ2NcCfVSfu0BwmuYse14jT-j-HR10a50Xyyw6bnqJ48U-FErTLVpAqlgP_igIu86yb6cruAkp5_tYFSFeFFEvVeAOAmPrwdAVNhxNuRfAkXW9TekkVIehg8HCm5ruMucEnej-nUAl1BH-z3y0GlIIfgrWyR8C-oH7jgVitit_qNcbdWJ9qqplZoem0NO4c0u9YYkvnqGyNOoAuWkn2HqpZaqhjwTeEtplyy66HOcTupHP79VZv-ffbTPKTMj76g",
    rating: 5,
    date: "2 days ago",
    text: "Absolutely stunning treatment! Sourced the keratin hair spa and the results were incredible. The styling suites are private and extremely quiet.",
  },
  {
    id: "2",
    author: "Priya Das",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuADAbuBiVVuF4bU3Ryk_ykqbGp0R3jvNnhQPSDKrOUapyDRrIwPMs3PvvDOzE2aSgGVe42VzB9FTABxgkoXRnsGW8em_cGpkyyAEUgn6dqwIDi9ON-DG_1bC8MHGLOUuXicwtIdtSkuubPDETpPeye_WYjg35uqFSnj3Ybv7UWYoIH2qIyiqnN2muLLwO8xKOj05oLrFHbLTSfmmhE7fxrH3NJ9kD64cccxL6-XLPlwi8aEwRLok-ie1Lm8G819ZPGh5x_NUlLYqw",
    rating: 4.8,
    date: "1 week ago",
    text: "The HydraFacial here is clinically superior to others I have tried. Safe, sanitized, and relaxing. Professional staff checked my skin sensitivity first.",
  },
  {
    id: "3",
    author: "Lobsang Wangdu",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuApwflffIz9yIPJ2NcCfVSfu0BwmuYse14jT-j-HR10a50Xyyw6bnqJ48U-FErTLVpAqlgP_igIu86yb6cruAkp5_tYFSFeFFEvVeAOAmPrwdAVNhxNuRfAkXW9TekkVIehg8HCm5ruMucEnej-nUAl1BH-z3y0GlIIfgrWyR8C-oH7jgVitit_qNcbdWJ9qqplZoem0NO4c0u9YYkvnqGyNOoAuWkn2HqpZaqhjwTeEtplyy66HOcTupHP79VZv-ffbTPKTMj76g",
    rating: 4.7,
    date: "3 weeks ago",
    text: "Had a great Deep Tissue Aromatherapy session. They customized the lavender blends for my back stress. Highly recommended!",
  },
];

export function SalonReviews() {
  return (
    <div className="space-y-8 select-none">
      {/* Review Summaries */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/10 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Core Score */}
        <div className="md:col-span-4 text-center md:border-r border-outline-variant/10 md:pr-8">
          <div className="text-5xl font-black text-on-surface">4.8</div>
          <div className="flex justify-center my-2">
            <RatingStars value={4.8} />
          </div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            1,248 Verified Reviews
          </p>
        </div>

        {/* Rating Breakdown bars */}
        <div className="md:col-span-8 space-y-2">
          {[
            { stars: 5, pct: 78 },
            { stars: 4, pct: 14 },
            { stars: 3, pct: 5 },
            { stars: 2, pct: 2 },
            { stars: 1, pct: 1 },
          ].map((bar) => (
            <div key={bar.stars} className="flex items-center gap-3 text-xs">
              <span className="w-3 text-right font-semibold text-on-surface-variant">
                {bar.stars}
              </span>
              <span className="material-symbols-outlined text-yellow-500 !text-xs select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <div className="flex-1 h-2 bg-surface-container-low rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${bar.pct}%` }}
                />
              </div>
              <span className="w-8 text-right font-medium text-outline">
                {bar.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews Feed */}
      <div>
        <h4 className="text-lg font-bold text-on-surface mb-4">Customer Stories</h4>
        <div className="space-y-4">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/5 shadow-sm space-y-4"
            >
              {/* Review Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/10 bg-surface-container-low">
                    <img
                      alt={review.author}
                      src={review.avatar}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-on-surface text-sm">{review.author}</h5>
                    <p className="text-[10px] text-outline font-medium">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <RatingStars value={review.rating} />
                </div>
              </div>

              {/* Review Description */}
              <p className="text-on-surface-variant text-sm leading-relaxed">
                "{review.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SalonReviews;
