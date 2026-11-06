import "server-only";

import { getAllLocationPageData } from "@/data/ai-development-company-pages-data";
import { getAllPageData } from "@/data/ai-development-pages-data";
import { getAllPublishedPages } from "@/lib/dynamic-pages/page-loader";
import {
  isDuplicateFlatCityPage,
  nestedCityPath,
} from "@/lib/duplicate-city-urls";
import type { DynamicPageData } from "@/types/dynamic-page";

export type ContextLink = {
  href?: string;
  label: string;
};

const FLAT_ONLY_CITIES = [
  "charlotte",
  "columbus",
  "indianapolis",
  "kansas-city",
  "new-jersey",
  "orlando",
  "pittsburgh",
];

function cleanPath(path: string) {
  const withoutQuery = path.split("?")[0] ?? path;
  const withSlash = withoutQuery.startsWith("/")
    ? withoutQuery
    : `/${withoutQuery}`;
  return withSlash.replace(/\/+$/, "") || "/";
}

function shortLabel(value: string) {
  return value.split("|")[0]?.split("—")[0]?.trim() || value;
}

function cityLabel(value: string) {
  return shortLabel(value).replace(/^AI Development Company in\s+/i, "");
}

let catalogCache: Map<string, string> | null = null;

function catalog() {
  if (catalogCache) return catalogCache;

  const paths = new Map<string, string>();
  paths.set("/ai-development", "AI development services");
  paths.set("/ai-development-company", "AI development company");
  paths.set("/glossary", "AI glossary");
  paths.set("/contact", "Contact");
  paths.set("/about", "About");
  paths.set("/work", "Work");
  paths.set("/process", "Process");

  for (const { slug, data } of getAllPageData()) {
    paths.set(`/ai-development/${slug}`, shortLabel(data.meta.title));
  }

  for (const { slug, data } of getAllLocationPageData()) {
    paths.set(nestedCityPath(slug), cityLabel(data.h1));
  }

  for (const city of FLAT_ONLY_CITIES) {
    paths.set(
      `/ai-development-company-${city}`,
      `AI development company in ${city.replace(/-/g, " ")}`,
    );
  }

  for (const page of getAllPublishedPages()) {
    if (isDuplicateFlatCityPage(page.slug)) continue;
    const href = cleanPath(`/${page.slug}`);
    if (!paths.has(href)) {
      paths.set(href, shortLabel(page.seo.title));
    }
  }

  catalogCache = paths;
  return paths;
}

function knownLink(href: string): ContextLink | null {
  const path = cleanPath(href);
  const label = catalog().get(path);
  if (!label) return null;
  return { href: path, label };
}

function uniqueLinks(links: Array<ContextLink | null>, currentPath: string) {
  const seen = new Set<string>();
  const current = cleanPath(currentPath);
  const result: ContextLink[] = [];

  for (const link of links) {
    if (!link?.href) continue;
    const href = cleanPath(link.href);
    if (href === current || seen.has(href)) continue;
    seen.add(href);
    result.push({ href, label: link.label });
    if (result.length >= 8) break;
  }

  return result;
}

function cityFromSlug(slug: string) {
  const cities = [
    ...getAllLocationPageData().map((entry) => entry.slug),
    ...FLAT_ONLY_CITIES,
  ].sort((left, right) => right.length - left.length);

  return cities.find(
    (city) => slug === city || slug.endsWith(`-${city}`),
  );
}

function cityHref(city: string) {
  if (catalog().has(nestedCityPath(city))) {
    return nestedCityPath(city);
  }

  const flat = `/ai-development-company-${city}`;
  return catalog().has(flat) ? flat : null;
}

export function locationBreadcrumbs(cityName: string): ContextLink[] {
  return [
    { href: "/", label: "Home" },
    { href: "/ai-development-company", label: "AI Development Company" },
    { label: cityName },
  ];
}

export function locationRelatedLinks(
  slug: string,
  internalLinks: string[],
) {
  const cities = getAllLocationPageData();
  const index = cities.findIndex((entry) => entry.slug === slug);
  const siblings = [1, 2, 3, 4]
    .map((offset) => cities[(index + offset) % cities.length])
    .filter(Boolean)
    .map((entry) => knownLink(nestedCityPath(entry.slug)));

  return uniqueLinks(
    [
      knownLink("/ai-development"),
      knownLink("/glossary"),
      knownLink("/contact"),
      ...internalLinks.map((href) => knownLink(href)),
      ...siblings,
    ],
    nestedCityPath(slug),
  );
}

export function serviceBreadcrumbs(title: string): ContextLink[] {
  return [
    { href: "/", label: "Home" },
    { href: "/ai-development", label: "AI Development" },
    { label: shortLabel(title) },
  ];
}

export function serviceRelatedLinks(slug: string, internalLinks: string[]) {
  const pages = getAllPageData();
  const index = pages.findIndex((entry) => entry.slug === slug);
  const siblings = [1, 2, 3]
    .map((offset) => pages[(index + offset) % pages.length])
    .filter(Boolean)
    .map((entry) => knownLink(`/ai-development/${entry.slug}`));

  return uniqueLinks(
    [
      knownLink("/ai-development-company"),
      knownLink("/glossary"),
      knownLink("/contact"),
      ...internalLinks.map((href) => knownLink(href)),
      ...siblings,
    ],
    `/ai-development/${slug}`,
  );
}

export function dynamicBreadcrumbs(page: DynamicPageData): ContextLink[] {
  const city = cityFromSlug(page.slug);
  const cityPath = city ? cityHref(city) : null;
  const items: ContextLink[] = [{ href: "/", label: "Home" }];

  if (cityPath) {
    items.push({
      href: "/ai-development-company",
      label: "AI Development Company",
    });
    const label = catalog().get(cityPath);
    if (label) items.push({ href: cityPath, label });
  } else {
    items.push({ href: "/ai-development", label: "AI Development" });
  }

  items.push({ label: shortLabel(page.hero.title || page.seo.title) });
  return items;
}

export function dynamicRelatedLinks(page: DynamicPageData) {
  const declared = (page.relatedPages ?? []).map((related) => {
    const known = knownLink(related.href);
    return known ? { ...known, label: related.title || known.label } : null;
  });

  const city = cityFromSlug(page.slug);
  const cityPath = city ? cityHref(city) : null;
  const published = getAllPublishedPages().filter(
    (entry) => !isDuplicateFlatCityPage(entry.slug),
  );
  const sameGroup = published.filter((entry) => {
    if (entry.slug === page.slug) return false;
    if (page.slug.endsWith("-cost")) return entry.slug.endsWith("-cost");
    if (city) return entry.slug.endsWith(`-${city}`);
    return false;
  });

  return uniqueLinks(
    [
      ...declared,
      cityPath ? knownLink(cityPath) : null,
      knownLink("/ai-development"),
      knownLink("/ai-development-company"),
      knownLink("/glossary"),
      ...sameGroup.slice(0, 4).map((entry) => knownLink(`/${entry.slug}`)),
    ],
    `/${page.slug}`,
  );
}
