// components/cms/CmsRoute.tsx
// Renders whatever page Nexus CMS has published at a URL path — used by the
// root catch-all (app/[...cmsSlug]) and as the fallback of existing dynamic
// routes for slugs they don't own. No per-page code: path in, page out.
//
// CRM pages use the site's own design: the CRM content is converted to the
// site's page format (lib/cms/cms-to-dynamic) and rendered with the same
// template as the site's other data-driven pages.
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildCmsMetadata, cmsPageVersion, getCmsPage } from "@/lib/cms/cms";
import { cmsPageToDynamicPage } from "@/lib/cms/cms-to-dynamic";
import { withEditedPageSeo } from "@/lib/cms/erp-edits";
import { DynamicPageTemplate } from "@/components/dynamic-pages/DynamicPageTemplate";
import { generateDynamicPageSchema, serializeJsonLd } from "@/lib/dynamic-pages/page-schema";
import { fallbackSiteUrl } from "@/lib/site";
import CmsRichText from "./CmsRichText";

/** "/a/b" from route segments (["a", "b"]). */
export function cmsPath(segments: string[]) {
  return `/${segments.join("/")}`;
}

export async function cmsRouteMetadata(path: string): Promise<Metadata> {
  return withEditedPageSeo(path, buildCmsMetadata(await getCmsPage(path)));
}

export default async function CmsRoute({ path }: { path: string }) {
  const page = await getCmsPage(path);
  if (!page) notFound();
  const sitePage = cmsPageToDynamicPage(page);

  return (
    // data-cms-version: lets components/cms/ErpPageEdits detect when this page
    // is out of date with the CRM and refresh it live.
    <div data-cms-page data-cms-version={cmsPageVersion(page) ?? undefined}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(generateDynamicPageSchema(sitePage, fallbackSiteUrl())) }}
      />
      {page.customCode.css && <style>{page.customCode.css}</style>}
      <DynamicPageTemplate page={sitePage} />
      {page.customCode.html && <CmsRichText html={page.customCode.html} />}
    </div>
  );
}
