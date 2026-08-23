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

  const images = product.colors.flatMap((color) =>
    color.images.map((image) => image.imageUrl)
  );

  const productUrl = `https://www.africasuk.com/products/${product.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",

    "@id": productUrl,
    url: productUrl,

    name: product.name,

    description:
      product.description ??
      `Buy ${product.name} online on AfricaSuk.`,

    image: images,

    ...(rating.reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating.averageRating,
        reviewCount: rating.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),

    ...(reviews.length > 0 && {
      review: reviews.map((review) => ({
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
          name: review.reviewerName ?? "Verified Buyer",
        },

        datePublished: review.createdAt,
      })),
    }),

    ...(firstVariant?.sku && {
      sku: firstVariant.sku,
    }),

    ...(product.brand && {
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

        color: color.name,

        seller: {
          "@type": "Organization",
          name: "AfricaSuk",
          url: "https://www.africasuk.com",
        },

        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          applicableCountry: "SS",
          returnPolicyCategory:
            "https://schema.org/MerchantReturnFiniteReturnWindow",
          merchantReturnDays: 7,
          returnMethod:
            "https://schema.org/ReturnByMail",
          returnFees:
            "https://schema.org/FreeReturn",
        },

        shippingDetails: {
          "@type": "OfferShippingDetails",

          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry: "SS",
          },

          shippingRate: {
            "@type": "MonetaryAmount",
            value: 0,
            currency: "USD",
          },

          deliveryTime: {
            "@type": "ShippingDeliveryTime",

            handlingTime: {
              "@type": "QuantitativeValue",
              minValue: 1,
              maxValue: 2,
              unitCode: "DAY",
            },

            transitTime: {
              "@type": "QuantitativeValue",
              minValue: 3,
              maxValue: 14,
              unitCode: "DAY",
            },
          },
        },

        acceptedPaymentMethod: [
          ...(product.allowCod
            ? ["https://schema.org/Cash"]
            : []),

          ...(product.allowOnlinePayment
            ? ["https://schema.org/PaymentCard"]
            : []),
        ],
      }))
    ),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
}