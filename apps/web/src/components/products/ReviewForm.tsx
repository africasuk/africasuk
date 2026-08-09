"use client";

import { useState } from "react";

interface ReviewFormProps {
  productId: string;
  orderId: string;
  orderItemId: string;
  variantId?: string | null;
  onSuccess?: () => void;
}

export function ReviewForm({
  productId,
  orderId,
  orderItemId,
  variantId = null,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          orderId,
          orderItemId,
          variantId,
          rating,
          title: title.trim() || null,
          comment: comment.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to submit review.",
        );
      }

      setSuccess(true);
      setTitle("");
      setComment("");
      setRating(5);

      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit review.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs select-none transition-all"
    >
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h4 className="text-sm font-black uppercase tracking-wider text-[#002b15]">
          Write a Review
        </h4>
        <span className="text-xs text-gray-400 font-medium">
          Verified Purchase
        </span>
      </div>

      {/* Rating */}
      <div className="mt-6">
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
          Your Rating
        </label>

        <div
          className="flex items-center gap-1.5"
          onMouseLeave={() => setHoverRating(0)}
        >
          {Array.from({ length: 5 }).map((_, index) => {
            const value = index + 1;
            const activeRating = hoverRating || rating;
            const isFilled = value <= activeRating;

            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoverRating(value)}
                className="p-1 text-2xl transition-all duration-150 transform hover:scale-110 active:scale-95 focus:outline-hidden"
                aria-label={`${value} star`}
              >
                <span
                  className={
                    isFilled
                      ? "text-amber-400 drop-shadow-2xs"
                      : "text-gray-200 hover:text-amber-200"
                  }
                >
                  ★
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Title */}
      <div className="mt-6">
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
          Title
        </label>

        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={100}
          placeholder="How was the product?"
          className="w-full rounded-2xl border border-gray-200/80 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition duration-200 outline-hidden focus:border-[#005c2e] focus:bg-white focus:ring-4 focus:ring-[#005c2e]/10"
        />
      </div>

      {/* Comment */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
            Review
          </label>
          <span className="text-[11px] text-gray-400">
            {comment.length}/1000
          </span>
        </div>

        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          maxLength={1000}
          rows={4}
          placeholder="Tell us about your experience..."
          className="w-full resize-none rounded-2xl border border-gray-200/80 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition duration-200 outline-hidden focus:border-[#005c2e] focus:bg-white focus:ring-4 focus:ring-[#005c2e]/10"
        />
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-xs font-medium text-red-700">
          <svg
            className="w-4 h-4 shrink-0 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-xs font-medium text-emerald-800">
          <svg
            className="w-4 h-4 shrink-0 text-emerald-600"
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
          Review submitted successfully. It will appear after approval.
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto cursor-pointer rounded-full bg-linear-to-r from-[#002b15] to-[#005c2e] px-8 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-sm ring-2 ring-[#005c2e]/20 ring-offset-1 transition-all duration-200 hover:opacity-95 active:scale-98 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-3.5 h-3.5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Review"
          )}
        </button>
      </div>
    </form>
  );
}