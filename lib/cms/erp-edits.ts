// lib/erp-edits.ts
// Server-only client for ERP/Nexus "edited pages": published visual edits to
// existing pages on this site (code-owned or CMS). Separate from lib/cms.ts,
// which renders pages *created* in the CMS. The browser applies the edits
// (components/cms/ErpPageEdits.tsx) through the app/api/erp-edits proxy; the
// server only uses the SEO fields (withEditedPageSeo).
import type { Metadata } from 'next';
import { pageAlternates } from '@/lib/site';
import { cmsPublicBase } from '@/lib/cms/cms';
import { normalizeEditPath, parseErpSections, type ErpEdit } from '@/lib/cms/erp-edits-shared';

export const EDITS_REVALIDATE_SECONDS = 60;
const EDITS_TIMEOUT_MS = 4000;
// After a failed list fetch, don't retry for this long. Keeps builds and
// requests fast while the ERP is down (failed fetches are never cached).
const FAILURE_BACKOFF_MS = 30_000;

// Slugs from the list are used to build the page URL; allow only plain paths.
const SLUG_REGEX = /^\/[a-z0-9\-._~%/]*$/;

export type EditedPageSeo = {
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  robots: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
};

export type EditedPage = {
  slug: string;
  version: number;
  noindex: boolean;
  seo: EditedPageSeo;
  edits: ErpEdit[];
};

type EditedPathSummary = { slug: string; noindex: boolean };

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const obj = (v: unknown): Record<string, unknown> =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};

const base = () => cmsPublicBase();

function isSafeEditPath(path: string) {
  return (
    path.length <= 2048 &&
    SLUG_REGEX.test(path) &&
    !path.includes('//') &&
    !path.split('/').some((segment) => segment === '.' || segment === '..')
  );
}

async function getJson(url: string, tag: string, fresh = false): Promise<unknown | null> {
  const res = await fetch(url, {
    ...(isDev || fresh
      ? { cache: 'no-store' as const }
      : { next: { revalidate: EDITS_REVALIDATE_SECONDS, tags: [tag] } }),
    signal: AbortSignal.timeout(EDITS_TIMEOUT_MS),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
  return res.json();
}

async function fetchEditedPaths(fresh = false): Promise<EditedPathSummary[]> {
  const apiBase = base();
  if (!apiBase) return [];
  const json = await getJson(`${apiBase}/edited-pages`, 'erp-edited-paths', fresh);
  const pages = obj(obj(json).data).pages;
  if (!Array.isArray(pages)) return [];
  const paths = pages
    .map((value): EditedPathSummary | null => {
      const page = obj(value);
      const rawSlug = str(page.slug);
      if (!rawSlug) return null;
      return {
        slug: normalizeEditPath(rawSlug),
        noindex: page.noindex === true,
      };
    })
    .filter((page): page is EditedPathSummary => page !== null && isSafeEditPath(page.slug));
  return [...new Map(paths.map((page) => [page.slug, page])).values()];
}

async function fetchEditedPage(slug: string, fresh = false): Promise<EditedPage | null> {
  const apiBase = base();
  if (!apiBase) return null;
  const url =
    slug === '/'
      ? `${apiBase}/edited-page?slug=${encodeURIComponent('/')}`
      : `${apiBase}/edited-pages${slug.split('/').map(encodeURIComponent).join('/')}`;
  const json = await getJson(url, 'erp-edited-page', fresh);
  if (json === null) return null;
  const page = obj(obj(obj(json).data).page);
  const seo = obj(page.seo);
  return {
    slug,
    version: typeof page.version === 'number' ? page.version : 0,
    noindex: page.noindex === true,
    seo: {
      title: str(seo.title),
      metaDescription: str(seo.metaDescription),
      canonicalUrl: str(seo.canonicalUrl),
      robots: str(seo.robots),
      ogTitle: str(seo.ogTitle),
      ogDescription: str(seo.ogDescription),
      ogImage: str(seo.ogImage),
    },
    edits: parseErpSections(page.sections),
  };
}

const isDev = process.env.NODE_ENV === 'development';

let lastFailureAt = 0;

// `fresh: true` skips the cache and asks the ERP directly. Used by
// /api/erp-edits (the edits the browser applies), so a publish shows on the
// very next page view. Server-rendered metadata keeps the cache, so pages
// stay static; /api/cms-live expires it as soon as a change is published.
type FetchOptions = { fresh?: boolean };

/** Normalized paths ("/a/b", home "/") that have published edits. Empty on any error. */
export async function getEditedPaths({ fresh = false }: FetchOptions = {}): Promise<string[]> {
  const pages = await getEditedPathSummaries({ fresh });
  return pages.map(({ slug }) => slug);
}

async function getEditedPathSummaries({ fresh = false }: FetchOptions = {}): Promise<EditedPathSummary[]> {
  if (!base() || Date.now() - lastFailureAt < FAILURE_BACKOFF_MS) return [];
  try {
    return await fetchEditedPaths(fresh);
  } catch (error) {
    lastFailureAt = Date.now();
    if (isDev) console.warn('[erp-edits] failed to fetch edited pages list:', error);
    return [];
  }
}

/**
 * Published edits for a URL path, or null when there are none (or the ERP is
 * unreachable). Checks the cached list first, so unedited paths never hit the
 * per-page endpoint.
 */
export async function getEditedPage(
  path: string,
  { fresh = false }: FetchOptions = {},
): Promise<EditedPage | null> {
  const slug = normalizeEditPath(path);
  if (!isSafeEditPath(slug)) return null;
  const pages = await getEditedPathSummaries({ fresh });
  const summary = pages.find((item) => item.slug === slug);
  if (!summary) return null;
  try {
    const page = await fetchEditedPage(slug, fresh);
    return page && summary.noindex && !page.noindex ? { ...page, noindex: true } : page;
  } catch (error) {
    if (isDev) console.warn(`[erp-edits] failed to fetch edited page ${slug}:`, error);
    return null;
  }
}

/**
 * Published edits for a path, read from the cache or, with `fresh`, straight
 * from the ERP. Unlike getEditedPage this throws on errors (no backoff, no
 * null fallback) so /api/cms-live never mistakes an outage for a change.
 */
export async function editsLiveSnapshot(path: string, fresh: boolean) {
  if (!base()) return null;
  const slug = normalizeEditPath(path);
  const paths = await fetchEditedPaths(fresh);
  const summary = isSafeEditPath(slug) ? paths.find((item) => item.slug === slug) : undefined;
  const page = summary ? await fetchEditedPage(slug, fresh) : null;
  return { paths, page };
}

/**
 * Overlays an edited page's SEO fields on a route's own metadata. Only fields
 * the edited page actually sets are replaced; everything else is untouched.
 */
export async function withEditedPageSeo(path: string, metadata: Metadata): Promise<Metadata> {
  const page = await getEditedPage(path);
  if (!page) return metadata;
  const { seo } = page;
  const ogImage =
    /^https?:\/\//i.test(seo.ogImage) ||
    (seo.ogImage.startsWith('/') && !seo.ogImage.startsWith('//'))
      ? seo.ogImage
      : '';
  const hasOg = Boolean(seo.ogTitle || seo.ogDescription || ogImage);
  const noindex = page.noindex || /(?:^|[,;\s])noindex(?:$|[,;\s])/i.test(seo.robots);
  const nofollow = /(?:^|[,;\s])nofollow(?:$|[,;\s])/i.test(seo.robots);

  return {
    ...metadata,
    ...(seo.title ? { title: seo.title } : {}),
    ...(seo.metaDescription ? { description: seo.metaDescription } : {}),
    ...(noindex
      ? { robots: { index: false, follow: !nofollow } }
      : seo.robots
        ? { robots: seo.robots }
        : {}),
    ...(seo.canonicalUrl
      ? { alternates: { ...metadata.alternates, ...pageAlternates(seo.canonicalUrl) } }
      : {}),
    ...(hasOg
      ? {
          openGraph: {
            ...metadata.openGraph,
            ...(seo.ogTitle ? { title: seo.ogTitle } : {}),
            ...(seo.ogDescription ? { description: seo.ogDescription } : {}),
            ...(ogImage ? { images: [ogImage] } : {}),
          },
        }
      : {}),
  };
}
