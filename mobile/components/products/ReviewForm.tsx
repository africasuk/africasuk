import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import {
  createReview,
  getUserReviewForOrderItem,
} from "@/lib/api/reviews";
import type { Review } from "@africasuk/types";

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
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingReview, setCheckingReview] = useState(true);

  const [error, setError] = useState("");
  const [existingReview, setExistingReview] =
    useState<Review | null>(null);

  const ratingLabel =
    rating === 5
      ? "Excellent"
      : rating === 4
        ? "Good"
        : rating === 3
          ? "Average"
          : rating === 2
            ? "Poor"
            : "Terrible";

  /*
   * Check if the current user has already reviewed
   * this specific order item.
   */
  useEffect(() => {
    let mounted = true;

    async function checkExistingReview() {
      setCheckingReview(true);
      setError("");

      try {
        const review =
          await getUserReviewForOrderItem(orderItemId);

        if (mounted) {
          setExistingReview(review);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to check your review."
          );
        }
      } finally {
        if (mounted) {
          setCheckingReview(false);
        }
      }
    }

    checkExistingReview();

    return () => {
      mounted = false;
    };
  }, [orderItemId]);

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const result = await createReview({
        productId,
        orderId,
        orderItemId,
        variantId,
        rating,
        title: title.trim() || null,
        comment: comment.trim() || null,
      });

      /*
       * Immediately replace the form with
       * the newly submitted review.
       */
      setExistingReview(result.review);

      setTitle("");
      setComment("");
      setRating(5);

      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit review."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Loading state while checking whether
   * the user already reviewed this item.
   */
  if (checkingReview) {
    return (
      <View
        style={[
          styles.container,
          styles.loadingContainer,
          {
            padding: isTablet ? 24 : 16,
          },
        ]}
      >
        <ActivityIndicator
          size="small"
          color="#111827"
        />

        <Text style={styles.checkingText}>
          Checking your review...
        </Text>
      </View>
    );
  }

  /*
   * Existing review display.
   * No input fields and no edit button.
   */
  if (existingReview) {
    return (
      <View
        style={[
          styles.container,
          {
            padding: isTablet ? 24 : 16,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.heading}>
              Your Review
            </Text>

            <Text style={styles.subheading}>
              You have already reviewed this product
            </Text>
          </View>

          <View style={styles.verifiedBadge}>
            <Text style={styles.verified}>
              Verified Purchase
            </Text>
          </View>
        </View>

        {/* Rating */}
        <View style={styles.section}>
          <Text style={styles.label}>
            YOUR RATING
          </Text>

          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((value) => (
                <Text
                  key={value}
                  style={[
                    styles.star,
                    styles.existingStar,
                    value <= existingReview.rating &&
                      styles.activeStar,
                    {
                      fontSize: isTablet ? 32 : 28,
                    },
                  ]}
                >
                  ★
                </Text>
              ))}
            </View>

            <Text style={styles.ratingLabel}>
              {existingReview.rating === 5
                ? "Excellent"
                : existingReview.rating === 4
                  ? "Good"
                  : existingReview.rating === 3
                    ? "Average"
                    : existingReview.rating === 2
                      ? "Poor"
                      : "Terrible"}
            </Text>
          </View>
        </View>

        {/* Title */}
        {existingReview.title ? (
          <View style={styles.section}>
            <Text style={styles.label}>
              HEADLINE
            </Text>

            <Text style={styles.reviewTitle}>
              {existingReview.title}
            </Text>
          </View>
        ) : null}

        {/* Comment */}
        {existingReview.comment ? (
          <View style={styles.section}>
            <Text style={styles.label}>
              DETAILED REVIEW
            </Text>

            <Text style={styles.reviewComment}>
              {existingReview.comment}
            </Text>
          </View>
        ) : null}

        {/* Verified */}
        <View style={styles.reviewFooter}>
          <Text style={styles.verifiedCheck}>
            ✓ Verified Purchase
          </Text>
        </View>
      </View>
    );
  }

  /*
   * Review form.
   */
  return (
    <View
      style={[
        styles.container,
        {
          padding: isTablet ? 24 : 16,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.heading}>
            Write a Review
          </Text>

          <Text style={styles.subheading}>
            Share your feedback with future shoppers
          </Text>
        </View>

        <View style={styles.verifiedBadge}>
          <Text style={styles.verified}>
            Verified Purchase
          </Text>
        </View>
      </View>

      {/* Rating */}
      <View style={styles.section}>
        <Text style={styles.label}>
          OVERALL RATING
        </Text>

        <View style={styles.ratingRow}>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((value) => (
              <Pressable
                key={value}
                onPress={() => setRating(value)}
                disabled={loading}
                hitSlop={{
                  top: 8,
                  bottom: 8,
                  left: 4,
                  right: 4,
                }}
                style={({ pressed }) => [
                  styles.starButton,
                  pressed && styles.starPressed,
                ]}
              >
                <Text
                  style={[
                    styles.star,
                    value <= rating &&
                      styles.activeStar,
                    {
                      fontSize: isTablet ? 32 : 28,
                    },
                  ]}
                >
                  ★
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.ratingLabel}>
            {ratingLabel}
          </Text>
        </View>
      </View>

      {/* Title */}
      <View style={styles.section}>
        <Text style={styles.label}>
          HEADLINE
        </Text>

        <TextInput
          value={title}
          onChangeText={setTitle}
          maxLength={100}
          placeholder="What's the most important thing to know?"
          placeholderTextColor="#9ca3af"
          style={styles.input}
          editable={!loading}
        />
      </View>

      {/* Comment */}
      <View style={styles.section}>
        <View style={styles.reviewHeader}>
          <Text style={styles.label}>
            DETAILED REVIEW
          </Text>

          <Text style={styles.counter}>
            {comment.length}/1000
          </Text>
        </View>

        <TextInput
          value={comment}
          onChangeText={setComment}
          maxLength={1000}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          placeholder="What did you like or dislike? How was the fit, material, or quality?"
          placeholderTextColor="#9ca3af"
          style={[
            styles.input,
            styles.textarea,
          ]}
          editable={!loading}
        />
      </View>

      {/* Error */}
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      ) : null}

      {/* Submit */}
      <View
        style={[
          styles.buttonRow,
          {
            justifyContent: isTablet
              ? "flex-end"
              : "flex-start",
          },
        ]}
      >
        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          style={({ pressed }) => [
            styles.submitButton,
            isTablet &&
              styles.tabletSubmitButton,
            pressed && styles.pressed,
            loading && styles.disabled,
          ]}
        >
          {loading ? (
            <View style={styles.loadingContent}>
              <ActivityIndicator
                color="#ffffff"
                size="small"
              />

              <Text style={styles.submitText}>
                Submitting...
              </Text>
            </View>
          ) : (
            <Text style={styles.submitText}>
              Submit Review
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 20,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    gap: 16,
  },

  loadingContainer: {
    minHeight: 90,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  checkingText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#6b7280",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },

  headerText: {
    flex: 1,
  },

  heading: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.2,
  },

  subheading: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: "400",
    color: "#6b7280",
  },

  verifiedBadge: {
    marginLeft: 12,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },

  verified: {
    fontSize: 10,
    fontWeight: "500",
    color: "#6b7280",
  },

  section: {
    gap: 7,
  },

  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
    letterSpacing: 0.5,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  stars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  starButton: {
    padding: 2,
  },

  starPressed: {
    transform: [{ scale: 0.95 }],
  },

  star: {
    color: "#d1d5db",
  },

  existingStar: {
    paddingHorizontal: 2,
  },

  activeStar: {
    color: "#f59e0b",
  },

  ratingLabel: {
    marginLeft: 10,
    fontSize: 11,
    fontWeight: "500",
    color: "#6b7280",
  },

  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13,
    fontWeight: "400",
    color: "#111827",
  },

  textarea: {
    minHeight: 110,
    paddingTop: 12,
  },

  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  counter: {
    fontSize: 10,
    fontWeight: "400",
    color: "#9ca3af",
  },

  reviewTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    lineHeight: 20,
  },

  reviewComment: {
    fontSize: 13,
    fontWeight: "400",
    color: "#374151",
    lineHeight: 20,
  },

  reviewFooter: {
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },

  verifiedCheck: {
    fontSize: 11,
    fontWeight: "500",
    color: "#047857",
  },

  errorBox: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },

  errorText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#b91c1c",
  },

  buttonRow: {
    width: "100%",
    marginTop: 4,
    flexDirection: "row",
  },

  submitButton: {
    height: 44,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
    borderRadius: 10,
    paddingHorizontal: 24,
  },

  tabletSubmitButton: {
    width: "auto",
    minWidth: 180,
  },

  loadingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  submitText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  pressed: {
    opacity: 0.85,
  },

  disabled: {
    opacity: 0.5,
  },
});