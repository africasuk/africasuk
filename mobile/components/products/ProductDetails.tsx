import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import type { ProductWithDetails, Review } from "@africasuk/types";

import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { VariantSelector } from "./VariantSelector";
import { RelatedProducts } from "./RelatedProducts";

interface Props {
  product: ProductWithDetails;
  selectedColorId?: string;
  relatedProducts?: ProductWithDetails[];
}

interface Rating {
  averageRating: number;
  reviewCount: number;
}

const BRAND_COLOR = "#005c2e";

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={styles.stars}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Text
          key={index}
          style={[
            styles.star,
            index < Math.round(rating)
              ? styles.starFilled
              : styles.starEmpty,
          ]}
        >
          ★
        </Text>
      ))}
    </View>
  );
}

function ReviewsSection({
  reviews,
  rating,
  loading,
}: {
  reviews: Review[];
  rating: Rating;
  loading: boolean;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Customer Reviews
        </Text>

        {rating.reviewCount > 0 && (
          <Text style={styles.sectionSubtitle}>
            {rating.reviewCount}{" "}
            {rating.reviewCount === 1 ? "review" : "reviews"}
          </Text>
        )}
      </View>

      {/* Rating Summary */}
      <View style={styles.ratingCard}>
        <View style={styles.ratingNumberBox}>
          <Text style={styles.ratingNumber}>
            {Number(rating.averageRating || 0).toFixed(1)}
          </Text>

          <Text style={styles.ratingMax}>/ 5.0</Text>
        </View>

        <View style={styles.ratingMetaBox}>
          <StarRating rating={rating.averageRating} />

          <Text style={styles.reviewCount}>
            {rating.reviewCount === 0
              ? "Not yet rated"
              : `Based on ${rating.reviewCount} verified ${
                  rating.reviewCount === 1
                    ? "rating"
                    : "ratings"
                }`}
          </Text>
        </View>
      </View>

      {/* Reviews */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={BRAND_COLOR}
          />
        </View>
      ) : reviews.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>
            No reviews yet
          </Text>

          <Text style={styles.emptyText}>
            Be the first to share your thoughts about this item.
          </Text>
        </View>
      ) : (
        <View style={styles.reviewList}>
          {reviews.slice(0, 3).map((review) => (
            <View
              key={review.id}
              style={styles.reviewCard}
            >
              <View style={styles.reviewTopRow}>
                <StarRating rating={review.rating} />

                <Text style={styles.reviewDate}>
                  {new Date(review.createdAt)
                    .toISOString()
                    .slice(0, 10)}
                </Text>
              </View>

              <View style={styles.reviewerRow}>
                <Text style={styles.reviewerName}>
                  {(
                    review as {
                      reviewerName?: string;
                    }
                  ).reviewerName ?? "Verified Buyer"}
                </Text>

                {review.verifiedPurchase && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>
                      ✓ Verified
                    </Text>
                  </View>
                )}
              </View>

              {review.title && (
                <Text style={styles.reviewTitle}>
                  {review.title}
                </Text>
              )}

              {review.comment && (
                <Text style={styles.reviewComment}>
                  {review.comment}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export function ProductDetails({
  product,
  selectedColorId,
  relatedProducts = [],
}: Props) {
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.find(
      (color) => color.id === selectedColorId
    ) ?? product.colors?.[0]
  );

  const [reviews, setReviews] = useState<Review[]>([]);

  const [rating, setRating] = useState<Rating>({
    averageRating: 0,
    reviewCount: 0,
  });

  const [reviewsLoading, setReviewsLoading] =
    useState(true);

  // Sync selected color
  useEffect(() => {
    const targetColor =
      product.colors?.find(
        (color) => color.id === selectedColorId
      ) ?? product.colors?.[0];

    setSelectedColor(targetColor);
  }, [selectedColorId, product]);

  // Fetch product reviews
  useEffect(() => {
    let cancelled = false;

    async function fetchReviews() {
      try {
        setReviewsLoading(true);

        const response = await fetch(
            `https://africasuk.com/api/reviews?productId=${product.id}`
          );

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();

        if (cancelled) return;

        setReviews(data.reviews ?? []);

        setRating(
          data.rating ?? {
            averageRating: 0,
            reviewCount: 0,
          }
        );
      } catch (error) {
        console.error(
          "Mobile Reviews Error:",
          error
        );

        if (!cancelled) {
          setReviews([]);

          setRating({
            averageRating: 0,
            reviewCount: 0,
          });
        }
      } finally {
        if (!cancelled) {
          setReviewsLoading(false);
        }
      }
    }

    fetchReviews();

    return () => {
      cancelled = true;
    };
  }, [product.id]);

  const filteredRelated = relatedProducts.filter(
    (item) => item.id !== product.id
  );

  return (
    <View style={styles.container}>
      {/* Product Gallery */}
      <View style={styles.galleryWrapper}>
        <ProductGallery
          images={selectedColor?.images ?? []}
        />
      </View>

      {/* Product Information */}
      <View style={styles.infoWrapper}>
        <ProductInfo product={product} />
      </View>

      {/* Variant Selector */}
      <View style={styles.sectionDivider} />

      <View style={styles.variantWrapper}>
        <VariantSelector
          product={product}
          onColorChange={setSelectedColor}
        />
      </View>

      {/* Reviews */}
      <ReviewsSection
        reviews={reviews}
        rating={rating}
        loading={reviewsLoading}
      />

      {/* Related Products */}
      {filteredRelated.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Recommended For You
            </Text>

            <Text style={styles.sectionSubtitle}>
              Similar styles
            </Text>
          </View>

          <RelatedProducts
            products={filteredRelated}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    paddingBottom: 40,
    paddingTop: 50,
  },

  galleryWrapper: {
    marginBottom: 16,
  },

  infoWrapper: {
    paddingHorizontal: 16,
  },

  sectionDivider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginHorizontal: 16,
    marginVertical: 20,
  },

  variantWrapper: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  section: {
    marginTop: 28,
    paddingHorizontal: 16,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.3,
  },

  sectionSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
  },

  ratingCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    gap: 16,
    marginBottom: 14,
  },

  ratingNumberBox: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },

  ratingNumber: {
    fontSize: 32,
    fontWeight: "900",
    color: "#111827",
    letterSpacing: -0.5,
  },

  ratingMax: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9ca3af",
  },

  ratingMetaBox: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },

  stars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  star: {
    fontSize: 13,
    lineHeight: 14,
  },

  starFilled: {
    color: "#f59e0b",
  },

  starEmpty: {
    color: "#e5e7eb",
  },

  reviewCount: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6b7280",
  },

  loadingContainer: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyCard: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  emptyText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
  },

  reviewList: {
    gap: 10,
  },

  reviewCard: {
    padding: 14,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },

  reviewTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  reviewDate: {
    fontSize: 11,
    fontWeight: "500",
    color: "#9ca3af",
  },

  reviewerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },

  reviewerName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },

  verifiedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },

  verifiedText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#047857",
  },

  reviewTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 3,
  },

  reviewComment: {
    fontSize: 12,
    lineHeight: 18,
    color: "#4b5563",
  },
});