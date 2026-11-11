import type { MetadataRoute } from "next";

import { getPublishedGlossaryTerms } from "@/content/glossary";
import { getAllLocationPageSlugs } from "@/data/ai-development-company-pages-data";
import { getAllPageSlugs } from "@/data/ai-development-pages-data";
import { getAllPublishedPages } from "@/lib/dynamic-pages/page-loader";
import { isDuplicateFlatCityPage } from "@/lib/duplicate-city-urls";
import { getRequestSiteUrl } from "@/lib/site";
import { getCmsPages } from "@/lib/cms/cms";

const STATIC_PATHS = [
  "/",
  "/about",
  "/work",
  "/process",
  "/careers",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
  "/ai-development",
  "/ai-development-company",
  "/glossary",
];

function addPath(paths: Set<string>, path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const clean = normalized.replace(/\/+$/, "") || "/";

  if (clean.includes("..") || clean.startsWith("/api")) {
    return;
  }

  paths.add(clean);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = await getRequestSiteUrl();
  const paths = new Set<string>();

  for (const path of STATIC_PATHS) {
    addPath(paths, path);
  }

  for (const slug of getAllPageSlugs()) {
    addPath(paths, `/ai-development/${slug}`);
  }

  for (const slug of getAllLocationPageSlugs()) {
    addPath(paths, `/ai-development-company/${slug}`);
  }

  for (const page of getAllPublishedPages()) {
    if (page.seo?.noIndex) continue;
    if (isDuplicateFlatCityPage(page.slug)) continue;
    addPath(paths, `/${page.slug}`);
  }

  for (const term of getPublishedGlossaryTerms()) {
    if (term.seo?.noIndex) continue;
    addPath(paths, `/glossary/${term.slug}`);
  }

  for (const page of await getCmsPages()) {
    if (page.noindex) continue;
    addPath(paths, page.slug);
  }

  const lastModified = new Date();

  return [...paths].sort().map((path) => ({
    url: path === "/" ? siteUrl : `${siteUrl}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.6,
  }));
}
