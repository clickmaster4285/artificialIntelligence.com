import "server-only";

import type { Metadata } from "next";
import { pageAlternates } from "@/lib/site";

const CMS_API_URL = process.env.CMS_API_URL?.replace(/\/+$/, "");
const CMS_SITE_DOMAIN = process.env.CMS_SITE_DOMAIN?.trim();
const CMS_REVALIDATE_SECONDS = 60;
const CMS_TIMEOUT_MS = 4000;

export type CmsSection = {
  id: string;
  type: string;
  order: number;
  content: Record<string, unknown>;
  styles: Record<string, unknown>;
  responsive: Record<string, unknown>;
  settings: Record<string, unknown>;
};

export type CmsSeo = {
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  robots: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  focusKeyword: string;
  twitterHandle: string;
};

export type CmsPostSummary = {
  title: string;
  url: string;
  pageType: string;
  excerpt: string;
  image: string;
  publishedAt: string;
};

export type CmsPage = {
  title: string;
  slug: string;
  pageType: string;
  featuredImage: string;
  sections: CmsSection[];
  seo: CmsSeo;
  noindex: boolean;
  designColors: CmsColors;
  posts: CmsPostSummary[];
  customCode: { css: string; html: string };
};

export type CmsNavigationItem = {
  id: string;
  label: string;
  url: string;
  target: string;
  children: CmsNavigationItem[];
};

export type CmsColors = {
  primary?: string;
  secondary?: string;
};

export type CmsSiteConfig = {
  website: {
    name: string;
    domain: string;
    logo: string;
    favicon: string;
  };
  colors: CmsColors;
  navigation: {
    header: CmsNavigationItem[];
    footer: CmsNavigationItem[];
  };
};

export type CmsPageSummary = {
  title: string;
  slug: string;
  pageType: string;
  publishedAt: string;
  noindex: boolean;
};

const isDev = process.env.NODE_ENV !== "production";
const warn = (...args: unknown[]) => {
  if (isDev) console.warn("[cms]", ...args);
};

const str = (value: unknown) => (typeof value === "string" ? value : "");
const obj = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

function isConfigured() {
  return Boolean(CMS_API_URL && CMS_SITE_DOMAIN);
}

function apiBase() {
  if (!CMS_API_URL || !CMS_SITE_DOMAIN) return null;
  return `${CMS_API_URL}/public/${encodeURIComponent(CMS_SITE_DOMAIN)}`;
}

export function cmsPublicBase() {
  return apiBase();
}

function normalizedCmsPath(input: string): string | null {
  let path = input.trim();
  try {
    path = decodeURIComponent(path);
  } catch {
    return null;
  }
  path = path.toLowerCase().replace(/\\/g, "/").replace(/\/{2,}/g, "/");
  if (!path.startsWith("/")) path = `/${path}`;
  path = path.replace(/\/+$/, "") || "/";
  if (/[?#\u0000-\u001f]/.test(path)) return null;
  if (path.split("/").some((part) => part === "." || part === "..")) return null;
  return path;
}

function urlForPath(path: string) {
  const base = apiBase();
  const normalized = normalizedCmsPath(path);
  if (!base || !normalized) return null;
  const segments = normalized === "/" ? [] : normalized.slice(1).split("/");
  return `${base}/pages/${segments.map(encodeURIComponent).join("/")}`;
}

async function getJson(url: string, fresh = false): Promise<unknown | null> {
  const response = await fetch(url, {
    ...(isDev || fresh
      ? { cache: "no-store" as const }
      : {
          next: {
            revalidate: CMS_REVALIDATE_SECONDS,
            tags: ["cms-public"],
          },
        }),
    signal: AbortSignal.timeout(CMS_TIMEOUT_MS),
    headers: { Accept: "application/json" },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`ERP responded ${response.status}`);
  return response.json();
}

function safeHref(value: string): string {
  const url = value.trim();
  if (!url || url.startsWith("//") || url.includes("\\")) return "";
  if (url.startsWith("/") || url.startsWith("#")) return url;
  return /^(https?:|mailto:|tel:)/i.test(url) ? url : "";
}

function safeColor(value: unknown): string | undefined {
  const color = str(value).trim();
  return /^#[\da-f]{3,8}$/i.test(color) ? color : undefined;
}

function safeCustomCss(value: unknown): string {
  const css = str(value);
  if (
    css.length > 20000 ||
    /[<\\]/.test(css) ||
    /url\s*\(|expression|javascript|@import/i.test(css)
  ) {
    return "";
  }
  return css;
}

function parseNavigation(raw: unknown, depth = 0): CmsNavigationItem[] {
  if (!Array.isArray(raw) || depth > 3) return [];
  return raw
    .map(obj)
    .map((item, index) => {
      const label = str(item.label).trim();
      const url = safeHref(str(item.url));
      if (!label || !url) return null;
      const target = str(item.target) === "_blank" ? "_blank" : "_self";
      return {
        id: str(item.id) || `nav-${depth}-${index}`,
        label,
        url,
        target,
        children: parseNavigation(item.children, depth + 1),
      };
    })
    .filter((item): item is CmsNavigationItem => item !== null);
}

async function fetchCmsSiteConfig(fresh = false): Promise<CmsSiteConfig | null> {
  const base = apiBase();
  if (!base) return null;
  const json = await getJson(base, fresh);
  if (!json) return null;
  const data = obj(obj(json).data);
  const website = obj(data.website);
  const designColors = obj(obj(data.design).colors);
  const websiteColors = obj(website);
  const navigation = obj(data.navigation);
  return {
    website: {
      name: str(website.name),
      domain: str(website.domain),
      logo: safeHref(str(website.logo)),
      favicon: safeHref(str(website.favicon)),
    },
    colors: {
      primary: safeColor(websiteColors.primaryColor) ?? safeColor(designColors.primary),
      secondary:
        safeColor(websiteColors.secondaryColor) ?? safeColor(designColors.secondary),
    },
    navigation: {
      header: parseNavigation(navigation.header),
      footer: parseNavigation(navigation.footer),
    },
  };
}

async function fetchCmsPages(): Promise<CmsPageSummary[]> {
  const base = apiBase();
  if (!base) return [];
  const json = await getJson(`${base}/pages`);
  const pages = obj(obj(json).data).pages;
  if (!Array.isArray(pages)) return [];
  return pages
    .map(obj)
    .map((page) => {
      const slug = normalizedCmsPath(str(page.slug));
      if (!slug) return null;
      return {
        title: str(page.title),
        slug,
        pageType: str(page.pageType),
        publishedAt: str(page.publishedAt),
        noindex: page.noindex === true,
      };
    })
    .filter((page): page is CmsPageSummary => page !== null);
}

async function fetchCmsPage(slug: string, fresh = false): Promise<CmsPage | null> {
  const url = urlForPath(slug);
  if (!url) return null;
  const json = await getJson(url, fresh);
  if (!json) return null;
  // A payload without a page (e.g. "/" resolves to the pages list endpoint)
  // means there is no CMS page at this path.
  return parsePage(obj(obj(json).data).page);
}

/**
 * Everything the CMS contributes to a path (site config + the page itself),
 * read from the cache or, with `fresh`, straight from the ERP. Throws when the
 * ERP is unreachable so callers never mistake an outage for a change.
 * Used by /api/cms-live to detect published changes.
 */
export async function cmsLiveSnapshot(path: string, fresh: boolean) {
  if (!isConfigured()) return null;
  const [config, page] = await Promise.all([
    fetchCmsSiteConfig(fresh),
    fetchCmsPage(path, fresh),
  ]);
  return { config, page };
}

export async function getCmsSiteConfig(): Promise<CmsSiteConfig | null> {
  if (!isConfigured()) return null;
  try {
    return await fetchCmsSiteConfig();
  } catch (error) {
    warn("could not load site configuration", error);
    return null;
  }
}

export async function getCmsPages(): Promise<CmsPageSummary[]> {
  if (!isConfigured()) return [];
  try {
    return await fetchCmsPages();
  } catch (error) {
    warn("could not load pages list", error);
    return [];
  }
}

export async function getCmsPage(slug: string): Promise<CmsPage | null> {
  const normalized = normalizedCmsPath(slug);
  if (!isConfigured() || !normalized) return null;
  try {
    const page = await fetchCmsPage(normalized);
    if (!page) return null;
    const summary = (await getCmsPages()).find((item) => item.slug === normalized);
    return summary?.noindex && !page.noindex ? { ...page, noindex: true } : page;
  } catch (error) {
    warn(`could not load page ${normalized}`, error);
    return null;
  }
}

export function buildCmsMetadata(page: CmsPage | null): Metadata {
  if (!page) {
    return {
      title: "Page Not Found",
      robots: { index: false, follow: false },
    };
  }
  const title = page.seo.title || page.title;
  const description = page.seo.metaDescription || undefined;
  const ogImage = /^https?:\/\//i.test(page.seo.ogImage)
    ? page.seo.ogImage
    : undefined;
  const noindex = page.noindex || /(?:^|[,;\s])noindex(?:$|[,;\s])/i.test(page.seo.robots);
  const nofollow = /(?:^|[,;\s])nofollow(?:$|[,;\s])/i.test(page.seo.robots);

  return {
    title,
    description,
    keywords: page.seo.focusKeyword ? [page.seo.focusKeyword] : undefined,
    robots: noindex
      ? { index: false, follow: !nofollow }
      : page.seo.robots || undefined,
    alternates: pageAlternates(page.seo.canonicalUrl || page.slug),
    openGraph: {
      title: page.seo.ogTitle || title,
      description: page.seo.ogDescription || description,
      type: page.pageType === "blog" ? "article" : "website",
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      ...(page.seo.twitterHandle ? { site: page.seo.twitterHandle } : {}),
      title: page.seo.ogTitle || title,
      description: page.seo.ogDescription || description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

function parsePage(raw: unknown): CmsPage | null {
  const page = obj(raw);
  const slug = normalizedCmsPath(str(page.slug));
  if (!slug || !Array.isArray(page.sections)) return null;
  const seo = obj(page.seo);
  const context = obj(page.context);
  const rawPosts = context.posts;
  const design = obj(page.design);
  const designColors = obj(design.colors);
  const sectionDefaults = obj(design.sectionDefaults);
  const customCode = obj(page.customCode);
  const sections = page.sections
    .map(obj)
    .filter((section) => str(section.type))
    .map((section, index): CmsSection => {
      const type = str(section.type);
      return {
        id: str(section.id) || `section-${index}`,
        type,
        order: typeof section.order === "number" ? section.order : index,
        content: obj(section.content),
        styles: obj(section.styles),
        responsive: obj(section.responsive),
        settings: { ...obj(sectionDefaults[type]), ...obj(section.settings) },
      };
    })
    .sort((left, right) => left.order - right.order);
  return {
    title: str(page.title),
    slug,
    pageType: str(page.pageType),
    featuredImage: str(page.featuredImage),
    sections,
    seo: {
      title: str(seo.title),
      metaDescription: str(seo.metaDescription),
      canonicalUrl: str(seo.canonicalUrl),
      robots: str(seo.robots),
      ogTitle: str(seo.ogTitle),
      ogDescription: str(seo.ogDescription),
      ogImage: str(seo.ogImage),
      focusKeyword: str(seo.focusKeyword),
      twitterHandle: str(seo.twitterHandle),
    },
    noindex: page.noindex === true,
    designColors: {
      primary: safeColor(designColors.primary),
      secondary: safeColor(designColors.secondary),
    },
    posts: (Array.isArray(rawPosts) ? rawPosts : []).map(obj).map((post) => ({
      title: str(post.title),
      url: str(post.url),
      pageType: str(post.pageType),
      excerpt: str(post.excerpt),
      image: str(post.image),
      publishedAt: str(post.publishedAt),
    })),
    customCode: {
      css: safeCustomCss(customCode.css),
      html: str(customCode.html),
    },
  };
}
