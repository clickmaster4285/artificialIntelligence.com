import type { MetadataRoute } from "next";

import { getRequestSiteUrl } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteUrl = await getRequestSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/glossary?"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
