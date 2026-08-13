import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Star, Check } from "lucide-react-native";
import type { Review } from "@africasuk/types";

interface ReviewsProps {
  reviews: Review[];
  rating: {
    averageRating: number;
    reviewCount: number;
  };
}


export function Reviews({ reviews, rating }: ReviewsProps) {
  const [showAll, setShowAll] = useState(false);

  const formattedRating = Number(rating.averageRating || 0).toFixed(1);

  const INITIAL_COUNT = 3;
  const displayedReviews = showAll
    ? reviews
    : reviews.slice(0, INITIAL_COUNT);

  const hasMoreReviews = reviews.length > INITIAL_COUNT;

  return (
    <View style={styles.container}>
      {/* Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.heading}>Customer Reviews</Text>

        <View style={styles.ratingRow}>
          <Text style={styles.ratingNumber}>{formattedRating}</Text>

          <View>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={17}
                  color="#fbbf24"
                  fill={
                    star <= Math.round(rating.averageRating)
                      ? "#fbbf24"
                      : "#e5e7eb"
                  }
                />
              ))}
            </View>

            <Text style={styles.basedOn}>
              Based on {rating.reviewCount}{" "}
              {rating.reviewCount === 1 ? "review" : "reviews"}
            </Text>
          </View>
        </View>
      </View>

      {/* Reviews */}
      {reviews.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No reviews yet. Be the first to share your thoughts!
          </Text>
        </View>
      ) : (
        <View style={styles.reviewList}>
          {displayedReviews.map((review) => {
            const reviewerName =
              (review as { reviewerName?: string }).reviewerName ??
              "Verified Buyer";

            return (
              <View key={review.id} style={styles.review}>
                {/* Rating + Date */}
                <View style={styles.reviewHeader}>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={15}
                        color={
                          star <= review.rating ? "#fbbf24" : "#e5e7eb"
                        }
                        fill={
                          star <= review.rating ? "#fbbf24" : "#e5e7eb"
                        }
                      />
                    ))}
                  </View>

                  <Text style={styles.date}>
                    {new Date(review.createdAt)
                      .toISOString()
                      .slice(0, 10)}
                  </Text>
                </View>

                {/* Reviewer */}
                <Text style={styles.reviewer}>{reviewerName}</Text>

                {/* Title */}
                {review.title ? (
                  <Text style={styles.reviewTitle}>{review.title}</Text>
                ) : null}

                {/* Comment */}
                {review.comment ? (
                  <Text style={styles.comment}>{review.comment}</Text>
                ) : null}

                {/* Verified */}
                {review.verifiedPurchase && (
                  <View style={styles.verifiedBadge}>
                    <Check size={12} color="#047857" strokeWidth={3} />

                    <Text style={styles.verifiedText}>
                      Verified Purchase
                    </Text>
                  </View>
                )}
              </View>
            );
          })}

          {/* Show all */}
          {hasMoreReviews && (
            <Pressable
              onPress={() => setShowAll((value) => !value)}
              style={({ pressed }) => [
                styles.showButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.showButtonText}>
                {showAll
                  ? "SHOW LESS"
                  : `VIEW ALL ${reviews.length} REVIEWS`}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    gap: 18,
  },

  summaryCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 14,
    gap: 16,
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  ratingNumber: {
    fontSize: 40,
    fontWeight: "800",
    color: "#111827",
  },

  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  basedOn: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
  },

  emptyCard: {
    padding: 24,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 14,
    alignItems: "center",
  },

  emptyText: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "500",
    color: "#6b7280",
  },

  reviewList: {
    gap: 0,
  },

  review: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    gap: 9,
  },

  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  date: {
    fontSize: 11,
    fontWeight: "500",
    color: "#9ca3af",
  },

  reviewer: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  reviewTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    lineHeight: 21,
  },

  comment: {
    fontSize: 14,
    lineHeight: 21,
    color: "#4b5563",
  },

  verifiedBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },

  verifiedText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#047857",
  },

  showButton: {
    alignSelf: "center",
    marginTop: 16,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 22,
    backgroundColor: "#f3f4f6",
  },

  showButtonText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: "#374151",
  },

  pressed: {
    opacity: 0.7,
  },
});