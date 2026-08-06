import type { ProductWithDetails } from "@africasuk/types";

interface Props {
  product: ProductWithDetails;
}

export function ProductJsonLd({
  product,
}: Props) {
  const firstColor = product.colors[0];
  const firstVariant = firstColor?.variants[0];

  const images = product.colors.flatMap((color) =>
    color.images.map((image) => image.imageUrl)
  );

  const jsonLd = {
    "@context": "https://schema.org",

    "@type": "Product",

    "@id": `https://africasuk.com/products/${product.slug}`,

    url: `https://africasuk.com/products/${product.slug}`,

    name: product.name,

    description:
      product.description ??
      `Buy ${product.name} online on AfricaSuk.`,

    image: images,

    sku: firstVariant?.sku ?? undefined,

    brand: product.brand
      ? {
          "@type": "Brand",
          name: product.brand.name,
        }
      : undefined,

    category: product.category?.name,

    color: firstColor?.name,

offers: product.colors.flatMap((color) =>
  color.variants.map((variant) => ({
    "@type": "Offer",

    url: `https://africasuk.com/products/${product.slug}`,

    priceCurrency: "USD",

    price: variant.price,

    sku: variant.sku ?? undefined,

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
      url: "https://africasuk.com",
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
        ? [
            "https://schema.org/Cash",
          ]
        : []),

      ...(product.allowOnlinePayment
        ? [
            "https://schema.org/PaymentCard",
          ]
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