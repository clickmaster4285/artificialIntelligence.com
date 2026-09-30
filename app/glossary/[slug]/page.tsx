import type {
  Metadata,
} from "next";

import {
  notFound,
} from "next/navigation";

import {
  getAdjacentGlossaryTerms,
  getAllGlossarySlugs,
  getGlossaryTermBySlug,
  getRelatedGlossaryTerms,
} from "@/content/glossary";

import { GlossaryDetailPage } from "@/content/glossary/GlossaryDetailPage";

import { SITE_URL } from "@/lib/site";

/* =========================================================
   TYPES
========================================================= */

interface GlossaryDetailRouteProps {
  params: Promise<{
    slug: string;
  }>;
}

/* =========================================================
   CONFIGURATION
========================================================= */

/**
 * Allows newly added glossary JSON files to resolve during development and
 * on-demand server rendering without touching this route file.
 */
export const dynamicParams = true;

/* =========================================================
   HELPERS
========================================================= */

function getSiteUrl(): string {
  return SITE_URL;
}

function serializeSchema(
  schema: object,
): string {
  return JSON.stringify(schema).replace(
    /</g,
    "\\u003c",
  );
}

/* =========================================================
   STATIC PARAMS
========================================================= */

export function generateStaticParams() {
  return getAllGlossarySlugs().map(
    (slug) => ({
      slug,
    }),
  );
}

/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata({
  params,
}: GlossaryDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;

  const term =
    getGlossaryTermBySlug(slug);

  if (!term) {
    return {
      title: "Glossary Term Not Found",
      description:
        "The requested glossary term could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: term.seo.title,

    description:
      term.seo.description,

    keywords: term.seo.keywords,

    alternates: {
      canonical:
        term.seo.canonical,
    },

    robots: term.seo.noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },

    openGraph: {
      title: term.seo.title,

      description:
        term.seo.description,

      url: term.seo.canonical,

      type: "article",

      publishedTime:
        term.publishedAt,

      modifiedTime:
        term.updatedAt,

      images: term.seo.ogImage
        ? [
            {
              url: term.seo
                .ogImage,
            },
          ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",

      title: term.seo.title,

      description:
        term.seo.description,

      images: term.seo.ogImage
        ? [
            term.seo.ogImage,
          ]
        : undefined,
    },
  };
}

/* =========================================================
   STRUCTURED DATA
========================================================= */

function generateGlossaryTermSchema(
  slug: string,
) {
  const term =
    getGlossaryTermBySlug(slug);

  if (!term) {
    return null;
  }

  const siteUrl = getSiteUrl();

  const glossaryUrl =
    `${siteUrl}/glossary/`;

  const termUrl =
    `${siteUrl}${term.seo.canonical}`;

  const graph: Record<
    string,
    unknown
  >[] = [
    {
      "@type": "DefinedTerm",

      "@id": `${termUrl}#term`,

      name: term.title,

      alternateName: [
        term.shortTitle,
        term.abbreviation,
        ...(term.aliases ?? []),
      ].filter(Boolean),

      description: term.definition,

      url: termUrl,

      inDefinedTermSet: {
        "@type": "DefinedTermSet",

        "@id": `${glossaryUrl}#glossary`,

        name:
          "Artificial Intelligence Glossary",

        url: glossaryUrl,
      },
    },

    {
      "@type": "TechArticle",

      "@id": `${termUrl}#article`,

      headline: term.title,

      description:
        term.seo.description,

      url: termUrl,

      mainEntityOfPage: {
        "@type": "WebPage",

        "@id": termUrl,
      },

      about: {
        "@id": `${termUrl}#term`,
      },

      articleSection:
        term.category,

      datePublished:
        term.publishedAt,

      dateModified:
        term.updatedAt ??
        term.publishedAt,

      inLanguage: "en",

      author: {
        "@type": "Organization",

        name: "ClickMasters",

        url: siteUrl,
      },

      publisher: {
        "@type": "Organization",

        name: "ClickMasters",

        url: siteUrl,
      },
    },

    {
      "@type":
        "BreadcrumbList",

      "@id": `${termUrl}#breadcrumb`,

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

          name: "AI Glossary",

          item: glossaryUrl,
        },

        {
          "@type": "ListItem",

          position: 3,

          name: term.title,

          item: termUrl,
        },
      ],
    },
  ];

  if (
    term.faqs &&
    term.faqs.items.length > 0
  ) {
    graph.push({
      "@type": "FAQPage",

      "@id": `${termUrl}#faq`,

      mainEntity:
        term.faqs.items.map(
          (faqItem) => ({
            "@type":
              "Question",

            name: faqItem.question,

            acceptedAnswer: {
              "@type":
                "Answer",

              text: faqItem.answer,
            },
          }),
        ),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/* =========================================================
   PAGE
========================================================= */

export default async function GlossaryDetailRoute({
  params,
}: GlossaryDetailRouteProps) {
  const { slug } = await params;

  const term =
    getGlossaryTermBySlug(slug);

  if (!term) {
    notFound();
  }

  const relatedTerms =
    getRelatedGlossaryTerms(term);

  const {
    previous: previousTerm,
    next: nextTerm,
  } = getAdjacentGlossaryTerms(
    term.slug,
  );

  const schema =
    generateGlossaryTermSchema(
      term.slug,
    );

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              serializeSchema(
                schema,
              ),
          }}
        />
      )}

      <GlossaryDetailPage
        term={term}
        relatedTerms={
          relatedTerms
        }
        previousTerm={
          previousTerm
        }
        nextTerm={nextTerm}
      />
    </>
  );
}
