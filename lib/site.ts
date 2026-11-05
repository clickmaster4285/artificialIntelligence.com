import type { Metadata } from "next";
import { cache } from "react";

/**
 * The AI company is its own portfolio property on two hosts.
 * Neither host may canonicalise to the software-development domain.
 */
export const AI_COM_ORIGIN =
  "https://clickmastersartificialintelligencecompany.com";

export const AI_UK_ORIGIN =
  "https://clickmastersartificialintelligencecompany.co.uk";

const AI_ORIGINS: Record<string, string> = {
  "clickmastersartificialintelligencecompany.com": AI_COM_ORIGIN,
  "clickmastersartificialintelligencecompany.co.uk": AI_UK_ORIGIN,
};

const SOFTWARE_HOST =
  "clickmasterssoftwaredevelopmentcompany.co.uk";

function hostnameOf(value: string | null | undefined): string {
  if (!value) return "";

  const first = value.split(",")[0]?.trim().toLowerCase() ?? "";

  if (!first) return "";

  try {
    if (first.includes("://")) {
      return new URL(first).hostname.replace(/^www\./, "");
    }
  } catch {
    return "";
  }

  return first.replace(/^www\./, "").split(":")[0] ?? "";
}

/** Build-time origin. Ignores the software-development domain if it is set in env. */
export function fallbackSiteUrl(): string {
  const fromEnv = hostnameOf(process.env.NEXT_PUBLIC_SITE_URL);

  if (fromEnv && AI_ORIGINS[fromEnv]) {
    return AI_ORIGINS[fromEnv];
  }

  return AI_COM_ORIGIN;
}

export function siteUrlForHost(host: string | null | undefined): string {
  const name = hostnameOf(host);

  if (AI_ORIGINS[name]) {
    return AI_ORIGINS[name];
  }

  if (name === SOFTWARE_HOST || name.endsWith(`.${SOFTWARE_HOST}`)) {
    return AI_UK_ORIGIN;
  }

  return fallbackSiteUrl();
}

export const SITE_URL = fallbackSiteUrl();

/** Origin for the request host, so each AI domain canonicalises to itself. */
export const getRequestSiteUrl = cache(async (): Promise<string> => {
  try {
    const { headers } = await import("next/headers");
    const list = await headers();
    const host = list.get("x-forwarded-host") ?? list.get("host");

    return siteUrlForHost(host);
  } catch {
    return fallbackSiteUrl();
  }
});

export function pathnameFromCanonical(path: string): string {
  let pathname = "/";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      pathname = new URL(path).pathname || "/";
    } catch {
      pathname = "/";
    }
  } else {
    pathname = path.startsWith("/") ? path : `/${path}`;
  }

  if (pathname.length > 1) {
    pathname = pathname.replace(/\/+$/, "");
  }

  return pathname || "/";
}

export function absoluteUrl(path: string, siteUrl: string): string {
  const pathname = pathnameFromCanonical(path);

  if (pathname === "/") {
    return siteUrl;
  }

  return `${siteUrl}${pathname}`;
}

export function localeForSite(siteUrl: string): "en-GB" | "en-US" {
  return siteUrl === AI_UK_ORIGIN ? "en-GB" : "en-US";
}

/**
 * Relative canonical on the host that served the page, plus hreflang
 * so the .com and .co.uk AI sites are alternates of each other.
 */
export function pageAlternates(path: string): NonNullable<Metadata["alternates"]> {
  const pathname = pathnameFromCanonical(path);

  return {
    canonical: pathname,
    languages: {
      "en-US": absoluteUrl(pathname, AI_COM_ORIGIN),
      "en-GB": absoluteUrl(pathname, AI_UK_ORIGIN),
      "x-default": absoluteUrl(pathname, AI_COM_ORIGIN),
    },
  };
}
