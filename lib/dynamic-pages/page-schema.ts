import type {
  DynamicPageData,
  FaqItem,
} from "@/types/dynamic-page";
import { SITE_URL } from "@/lib/site";

/* =========================================================
   CONFIGURATION
========================================================= */

const organizationId =
  `${SITE_URL}/#organization`;

const websiteId =
  `${SITE_URL}/#website`;

/* =========================================================
   TYPES
========================================================= */

type SchemaObject = Record<
  string,
  unknown
>;

export interface DynamicPageJsonLd {
  "@context": "https://schema.org";
  "@graph": SchemaObject[];
}

/* =========================================================
   URL HELPERS
========================================================= */

export function createAbsoluteUrl(
  path: string,
): string {
  if (
    path.startsWith("https://") ||
    path.startsWith("http://")
  ) {
    return path;
  }

  const normalizedPath =
    path.startsWith("/")
      ? path
      : `/${path}`;

  return `${SITE_URL}${normalizedPath}`;
}

export function getDynamicPageUrl(
  page: DynamicPageData,
): string {
  return createAbsoluteUrl(
    page.seo.canonical ||
      `/${page.slug}/`,
  );
}

/* =========================================================
   FAQ EXTRACTION
========================================================= */

/**
 * A page can contain multiple FAQ sections.
 * All enabled FAQ sections are combined.
 */
export function extractPageFaqs(
  page: DynamicPageData,
): FaqItem[] {
  return page.sections.flatMap(
    (section) => {
      if (
        section.type === "faq" &&
        section.enabled !== false
      ) {
        return section.items;
      }

      return [];
    },
  );
}

/* =========================================================
   ORGANIZATION SCHEMA
========================================================= */

function createOrganizationSchema():
  SchemaObject {
  return {
    "@type": "Organization",
    "@id": organizationId,

    name: "ClickMasters Artificial Intelligence Company",

    alternateName:
      "ClickMasters AI",

    url: SITE_URL,

    email:
      "hello@clickmastersartificialintelligencecompany.com",

    description:
      "ClickMasters builds production-grade artificial intelligence, machine learning, generative AI and large language model systems.",

    logo: {
      "@type": "ImageObject",

      url: createAbsoluteUrl(
        "/images/logo.png",
      ),
    },

    contactPoint: {
      "@type": "ContactPoint",

      contactType:
        "sales and technical consultation",

      email:
        "hello@clickmastersartificialintelligencecompany.com",

      availableLanguage: [
        "English",
      ],
    },
  };
}

/* =========================================================
   WEBSITE SCHEMA
========================================================= */

function createWebsiteSchema():
  SchemaObject {
  return {
    "@type": "WebSite",
    "@id": websiteId,

    name:
      "ClickMasters Artificial Intelligence Company",

    alternateName:
      "ClickMasters AI",

    url: SITE_URL,

    publisher: {
      "@id": organizationId,
    },

    inLanguage: "en-US",
  };
}

/* =========================================================
   SERVICE SCHEMA
========================================================= */

function createServiceSchema(
  page: DynamicPageData,
): SchemaObject {
  const pageUrl =
    getDynamicPageUrl(page);

  return {
    "@type": "Service",

    "@id": `${pageUrl}#service`,

    name: page.hero.title,

    description:
      page.seo.description,

    url: pageUrl,

    serviceType:
      page.seo.primaryKeyword,

    provider: {
      "@id": organizationId,
    },

    areaServed: {
      "@type": "Country",
      name: "United States",
    },

    availableChannel: {
      "@type":
        "ServiceChannel",

      serviceUrl: pageUrl,

      availableLanguage: {
        "@type": "Language",
        name: "English",
      },
    },

    keywords: [
      page.seo.primaryKeyword,
      ...(page.seo
        .secondaryKeywords ?? []),
    ].join(", "),

    mainEntityOfPage: {
      "@type": "WebPage",

      "@id": `${pageUrl}#webpage`,
    },
  };
}

/* =========================================================
   WEBPAGE SCHEMA
========================================================= */

function createWebPageSchema(
  page: DynamicPageData,
): SchemaObject {
  const pageUrl =
    getDynamicPageUrl(page);

  return {
    "@type": "WebPage",

    "@id": `${pageUrl}#webpage`,

    url: pageUrl,

    name: page.seo.title,

    description:
      page.seo.description,

    isPartOf: {
      "@id": websiteId,
    },

    about: {
      "@id": `${pageUrl}#service`,
    },

    breadcrumb: {
      "@id": `${pageUrl}#breadcrumbs`,
    },

    primaryImageOfPage:
      page.seo.openGraphImage
        ? {
            "@type":
              "ImageObject",

            url: createAbsoluteUrl(
              page.seo.openGraphImage,
            ),
          }
        : undefined,

    inLanguage: "en-US",
  };
}

/* =========================================================
   BREADCRUMB SCHEMA
========================================================= */

function createBreadcrumbSchema(
  page: DynamicPageData,
): SchemaObject {
  const pageUrl =
    getDynamicPageUrl(page);

  return {
    "@type": "BreadcrumbList",

    "@id": `${pageUrl}#breadcrumbs`,

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },

      {
        "@type": "ListItem",
        position: 2,
        name: page.hero.title,
        item: pageUrl,
      },
    ],
  };
}

/* =========================================================
   FAQ SCHEMA
========================================================= */

function createFaqSchema(
  page: DynamicPageData,
  faqs: FaqItem[],
): SchemaObject {
  const pageUrl =
    getDynamicPageUrl(page);

  return {
    "@type": "FAQPage",

    "@id": `${pageUrl}#faqs`,

    url: pageUrl,

    mainEntity: faqs.map(
      (faq) => ({
        "@type": "Question",

        name: faq.question,

        acceptedAnswer: {
          "@type": "Answer",

          text: faq.answer,
        },
      }),
    ),
  };
}

/* =========================================================
   COMPLETE GRAPH GENERATOR
========================================================= */

export function generateDynamicPageSchema(
  page: DynamicPageData,
): DynamicPageJsonLd {
  const graph: SchemaObject[] = [];

  const schemaSettings =
    page.schema ?? {};

  /*
   * Organization and Website are enabled by default.
   */
  if (
    schemaSettings.organization !==
    false
  ) {
    graph.push(
      createOrganizationSchema(),
    );

    graph.push(
      createWebsiteSchema(),
    );
  }

  /*
   * Service is enabled by default.
   */
  if (schemaSettings.service !== false) {
    graph.push(
      createServiceSchema(page),
    );
  }

  graph.push(
    createWebPageSchema(page),
  );

  /*
   * Breadcrumbs are enabled by default.
   */
  if (
    schemaSettings.breadcrumbs !==
    false
  ) {
    graph.push(
      createBreadcrumbSchema(page),
    );
  }

  const faqs =
    extractPageFaqs(page);

  /*
   * FAQ schema is added only if:
   *
   * 1. FAQ schema is not disabled.
   * 2. At least one enabled FAQ exists.
   */
  if (
    schemaSettings.faq !== false &&
    faqs.length > 0
  ) {
    graph.push(
      createFaqSchema(page, faqs),
    );
  }

  return {
    "@context":
      "https://schema.org",

    "@graph": graph,
  };
}

/* =========================================================
   SAFE SERIALIZATION
========================================================= */

/**
 * JSON.stringify alone does not neutralize "<".
 * Replacing it prevents JSON-LD content from closing
 * the script element unexpectedly.
 */
export function serializeJsonLd(
  value: DynamicPageJsonLd,
): string {
  return JSON.stringify(
    value,
  ).replace(
    /</g,
    "\\u003c",
  );
}