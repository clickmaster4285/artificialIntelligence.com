import type {
  DynamicPageData,
  FaqItem,
} from "@/types/dynamic-page";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from "@/lib/schema";
import {
  absoluteUrl,
  fallbackSiteUrl,
  localeForSite,
} from "@/lib/site";

function organizationIdFor(siteUrl: string) {
  return `${siteUrl}/#organization`;
}

function websiteIdFor(siteUrl: string) {
  return `${siteUrl}/#website`;
}

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

const OWNED_HOSTS = new Set([
  "clickmastersartificialintelligencecompany.com",
  "clickmastersartificialintelligencecompany.co.uk",
  "clickmasterssoftwaredevelopmentcompany.co.uk",
]);

export function createAbsoluteUrl(
  path: string,
  siteUrl: string = fallbackSiteUrl(),
): string {
  if (
    path.startsWith("https://") ||
    path.startsWith("http://")
  ) {
    try {
      const url = new URL(path);
      const host = url.hostname.replace(/^www\./, "");
      const owned =
        OWNED_HOSTS.has(host) ||
        host.endsWith(
          ".clickmasterssoftwaredevelopmentcompany.co.uk",
        );

      if (!owned) {
        return path;
      }

      return absoluteUrl(url.pathname, siteUrl);
    } catch {
      return path;
    }
  }

  return absoluteUrl(path, siteUrl);
}

export function getDynamicPageUrl(
  page: DynamicPageData,
  siteUrl: string = fallbackSiteUrl(),
): string {
  return createAbsoluteUrl(
    page.seo.canonical ||
      `/${page.slug}/`,
    siteUrl,
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

function createOrganizationSchema(
  siteUrl: string = fallbackSiteUrl(),
):
  SchemaObject {
  const { "@context": context, ...node } =
    generateOrganizationSchema(siteUrl);

  void context;

  return node;
}

/* =========================================================
   WEBSITE SCHEMA
========================================================= */

function createWebsiteSchema(
  siteUrl: string = fallbackSiteUrl(),
):
  SchemaObject {
  const { "@context": context, ...node } =
    generateWebSiteSchema(siteUrl);

  void context;

  return node;
}

/* =========================================================
   SERVICE SCHEMA
========================================================= */

function createServiceSchema(
  page: DynamicPageData,
  siteUrl: string = fallbackSiteUrl(),
): SchemaObject {
  const pageUrl =
    getDynamicPageUrl(page, siteUrl);

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
      "@id": organizationIdFor(siteUrl),
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
  siteUrl: string = fallbackSiteUrl(),
): SchemaObject {
  const pageUrl =
    getDynamicPageUrl(page, siteUrl);

  return {
    "@type": "WebPage",

    "@id": `${pageUrl}#webpage`,

    url: pageUrl,

    name: page.seo.title,

    description:
      page.seo.description,

    isPartOf: {
      "@id": websiteIdFor(siteUrl),
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
              siteUrl,
            ),
          }
        : undefined,

    inLanguage: localeForSite(siteUrl),
  };
}

/* =========================================================
   BREADCRUMB SCHEMA
========================================================= */

function createBreadcrumbSchema(
  page: DynamicPageData,
  siteUrl: string = fallbackSiteUrl(),
): SchemaObject {
  const pageUrl =
    getDynamicPageUrl(page, siteUrl);

  return {
    "@type": "BreadcrumbList",

    "@id": `${pageUrl}#breadcrumbs`,

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
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
  siteUrl: string = fallbackSiteUrl(),
): SchemaObject {
  const pageUrl =
    getDynamicPageUrl(page, siteUrl);

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
  siteUrl: string = fallbackSiteUrl(),
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
      createOrganizationSchema(siteUrl),
    );

    graph.push(
      createWebsiteSchema(siteUrl),
    );
  }

  /*
   * Service is enabled by default.
   */
  if (schemaSettings.service !== false) {
    graph.push(
      createServiceSchema(page, siteUrl),
    );
  }

  graph.push(
    createWebPageSchema(page, siteUrl),
  );

  /*
   * Breadcrumbs are enabled by default.
   */
  if (
    schemaSettings.breadcrumbs !==
    false
  ) {
    graph.push(
      createBreadcrumbSchema(page, siteUrl),
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
      createFaqSchema(page, faqs, siteUrl),
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