import type { Category } from "@africasuk/types";

interface CategoryJsonLdProps {
  category: Category;
}

export function CategoryJsonLd({
  category,
}: CategoryJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",

    name: category.name,

    description:
      category.description ??
      `Browse ${category.name} products on AfricaSuk.`,

    url: `https://africasuk.com/categories/${category.slug}`,

    isPartOf: {
      "@type": "WebSite",
      name: "AfricaSuk",
      url: "https://africasuk.com",
    },

    publisher: {
      "@type": "Organization",
      name: "AfricaSuk",
      url: "https://africasuk.com",
    },
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