import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";

interface ReviewFormProps {
  productId: string;
  orderId: string;
  orderItemId: string;
  variantId?: string | null;
  onSuccess?: () => void;
}

const BRAND = "#005c2e";
const BRAND_DARK = "#002b15";

export function ReviewForm({
  productId,
  orderId,
  orderItemId,
  variantId = null,
  onSuccess,
}: ReviewFormProps) {
  const { width } = useWindowDimensions();

  // Responsive break points
  const isTablet = width >= 600;

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const baseUrl = process.env.EXPO_PUBLIC_API_URL || "https://africasuk.com";
      const response = await fetch(`${baseUrl}/api/reviews`, {
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
    <View style={[styles.container, { padding: isTablet ? 24 : 16 }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>WRITE A REVIEW</Text>
        <Text style={styles.verified}>Verified Purchase</Text>
      </View>

      {/* Star Rating Section */}
      <View style={styles.section}>
        <Text style={styles.label}>YOUR RATING</Text>

        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Pressable
              key={value}
              onPress={() => setRating(value)}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text
                style={[
                  styles.star,
                  { fontSize: isTablet ? 32 : 28 },
                  value <= rating && styles.activeStar,
                ]}
              >
                ★
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Title Input */}
      <View style={styles.section}>
        <Text style={styles.label}>TITLE</Text>

        <TextInput
          value={title}
          onChangeText={setTitle}
          maxLength={100}
          placeholder="How was the product?"
          placeholderTextColor="#9ca3af"
          style={styles.input}
        />
      </View>

      {/* Review Comment Input & Counter */}
      <View style={styles.section}>
        <View style={styles.reviewHeader}>
          <Text style={styles.label}>REVIEW</Text>
          <Text style={styles.counter}>{comment.length}/1000</Text>
        </View>

        <TextInput
          value={comment}
          onChangeText={setComment}
          maxLength={1000}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          placeholder="Tell us about your experience..."
          placeholderTextColor="#9ca3af"
          style={[styles.input, styles.textarea]}
        />
      </View>

      {/* Feedback Messages */}
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {success ? (
        <View style={styles.successBox}>
          <Text style={styles.successText}>
            Review submitted successfully. It will appear after approval.
          </Text>
        </View>
      ) : null}

      {/* Submit Button Row */}
      <View
        style={[
          styles.buttonRow,
          { justifyContent: isTablet ? "flex-end" : "flex-start" },
        ]}
      >
        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          style={({ pressed }) => [
            styles.submitButton,
            isTablet && styles.tabletSubmitButton,
            pressed && styles.pressed,
            loading && styles.disabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.submitText}>SUBMIT REVIEW</Text>
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
    borderRadius: 0,
    gap: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },

  heading: {
    fontSize: 13,
    fontWeight: "500",
    color: BRAND_DARK,
    letterSpacing: 0.5,
  },

  verified: {
    fontSize: 11,
    fontWeight: "400",
    color: "#6b7280",
  },

  section: {
    gap: 6,
  },

  label: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6b7280",
    letterSpacing: 0.8,
  },

  stars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 2,
  },

  star: {
    color: "#e5e7eb",
  },

  activeStar: {
    color: "#f59e0b",
  },

  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    borderRadius: 0,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: "400",
    color: "#111827",
  },

  textarea: {
    minHeight: 110,
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

  errorBox: {
    padding: 12,
    borderRadius: 0,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },

  errorText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#b91c1c",
  },

  successBox: {
    padding: 12,
    borderRadius: 0,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },

  successText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#047857",
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
    backgroundColor: BRAND,
    borderRadius: 0,
    paddingHorizontal: 24,
  },

  tabletSubmitButton: {
    width: "auto",
    minWidth: 180,
  },

  submitText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.5,
  },

  pressed: {
    opacity: 0.85,
  },

  disabled: {
    opacity: 0.5,
  },
});