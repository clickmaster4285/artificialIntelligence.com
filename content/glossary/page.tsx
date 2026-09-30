import type {
  Metadata,
} from "next";

import {
  glossaryLandingConfig,
} from "@/content/glossary/glossary-config";

import {
  getFeaturedGlossaryTerms,
  getPublishedGlossaryTerms,
} from "@/content/glossary";

import {
  convertTermsToCards,
  getActiveGlossaryLetters,
  getGlossaryCategoryCounts,
  normalizeLetter,
  normalizePageNumber,
  queryGlossaryTerms,
} from "@/lib/glossary/glossary-filter";

import {
  isGlossaryCategory,
  type GlossaryCategory,
} from "@/types/glossary";

import { GlossaryHero } from "@/content/glossary/GlossaryHero";
import { GlossaryExplorer } from "@/content/glossary/GlossaryExplorer";

import { SITE_URL } from "@/lib/site";

/* =========================================================
   TYPES
========================================================= */

interface GlossaryPageProps {
  searchParams: Promise<{
    search?: string | string[];
    letter?: string | string[];
    category?: string | string[];
    page?: string | string[];
  }>;
}

/* =========================================================
   HELPERS
========================================================= */

function getFirstSearchParam(
  value?: string | string[],
): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

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
   METADATA
========================================================= */

export const metadata: Metadata = {
  title:
    glossaryLandingConfig.seo.title,

  description:
    glossaryLandingConfig.seo
      .description,

  keywords:
    glossaryLandingConfig.seo
      .keywords,

  alternates: {
    canonical:
      glossaryLandingConfig.seo
        .canonical,
  },

  openGraph: {
    title:
      glossaryLandingConfig.seo
        .title,

    description:
      glossaryLandingConfig.seo
        .description,

    url: glossaryLandingConfig.seo
      .canonical,

    type: "website",

    images:
      glossaryLandingConfig.seo
        .ogImage
        ? [
            {
              url: glossaryLandingConfig
                .seo.ogImage,
            },
          ]
        : undefined,
  },

  twitter: {
    card: "summary_large_image",

    title:
      glossaryLandingConfig.seo
        .title,

    description:
      glossaryLandingConfig.seo
        .description,

    images:
      glossaryLandingConfig.seo
        .ogImage
        ? [
            glossaryLandingConfig.seo
              .ogImage,
          ]
        : undefined,
  },
};

/* =========================================================
   PAGE
========================================================= */

export default async function GlossaryPage({
  searchParams,
}: GlossaryPageProps) {
  const resolvedSearchParams =
    await searchParams;

  const searchQuery =
    getFirstSearchParam(
      resolvedSearchParams.search,
    ).trim();

  const activeLetter =
    normalizeLetter(
      getFirstSearchParam(
        resolvedSearchParams.letter,
      ),
    );

  const requestedCategory =
    getFirstSearchParam(
      resolvedSearchParams.category,
    ).trim();

  const activeCategory:
    | GlossaryCategory
    | "All" =
    isGlossaryCategory(
      requestedCategory,
    )
      ? requestedCategory
      : "All";

  const requestedPage =
    normalizePageNumber(
      getFirstSearchParam(
        resolvedSearchParams.page,
      ),
    );

  /* ---------------------------------------------------------
     FILTER AND PAGINATE TERMS
  --------------------------------------------------------- */

  const publishedGlossaryTerms =
    getPublishedGlossaryTerms();

  const glossaryResults =
    queryGlossaryTerms({
      terms:
        publishedGlossaryTerms,

      filters: {
        search: searchQuery,
        letter: activeLetter,
        category:
          activeCategory,
      },

      page: requestedPage,

      itemsPerPage:
        glossaryLandingConfig
          .termsPerPage,
    });

  const glossaryCards =
    convertTermsToCards(
      glossaryResults.terms,
    );

  const featuredTerms =
    getFeaturedGlossaryTerms();

  const activeLetters =
    getActiveGlossaryLetters(
      publishedGlossaryTerms,
    );

  const categoryCounts =
    getGlossaryCategoryCounts(
      publishedGlossaryTerms,
    );

  const totalCategories =
    categoryCounts.filter(
      (category) =>
        category.category !== "All",
    ).length;

  /* ---------------------------------------------------------
     STRUCTURED DATA
  --------------------------------------------------------- */

  const siteUrl = getSiteUrl();

  const canonicalUrl = `${siteUrl}${glossaryLandingConfig.seo.canonical}`;

  const schema = {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type":
          "CollectionPage",

        "@id": `${canonicalUrl}#collection`,

        url: canonicalUrl,

        name: glossaryLandingConfig.seo
          .title,

        description:
          glossaryLandingConfig.seo
            .description,

        inLanguage: "en",

        mainEntity: {
          "@type":
            "DefinedTermSet",

          "@id": `${canonicalUrl}#glossary`,

          name: "Artificial Intelligence Glossary",

          description:
            glossaryLandingConfig.seo
              .description,

          hasDefinedTerm:
            publishedGlossaryTerms.map(
              (term) => ({
                "@type":
                  "DefinedTerm",

                name: term.title,

                description:
                  term.shortDefinition,

                url: `${siteUrl}/glossary/${term.slug}/`,

                inDefinedTermSet: `${canonicalUrl}#glossary`,
              }),
            ),
        },
      },

      {
        "@type":
          "BreadcrumbList",

        "@id": `${canonicalUrl}#breadcrumb`,

        itemListElement: [
          {
            "@type":
              "ListItem",

            position: 1,

            name: "Home",

            item: siteUrl,
          },
          {
            "@type":
              "ListItem",

            position: 2,

            name: "AI Glossary",

            item: canonicalUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            serializeSchema(schema),
        }}
      />

      <div
        className="min-h-screen bg-[#030305] text-white"
      >
        <GlossaryHero
          hero={
            glossaryLandingConfig.hero
          }
          totalTerms={
            publishedGlossaryTerms.length
          }
          totalCategories={
            totalCategories
          }
        />

        <GlossaryExplorer
          terms={glossaryCards}
          featuredTerms={
            featuredTerms
          }
          pagination={
            glossaryResults.pagination
          }
          activeLetters={
            activeLetters
          }
          categories={
            categoryCounts
          }
          searchQuery={searchQuery}
          activeLetter={activeLetter}
          activeCategory={
            activeCategory
          }
          featuredTitle={
            glossaryLandingConfig
              .featuredTitle
          }
          allTermsTitle={
            glossaryLandingConfig
              .allTermsTitle
          }
        />
      </div>
    </>
  );
}
