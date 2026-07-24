interface BrandJsonLdProps {
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  website?: string | null;
}

export function BrandJsonLd({
  name,
  slug,
  description,
  logo,
  website,
}: BrandJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",

    "@type": "Brand",

    "@id": `https://africasuk.com/brands/${slug}`,

    url: `https://africasuk.com/brands/${slug}`,

    name,

    description:
      description ??
      `Browse ${name} products on AfricaSuk.`,

    logo: logo ?? undefined,

    sameAs: website
      ? [website]
      : undefined,
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