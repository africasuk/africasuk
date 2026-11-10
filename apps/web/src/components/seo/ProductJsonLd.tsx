
import type {
  ProductWithDetails,
  Review,
} from "@africasuk/types";

interface Props {
  product: ProductWithDetails;
  reviews?: Review[];
  rating?: {
    averageRating: number;
    reviewCount: number;
  };
}

const SITE_URL = "https://africasuk.com";

export function ProductJsonLd({
  product,
  reviews = [],
  rating = {
    averageRating: 0,
    reviewCount: 0,
  },
}: Props) {
  const firstColor = product.colors[0];
  const firstVariant = firstColor?.variants[0];

  const images = product.colors
    .flatMap((color) =>
      color.images.map((image) => image.imageUrl)
    )
    .filter(Boolean);

  const productUrl = `${SITE_URL}/products/${product.slug}`;

  const description =
    product.description?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() ||
    `Discover ${product.name} on Africa Suk, South Sudan's online shopping marketplace.`;

  const validRating =
    rating.reviewCount > 0 &&
    Number.isFinite(rating.averageRating) &&
    rating.averageRating > 0 &&
    rating.averageRating <= 5;

  const validReviews = reviews.filter(
    (review) =>
      Number.isFinite(review.rating) &&
      review.rating >= 1 &&
      review.rating <= 5
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",

    "@id": `${productUrl}#product`,
    url: productUrl,

    name: product.name,
    description,
    image: images,

    ...(firstVariant?.sku && {
      sku: firstVariant.sku,
    }),

    ...(product.brand?.name && {
      brand: {
        "@type": "Brand",
        name: product.brand.name,
      },
    }),

    ...(product.category?.name && {
      category: product.category.name,
    }),

    ...(firstColor?.name && {
      color: firstColor.name,
    }),

    ...(validRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating.averageRating,
        reviewCount: rating.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),

    ...(validReviews.length > 0 && {
      review: validReviews.map((review) => ({
        "@type": "Review",

        reviewRating: {
          "@type": "Rating",
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1,
        },

        ...(review.title && {
          name: review.title,
        }),

        ...(review.comment && {
          reviewBody: review.comment,
        }),

        author: {
          "@type": "Person",
          name: review.reviewerName || "Verified Buyer",
        },

        datePublished: review.createdAt,
      })),
    }),

    offers: product.colors.flatMap((color) =>
      color.variants.map((variant) => ({
        "@type": "Offer",

        url: productUrl,

        priceCurrency: "USD",
        price: variant.price,

        ...(variant.sku && {
          sku: variant.sku,
        }),

        availability:
          variant.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",

        itemCondition:
          "https://schema.org/NewCondition",

        ...(color.name && {
          color: color.name,
        }),

        seller: {
          "@type": "Organization",
          name: "Africa Suk",
          url: SITE_URL,
        },
      }))
    ),
  };

  const safeJsonLd = JSON.stringify(jsonLd).replace(
    /</g,
    "\\u003c"
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeJsonLd,
      }}
    />
  );
}
