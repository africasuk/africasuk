"use client";

import { useState, useMemo } from "react";
import type { Review } from "@africasuk/types";
import {
  Eye,
  EyeOff,
  Trash2,
  Star,
  Loader2,
  MessageSquareOff,
  Search,
  ArrowUpDown,
  X,
} from "lucide-react";

type AdminReview = Review & {
  reviewer?: {
    name: string;
    email: string;
  };
};

interface Props {
  reviews: AdminReview[];
}

export function ReviewTable({ reviews: initialReviews }: Props) {
  const [reviews, setReviews] = useState(initialReviews);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Search and Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  async function updateStatus(
    reviewId: string,
    status: "APPROVED" | "HIDDEN",
  ) {
    try {
      setLoadingId(reviewId);

      const response = await fetch("/api/reviews", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update review.");
      }

      setReviews((current) =>
        current.map((review) =>
          review.id === reviewId
            ? { ...review, status }
            : review,
        ),
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update review.",
      );
    } finally {
      setLoadingId(null);
    }
  }

  async function deleteReview(reviewId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this review?",
    );

    if (!confirmed) return;

    try {
      setLoadingId(reviewId);

      const response = await fetch("/api/reviews", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete review.");
      }

      setReviews((current) =>
        current.filter((review) => review.id !== reviewId),
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete review.",
      );
    } finally {
      setLoadingId(null);
    }
  }

  // Filter and Sort Reviews
  const filteredAndSortedReviews = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const filtered = reviews.filter((review) => {
      if (!query) return true;

      const nameMatch = review.reviewer?.name?.toLowerCase().includes(query);
      const emailMatch = review.reviewer?.email?.toLowerCase().includes(query);
      const titleMatch = review.title?.toLowerCase().includes(query);
      const commentMatch = review.comment?.toLowerCase().includes(query);

      return nameMatch || emailMatch || titleMatch || commentMatch;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });
  }, [reviews, searchQuery, sortOrder]);

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-xs transition-colors dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-3 rounded-full bg-gray-100 p-3 text-gray-400 dark:bg-zinc-800 dark:text-zinc-500">
          <MessageSquareOff className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">
          No reviews yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Sort Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reviewer, title, or comment..."
            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-9 py-2 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <ArrowUpDown className="h-3.5 w-3.5 text-gray-400 dark:text-zinc-500" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "latest" | "oldest")}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 focus:border-emerald-600 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:focus:border-emerald-500"
          >
            <option value="latest">Sort by Latest</option>
            <option value="oldest">Sort by Oldest</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs transition-colors dark:border-zinc-800 dark:bg-zinc-900">
        {filteredAndSortedReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Search className="mb-2 h-6 w-6 text-gray-400 dark:text-zinc-500" />
            <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">
              No matching reviews
            </p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-zinc-500">
              Try searching with different keywords.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="border-b border-gray-200/80 bg-gray-50/80 transition-colors dark:border-zinc-800 dark:bg-zinc-800/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                    Review
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                    Rating
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 transition-colors dark:divide-zinc-800/60">
                {filteredAndSortedReviews.map((review) => {
                  const isLoading = loadingId === review.id;
                  const isHidden = review.status === "HIDDEN";

                  return (
                    <tr
                      key={review.id}
                      className={`transition-colors hover:bg-gray-50/60 dark:hover:bg-zinc-800/40 ${
                        isHidden ? "opacity-60 dark:opacity-50" : ""
                      }`}
                    >
                      <td className="max-w-xl px-6 py-5 align-top">
                        <div className="space-y-1.5">
                          <div className="mb-3">
                            <p className="text-sm font-bold text-gray-900 dark:text-zinc-100">
                              {review.reviewer?.name ?? "Unknown User"}
                            </p>

                            <p className="text-xs text-gray-500 dark:text-zinc-500">
                              {review.reviewer?.email ?? "No email"}
                            </p>
                          </div>

                          {review.title && (
                            <p className="font-bold leading-snug text-gray-900 dark:text-zinc-100">
                              {review.title}
                            </p>
                          )}

                          {review.comment && (
                            <p className="line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-zinc-400">
                              {review.comment}
                            </p>
                          )}

                          <p className="text-[11px] font-medium text-gray-400 dark:text-zinc-500">
                            {new Date(review.createdAt).toISOString().slice(0, 10)}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="flex items-center gap-1 pt-0.5">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={`h-4 w-4 ${
                                index < review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-200 dark:text-zinc-700"
                              }`}
                            />
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                            isHidden
                              ? "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400"
                              : "border border-emerald-200/60 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-400"
                          }`}
                        >
                          {review.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="flex items-center justify-end gap-2">
                          {isHidden ? (
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() =>
                                updateStatus(
                                  review.id,
                                  "APPROVED",
                                )
                              }
                              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/50 px-3 py-2 text-xs font-bold text-emerald-700 transition-all hover:bg-emerald-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-800/60 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                            >
                              {isLoading ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Eye className="h-3.5 w-3.5" />
                              )}
                              Show
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() =>
                                updateStatus(
                                  review.id,
                                  "HIDDEN",
                                )
                              }
                              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 transition-all hover:bg-gray-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700/70"
                            >
                              {isLoading ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <EyeOff className="h-3.5 w-3.5" />
                              )}
                              Hide
                            </button>
                          )}

                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() =>
                              deleteReview(review.id)
                            }
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/40 px-3 py-2 text-xs font-bold text-rose-600 transition-all hover:bg-rose-100/70 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-900/40"
                          >
                            {isLoading ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}