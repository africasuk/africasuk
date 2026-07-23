import type { Locale } from "./locales";

export interface Dictionary {
  common: {
    home: string;
    categories: string;
    brands: string;
    products: string;
    search: string;
    login: string;
    logout: string;
    createAccount: string;
    myAccount: string;
    language: string;
    currency: string;
    viewAll: string;
    loading: string;
    copyright: string;
    logoAlt: string;
    brandName: string;
  };

  home: {
    heroTitle: string;
    heroSubtitle: string;
    shopByCategory: string;
    shopByCategoryDescription: string;
    featuredProducts: string;
    featuredProductsDescription: string;
    popularBrands: string;
    popularBrandsDescription: string;
    flashDeals: string;
    flashDealsDescription: string;
  };

  category: {
    products: string;
    exploreProducts: string;
    noProducts: string;
  };

  brand: {
    visitWebsite: string;
    noProducts: string;
  };

  product: {
    addToCart: string;
    buyNow: string;
    outOfStock: string;
    inStock: string;
  };

  auth: {
    welcomeBack: string;
    signInSubtitle: string;
    continueWithGoogle: string;
    or: string;
    emailAddress: string;
    password: string;
    forgotPassword: string;
    signingIn: string;
    login: string;
    noAccount: string;
    createAccount: string;
    welcomeBackToast: string;
    forgotPasswordTitle: string;
    forgotPasswordDescription: string;
    sendResetLink: string;
    sendingLink: string;
    backToLogin: string;
    emailSent: string;
    resetPasswordTitle: string;
    resetPasswordDescription: string;
    newPassword: string;
    confirmPassword: string;
    updatePassword: string;
    updatingPassword: string;
    passwordsDoNotMatch: string;
    passwordMinLength: string;
    passwordUpdated: string;
    signupTitle: string;
    signupSubtitle: string;
    fullName: string;
    creatingAccount: string;
    alreadyHaveAccount: string;
    welcomeToAfricaSuk: string;
  };

  navigation: {
    orders: string;
    wishlist: string;
    cart: string;
  };

  privacyPolicy: {
    title: string;
    lastUpdated: string;
    introduction: string[];
    generatorAttribution: {
      text: string;
      url: string;
    };
    interpretationAndDefinitions: {
      title: string;
      interpretation: {
        title: string;
        text: string;
      };
      definitions: {
        title: string;
        items: Record<string, string>;
      };
    };
    collectingAndUsingData: {
      title: string;
      typesOfDataCollected: {
        title: string;
        personalData: {
          title: string;
          description: string;
          items: string[];
        };
        usageData: {
          title: string;
          description: string;
          details: string[];
        };
        trackingTechnologies: {
          title: string;
          description: string;
          types: Record<string, string>;
          summary?: string;
          consentNotice: string;
          cookieList: Array<{
            name: string;
            type: string;
            administeredBy: string;
            purpose: string;
          }>;
        };
      };
      useOfPersonalData: {
        title: string;
        purposes: Record<string, string>;
        sharingSituations: Record<string, string>;
      };
      retention: {
        title: string;
        generalPolicy: string;
        categories: Record<string, Record<string, string>>;
        extendedRetentionReasons: string[];
        deletionProcedures: Record<string, string>;
      };
      transferOfData: {
        title: string;
        text: string;
      };
      deleteRequest: {
        title: string;
        text: string;
      };
      disclosure: {
        title: string;
        businessTransactions: string;
        lawEnforcement: string;
        otherRequirements: string[];
      };
      security: {
        title: string;
        text: string;
      };
    };
    detailedProcessing: {
      title: string;
      description: string;
      services: Record<
        string,
        {
          description: string;
          policyUrl: string;
        }
      >;
    };
    childrensPrivacy: {
      title: string;
      text: string;
    };
    changesToPolicy: {
      title: string;
      text: string;
    };
    contactUs: {
      title: string;
      description: string;
      methods: {
        website: string;
      };
    };
    visitWebsitePage: string;
  };
}

export interface I18nConfig {
  locale: Locale;
  dictionary: Dictionary;
  direction: "ltr" | "rtl";
}