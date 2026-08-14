"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { Review } from "@africasuk/types";

interface ReviewsProps {
  reviews: Review[];
  rating: {
    averageRating: number;
    reviewCount: number;
  };
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 ${
        filled ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"
      }`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export function Reviews({ reviews, rating }: ReviewsProps) {
  const [showAll, setShowAll] = useState(false);
  const formattedRating = Number(rating.averageRating || 0).toFixed(1);

  const INITIAL_COUNT = 3;
  const displayedReviews = showAll ? reviews : reviews.slice(0, INITIAL_COUNT);
  const hasMoreReviews = reviews.length > INITIAL_COUNT;

  return (
    <section className="mt-12 pt-8 border-t border-gray-100 select-none antialiased">
      <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10">
        {/* Left Column: Summary Box */}
        <div className="lg:w-1/3 bg-white p-4 sm:p-5 rounded-none border border-gray-200 shadow-none space-y-3 shrink-0">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 tracking-tight">
            Customer Reviews
          </h3>

          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              {formattedRating}
            </span>
            <div className="space-y-0.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon
                    key={index}
                    filled={index < Math.round(rating.averageRating)}
                  />
                ))}
              </div>
              <p className="text-[11px] sm:text-xs text-gray-500 font-normal">
                Based on {rating.reviewCount}{" "}
                {rating.reviewCount === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Reviews List */}
        <div className="lg:w-2/3 flex-1 min-w-0">
          {reviews.length === 0 ? (
            <div className="p-6 sm:p-8 text-center bg-gray-50/50 rounded-none border border-dashed border-gray-200">
              <p className="text-xs text-gray-500 font-normal">
                No reviews yet. Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="divide-y divide-gray-100">
                {displayedReviews.map((review) => (
                  <article
                    key={review.id}
                    className="py-4 first:pt-0 last:pb-0 space-y-1.5 wrap-break-word"
                  >
                    {/* Header: Rating & Date */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <StarIcon
                            key={index}
                            filled={index < review.rating}
                          />
                        ))}
                      </div>

                      <time
                        dateTime={review.createdAt}
                        className="text-[11px] text-gray-400 font-normal"
                      >
                        {new Date(review.createdAt)
                          .toISOString()
                          .slice(0, 10)}
                      </time>
                    </div>

                    {/* Reviewer Name */}
                    <p className="text-xs sm:text-sm font-medium text-gray-900">
                      {(review as { reviewerName?: string }).reviewerName ?? "Verified Buyer"}
                    </p>

                    {/* Review Title */}
                    {review.title && (
                      <h4 className="font-medium text-xs sm:text-sm text-gray-900 leading-snug">
                        {review.title}
                      </h4>
                    )}

                    {/* Review Body */}
                    {review.comment && (
                      <p className="text-xs sm:text-sm leading-relaxed text-gray-600 font-normal whitespace-pre-line">
                        {review.comment}
                      </p>
                    )}

                    {/* Verified Purchase Badge */}
                    {review.verifiedPurchase && (
                      <div className="pt-1">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-none text-[10px] font-medium bg-[#004d26]/5 text-[#004d26] border border-[#004d26]/20">
                          <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                          Verified Purchase
                        </span>
                      </div>
                    )}
                  </article>
                ))}
              </div>

              {/* View Toggle */}
              {hasMoreReviews && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAll(!showAll)}
                    className="w-full sm:w-auto px-4 h-8 border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 rounded-none text-xs font-medium text-gray-800 uppercase tracking-wider transition-colors cursor-pointer shadow-none"
                  >
                    {showAll
                      ? "Show Less"
                      : `View all ${reviews.length} reviews`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}