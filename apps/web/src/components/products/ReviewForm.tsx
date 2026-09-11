"use client";

import { useState } from "react";
import { Star, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
        throw new Error(data.error || "Failed to submit review.");
      }

      setSuccess(true);
      setTitle("");
      setComment("");
      setRating(5);

      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit review."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 select-none rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs antialiased transition-all sm:p-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <div>
          <h4 className="text-sm font-bold tracking-tight text-zinc-900">
            Write a Review
          </h4>
          <p className="mt-0.5 text-xs text-zinc-500">
            Share your feedback with future shoppers
          </p>
        </div>
        <span className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
          Verified Purchase
        </span>
      </div>

      {/* Star Rating */}
      <div className="mt-5">
        <label className="mb-2 block text-xs font-semibold text-zinc-700">
          Overall Rating
        </label>

        <div
          className="flex items-center gap-1"
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
                className="group -m-1 cursor-pointer p-1 transition-transform active:scale-95 focus:outline-hidden"
                aria-label={`Rate ${value} stars`}
              >
                <Star
                  className={`h-6 w-6 transition-colors duration-150 ${
                    isFilled
                      ? "fill-amber-400 text-amber-400"
                      : "fill-zinc-100 text-zinc-300 group-hover:fill-amber-100 group-hover:text-amber-300"
                  }`}
                  strokeWidth={1.5}
                />
              </button>
            );
          })}
          <span className="ml-2 text-xs font-medium text-zinc-500">
            {(hoverRating || rating) === 5
              ? "Excellent"
              : (hoverRating || rating) === 4
              ? "Good"
              : (hoverRating || rating) === 3
              ? "Average"
              : (hoverRating || rating) === 2
              ? "Poor"
              : "Terrible"}
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="mt-5">
        <label
          htmlFor="review-title"
          className="mb-1.5 block text-xs font-semibold text-zinc-700"
        >
          Headline
        </label>
        <input
          id="review-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={100}
          placeholder="What's the most important thing to know?"
          className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 transition outline-hidden focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
        />
      </div>

      {/* Comment */}
      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="review-comment"
            className="block text-xs font-semibold text-zinc-700"
          >
            Detailed Review
          </label>
          <span className="text-[11px] text-zinc-400">
            {comment.length}/1000
          </span>
        </div>

        <textarea
          id="review-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          maxLength={1000}
          rows={4}
          placeholder="What did you like or dislike? How was the fit, material, or quality?"
          className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs leading-relaxed text-zinc-900 placeholder:text-zinc-400 transition outline-hidden focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
        />
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/80 px-3.5 py-2.5 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" strokeWidth={2} />
          <span>{error}</span>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3.5 py-2.5 text-xs text-emerald-800">
          <CheckCircle2
            className="h-4 w-4 shrink-0 text-emerald-600"
            strokeWidth={2}
          />
          <span>Review submitted successfully. It will appear once approved.</span>
        </div>
      )}

      {/* Submit Action */}
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 text-xs font-semibold text-white transition active:scale-[0.985] hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400 sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2.5} />
              <span>Submitting...</span>
            </>
          ) : (
            <span>Submit Review</span>
          )}
        </button>
      </div>
    </form>
  );
}