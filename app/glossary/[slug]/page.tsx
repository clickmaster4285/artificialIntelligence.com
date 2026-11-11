import type {
  Metadata,
} from "next";

import {
  getAdjacentGlossaryTerms,
  getAllGlossarySlugs,
  getGlossaryTermBySlug,
  getRelatedGlossaryTerms,
} from "@/content/glossary";

import { GlossaryDetailPage } from "@/content/glossary/GlossaryDetailPage";

import { companyLogoUrl } from "@/lib/company";
import { fallbackSiteUrl, pageAlternates, absoluteUrl } from "@/lib/site";
import CmsRoute, { cmsRouteMetadata } from "@/components/cms/CmsRoute";
import { getCmsPages } from "@/lib/cms/cms";
import { withEditedPageSeo } from "@/lib/cms/erp-edits";

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
 * Glossary terms are generated at build time. A new term is available
 * after the next build, which keeps these pages on the static cache.
 */
export const dynamicParams = true;

/* =========================================================
   HELPERS
========================================================= */

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

export async function generateStaticParams() {
  const knownSlugs = getAllGlossarySlugs();
  const cmsSlugs = (await getCmsPages())
    .map((page) => page.slug)
    .filter((path) => path.split("/").filter(Boolean).length === 2)
    .filter((path) => path.toLowerCase().startsWith("/glossary/"))
    .map((path) => path.split("/").filter(Boolean)[1])
    .filter((slug) => !knownSlugs.includes(slug));
  return [...new Set([...knownSlugs, ...cmsSlugs])].map((slug) => ({ slug }));
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
    return cmsRouteMetadata(`/glossary/${slug}`);
  }

  return withEditedPageSeo(`/glossary/${slug}`, {
    title: term.seo.title,

    description:
      term.seo.description,

    keywords: term.seo.keywords,

    alternates: pageAlternates(
      term.seo.canonical,
    ),

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

      images: [
        {
          url: term.seo.ogImage || "/logo.png",
          alt: term.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title: term.seo.title,

      description:
        term.seo.description,

      images: [
        term.seo.ogImage || "/logo.png",
      ],
    },
  });
}

/* =========================================================
   STRUCTURED DATA
========================================================= */

function generateGlossaryTermSchema(
  slug: string,
  siteUrl: string,
) {
  const term =
    getGlossaryTermBySlug(slug);

  if (!term) {
    return null;
  }

  const glossaryUrl = absoluteUrl("/glossary", siteUrl);

  const termUrl = absoluteUrl(term.seo.canonical, siteUrl);

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

      image: {
        "@type": "ImageObject",
        url: companyLogoUrl(siteUrl),
      },

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

        logo: {
          "@type": "ImageObject",
          url: companyLogoUrl(siteUrl),
        },
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
    return <CmsRoute path={`/glossary/${slug}`} />;
  }

  const relatedTerms =
    getRelatedGlossaryTerms(term);

  const {
    previous: previousTerm,
    next: nextTerm,
  } = getAdjacentGlossaryTerms(
    term.slug,
  );

  const siteUrl = fallbackSiteUrl();

  const schema =
    generateGlossaryTermSchema(
      term.slug,
      siteUrl,
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
