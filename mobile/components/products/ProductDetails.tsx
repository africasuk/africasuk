import { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import type {
  ProductWithDetails,
  Review,
} from "@africasuk/types";

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

function StarRating({
  rating,
}: {
  rating: number;
}) {
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
  if (loading) {
    return (
      <View style={styles.reviewsContainer}>
        <Text style={styles.reviewsTitle}>
          Customer Reviews
        </Text>

        <ActivityIndicator
          size="small"
          color="#005c2e"
        />
      </View>
    );
  }

  return (
    <View style={styles.reviewsContainer}>
      <Text style={styles.reviewsTitle}>
        Customer Reviews
      </Text>

      {/* Rating Summary */}
      <View style={styles.ratingSummary}>
        <Text style={styles.ratingNumber}>
          {Number(rating.averageRating || 0).toFixed(1)}
        </Text>

        <View>
          <StarRating
            rating={rating.averageRating}
          />

          <Text style={styles.reviewCount}>
            Based on {rating.reviewCount}{" "}
            {rating.reviewCount === 1
              ? "review"
              : "reviews"}
          </Text>
        </View>
      </View>

      {/* Reviews */}
      {reviews.length === 0 ? (
        <View style={styles.noReviews}>
          <Text style={styles.noReviewsText}>
            No reviews yet. Be the first to
            share your thoughts!
          </Text>
        </View>
      ) : (
        <View style={styles.reviewList}>
          {reviews.slice(0, 3).map((review) => (
            <View
              key={review.id}
              style={styles.review}
            >
              <View style={styles.reviewHeader}>
                <StarRating
                  rating={review.rating}
                />

                <Text style={styles.reviewDate}>
                  {new Date(
                    review.createdAt
                  )
                    .toISOString()
                    .slice(0, 10)}
                </Text>
              </View>

              <Text style={styles.reviewerName}>
                {(review as {
                  reviewerName?: string;
                }).reviewerName ??
                  "Verified Buyer"}
              </Text>

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

              {review.verifiedPurchase && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>
                    ✓ Verified Purchase
                  </Text>
                </View>
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
  const [selectedColor, setSelectedColor] =
    useState(
      product.colors?.find(
        (color) =>
          color.id === selectedColorId
      ) ?? product.colors?.[0]
    );

  const [reviews, setReviews] = useState<
    Review[]
  >([]);

  const [rating, setRating] =
    useState<Rating>({
      averageRating: 0,
      reviewCount: 0,
    });

  const [reviewsLoading, setReviewsLoading] =
    useState(true);

  // Sync selected color
  useEffect(() => {
    const targetColor =
      product.colors?.find(
        (color) =>
          color.id === selectedColorId
      ) ?? product.colors?.[0];

    setSelectedColor(targetColor);
  }, [selectedColorId, product]);

  // Fetch real product reviews
  useEffect(() => {
    let cancelled = false;

    async function fetchReviews() {
      try {
        setReviewsLoading(true);

        const response = await fetch(
          `https://africasuk.com/api/reviews?productId=${product.id}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch reviews"
          );
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

  return (
    <View style={styles.container}>
      {/* Product Gallery */}
      <View style={styles.galleryContainer}>
        <ProductGallery
          images={selectedColor?.images ?? []}
        />
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <ProductInfo product={product} />
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {product.colors &&
          product.colors.length > 0 && (
            <View style={styles.colorGroup}>
              <Text style={styles.sectionLabel}>
                Color
              </Text>

              <View
                style={
                  styles.colorPillsContainer
                }
              >
                {product.colors.map((color) => {
                  const isSelected =
                    selectedColor?.id ===
                    color.id;

                  return (
                    <Pressable
                      key={color.id}
                      onPress={() =>
                        setSelectedColor(color)
                      }
                      style={[
                        styles.colorPill,
                        isSelected
                          ? styles.selectedPill
                          : styles.unselectedPill,
                      ]}
                    >
                      <Text
                        style={[
                          styles.colorPillText,
                          isSelected
                            ? styles.selectedPillText
                            : styles.unselectedPillText,
                        ]}
                      >
                        {color.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

        {/* Variant */}
        <View style={styles.variantContainer}>
          <VariantSelector
            product={{
              ...product,
              colors: selectedColor
                ? [selectedColor]
                : [],
            }}
          />
        </View>
      </View>

      {/* Reviews */}
      <ReviewsSection
        reviews={reviews}
        rating={rating}
        loading={reviewsLoading}
      />

      {/* Related Products */}
      {(() => {
        const filteredProducts =
          relatedProducts.filter(
            (item) => item.id !== product.id
          );

        if (!filteredProducts.length) {
          return null;
        }

        return (
          <View
            style={styles.relatedContainer}
          >
            <Text style={styles.relatedTitle}>
              Recommended For You
            </Text>

            <RelatedProducts
              products={filteredProducts}
            />
          </View>
        );
      })()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    paddingTop: 60,
  },

  galleryContainer: {
    marginBottom: 20,
  },

  infoContainer: {
    marginBottom: 24,
  },

  optionsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 20,
    gap: 20,
  },

  colorGroup: {
    gap: 8,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  colorPillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  colorPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },

  selectedPill: {
    backgroundColor: "#002b15",
    borderColor: "#002b15",
  },

  unselectedPill: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
  },

  colorPillText: {
    fontSize: 13,
    fontWeight: "600",
  },

  selectedPillText: {
    color: "#ffffff",
  },

  unselectedPillText: {
    color: "#374151",
  },

  variantContainer: {
    marginTop: 4,
  },

  /* Reviews */

  reviewsContainer: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },

  reviewsTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 20,
  },

  ratingSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginBottom: 20,
  },

  ratingNumber: {
    fontSize: 38,
    fontWeight: "900",
    color: "#111827",
  },

  stars: {
    flexDirection: "row",
    alignItems: "center",
  },

  star: {
    fontSize: 16,
    marginRight: 2,
  },

  starFilled: {
    color: "#fbbf24",
  },

  starEmpty: {
    color: "#e5e7eb",
  },

  reviewCount: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 4,
  },

  noReviews: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  noReviewsText: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
  },

  reviewList: {
    gap: 0,
  },

  review: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },

  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  reviewDate: {
    fontSize: 10,
    color: "#9ca3af",
  },

  reviewerName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 5,
  },

  reviewTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 5,
  },

  reviewComment: {
    fontSize: 13,
    lineHeight: 20,
    color: "#6b7280",
  },

  verifiedBadge: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },

  verifiedText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#047857",
  },

  /* Related */

  relatedContainer: {
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 24,
  },

  relatedTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 16,
  },
});