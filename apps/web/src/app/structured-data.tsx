export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",

    "@id": "https://africasuk.com/#organization",

    name: "AfricaSuk",

    alternateName: "AfricaSuk Marketplace",

    url: "https://africasuk.com",

    logo: "https://res.cloudinary.com/kwlkw1ta/image/upload/v1784891001/AfricaSuk_e-commerce_marketplace__202607241900_q5aayq.jpg",

    image:
      "https://res.cloudinary.com/kwlkw1ta/image/upload/v1784891001/AfricaSuk_e-commerce_marketplace__202607241900_q5aayq.jpg",

    description:
      "AfricaSuk is South Sudan's trusted online marketplace connecting buyers with trusted sellers across electronics, fashion, groceries, beauty, home, automotive, and everyday essentials.",

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
      "https://facebook.com/AfricaSuk",
      "https://instagram.com/AfricaSuk",
      "https://linkedin.com/company/africasuk",
      "https://x.com/AfricaSuk",
      "https://youtube.com/@AfricaSuk",
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

    name: "AfricaSuk",

    alternateName: "AfricaSuk Marketplace",

    description:
      "South Sudan's trusted online marketplace for electronics, fashion, groceries, beauty, home, automotive, and everyday essentials.",

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