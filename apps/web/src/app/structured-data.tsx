export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://africasuk.com/#organization",

    name: "Africa Suk",
    alternateName: "AfricaSuk",

    url: "https://africasuk.com",

    logo: "https://res.cloudinary.com/kwlkw1ta/image/upload/v1784891001/AfricaSuk_e-commerce_marketplace__202607241900_q5aayq.jpg",

    image:
      "https://res.cloudinary.com/kwlkw1ta/image/upload/v1784891001/AfricaSuk_e-commerce_marketplace__202607241900_q5aayq.jpg",

    description:
      "Africa Suk is a South Sudanese online marketplace for electronics, fashion, groceries, beauty, home, automotive, and everyday essentials.",

    email: "support@africasuk.com",

    telephone: "+211XXXXXXXXX",

    foundingLocation: {
      "@type": "Place",
      name: "Juba, South Sudan",
    },

    address: {
      "@type": "PostalAddress",
      addressLocality: "Juba",
      addressCountry: "SS",
    },

    areaServed: {
      "@type": "Country",
      name: "South Sudan",
    },

    sameAs: [
      "https://www.threads.com/@africa.suk",
      "https://x.com/africasuk",
      "https://www.instagram.com/africa.suk",
      "https://www.youtube.com/@AfricaSuk",
      "https://www.linkedin.com/company/africasuk",
      "https://www.facebook.com/AfricaSuk",
    ],
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

export function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://africasuk.com/#website",

    url: "https://africasuk.com",

    name: "Africa Suk",
    alternateName: "AfricaSuk",

    description:
      "Africa Suk is a South Sudanese online marketplace for electronics, fashion, groceries, beauty, home, automotive, and everyday essentials.",

    publisher: {
      "@id": "https://africasuk.com/#organization",
    },

    inLanguage: "en",

    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://africasuk.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
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