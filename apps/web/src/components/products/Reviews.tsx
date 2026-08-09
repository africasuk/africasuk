"use client";

import { useState } from "react";
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
      className={`w-4 h-4 shrink-0 ${
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

  // Show 3 reviews initially, or all if toggled
  const INITIAL_COUNT = 3;
  const displayedReviews = showAll ? reviews : reviews.slice(0, INITIAL_COUNT);
  const hasMoreReviews = reviews.length > INITIAL_COUNT;

  return (
    <section className="mt-16 pt-12 border-t border-gray-200/80">
      <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
        {/* Left Column: Summary Card */}
        <div className="lg:w-1/3 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">
            Customer Reviews
          </h3>

          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {formattedRating}
            </span>
            <div className="space-y-1">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon
                    key={index}
                    filled={index < Math.round(rating.averageRating)}
                  />
                ))}
              </div>
              <p className="text-xs font-medium text-gray-500">
                Based on {rating.reviewCount}{" "}
                {rating.reviewCount === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Reviews List */}
        <div className="lg:w-2/3 flex-1 min-w-0">
          {reviews.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-gray-100/80">
              <p className="text-sm font-medium text-gray-500">
                No reviews yet. Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="divide-y divide-gray-100">
                {displayedReviews.map((review) => (
                  <article
                    key={review.id}
                    className="py-6 first:pt-0 last:pb-0 space-y-2.5 wrap-break-word"
                  >
                    {/* Rating Stars & Date Header */}
                    <div className="flex items-center justify-between gap-4 flex-wrap">
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
                        className="text-xs text-gray-400 font-medium"
                      >
                        {new Date(review.createdAt)
                          .toISOString()
                          .slice(0, 10)}
                      </time>
                    </div>

                    {/* Reviewer Name */}
                    <p className="text-sm font-bold text-gray-900 wrap-break-word">
                      {(review as { reviewerName?: string }).reviewerName ?? "Verified Buyer"}
                    </p>

                    {/* Review Title */}
                    {review.title && (
                      <h4 className="font-semibold text-gray-900 text-base leading-snug wrap-break-word">
                        {review.title}
                      </h4>
                    )}

                    {/* Review Body */}
                    {review.comment && (
                      <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line wrap-break-word">
                        {review.comment}
                      </p>
                    )}

                    {/* Review Metadata */}
                    <div className="pt-1 flex items-center gap-3 flex-wrap">
                      {review.verifiedPurchase && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <svg
                            className="w-3 h-3 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Verified Purchase
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {/* View All / View Less Button */}
              {hasMoreReviews && (
                <div className="pt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setShowAll(!showAll)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-gray-800 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
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