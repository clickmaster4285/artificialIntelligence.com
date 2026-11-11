import type {
  Metadata,
} from "next";

import { DynamicPageTemplate } from "@/components/dynamic-pages/DynamicPageTemplate";

import {
  getAllPublishedSlugs,
  getPublishedPageBySlug,
} from "@/lib/dynamic-pages/page-loader";

import { isDuplicateFlatCityPage } from "@/lib/duplicate-city-urls";

import {
  generateDynamicPageSchema,
  getDynamicPageUrl,
  serializeJsonLd,
} from "@/lib/dynamic-pages/page-schema";

import {
  fallbackSiteUrl,
  pageAlternates,
} from "@/lib/site";
import { getCmsPages } from "@/lib/cms/cms";
import { cmsRouteMetadata, default as CmsRoute } from "@/components/cms/CmsRoute";
import { withEditedPageSeo } from "@/lib/cms/erp-edits";

/* =========================================================
   TYPES
========================================================= */

interface DynamicPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/* =========================================================
   ROUTE CONFIGURATION
========================================================= */

/**
 * Code-owned slugs are prerendered; unknown root-level paths are checked
 * against the ERP and remain a normal 404 when no published page exists.
 */
export const dynamicParams = true;

export const revalidate = 60;

/* =========================================================
   STATIC PAGE GENERATION
========================================================= */

/**
 * Next.js creates one static page for every published slug.
 *
 * Example:
 *
 * { slug: "llm-development-company" }
 *
 * becomes:
 *
 * /llm-development-company/
 */
export async function generateStaticParams() {
  const codeOwnedRootPaths = new Set([
    "about",
    "ai-development",
    "ai-development-company",
    "careers",
    "contact",
    "cookies",
    "glossary",
    "privacy",
    "process",
    "terms",
    "work",
  ]);
  const codeSlugs = getAllPublishedSlugs()
    .filter((slug) => !isDuplicateFlatCityPage(slug))
    .map((slug) => ({ slug }));
  const codeSlugSet = new Set(codeSlugs.map(({ slug }) => slug.toLowerCase()));
  const cmsSlugs = (await getCmsPages())
    .filter((page) => page.slug.split("/").filter(Boolean).length === 1)
    .map((page) => page.slug.slice(1))
    .filter((slug) => !codeSlugSet.has(slug.toLowerCase()) && !codeOwnedRootPaths.has(slug.toLowerCase()))
    .map((slug) => ({ slug }));
  return [...codeSlugs, ...cmsSlugs];
}

/* =========================================================
   DYNAMIC SEO METADATA
========================================================= */

export async function generateMetadata({
  params,
}: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params;

  const page =
    getPublishedPageBySlug(slug);

  if (!page) {
    return cmsRouteMetadata(`/${slug}`);
  }

  const siteUrl = fallbackSiteUrl();

  const pageUrl =
    getDynamicPageUrl(page, siteUrl);

  const openGraphImages =
    page.seo.openGraphImage
      ? [
          {
            url: page.seo
              .openGraphImage,

            alt: page.hero.title,
          },
        ]
      : undefined;

  return withEditedPageSeo(`/${slug}`, {
    title: page.seo.title,

    description:
      page.seo.description,

    keywords: [
      page.seo.primaryKeyword,

      ...(page.seo
        .secondaryKeywords ?? []),
    ],

    alternates: pageAlternates(
      page.seo.canonical || `/${page.slug}/`,
    ),

    robots: {
      index:
        page.seo.noIndex !== true,

      follow:
        page.seo.noFollow !== true,

      googleBot: {
        index:
          page.seo.noIndex !== true,

        follow:
          page.seo.noFollow !== true,

        "max-image-preview":
          "large",

        "max-snippet": -1,

        "max-video-preview": -1,
      },
    },

    openGraph: {
      type: "website",

      url: pageUrl,

      siteName:
        "ClickMasters Artificial Intelligence Company",

      title: page.seo.title,

      description:
        page.seo.description,

      locale: "en_US",

      images: openGraphImages,
    },

    twitter: {
      card:
        page.seo.openGraphImage
          ? "summary_large_image"
          : "summary",

      title: page.seo.title,

      description:
        page.seo.description,

      images:
        page.seo.openGraphImage
          ? [
              page.seo
                .openGraphImage,
            ]
          : undefined,
    },

    category:
      "Artificial Intelligence",
  });
}

/* =========================================================
   PAGE COMPONENT
========================================================= */

export default async function DynamicRootPage({
  params,
}: DynamicPageProps) {
  const { slug } = await params;

  const page =
    getPublishedPageBySlug(slug);

  if (!page) {
    return <CmsRoute path={`/${slug}`} />;
  }

  const siteUrl = fallbackSiteUrl();

  const jsonLd =
    generateDynamicPageSchema(page, siteUrl);

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            serializeJsonLd(jsonLd),
        }}
      />

      {/* Template selected by JSON */}
      <DynamicPageTemplate
        page={page}
      />
    </>
  );
}