// components/cms/CmsRoute.tsx
// Renders whatever page Nexus CMS has published at a URL path — used by the
// root catch-all (app/[...slug]) and as the fallback of existing dynamic
// routes for slugs they don't own. No per-page code: path in, page out.
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildCmsMetadata, getCmsPage } from "@/lib/cms/cms";
import { withEditedPageSeo } from "@/lib/cms/erp-edits";
import CmsSectionRenderer from "./CmsSectionRenderer";
import CmsRichText from "./CmsRichText";
import type { CSSProperties } from "react";

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
  const colors: CSSProperties = {
    ...(page.designColors.primary
      ? { "--primary": page.designColors.primary, "--brand": page.designColors.primary }
      : {}),
    ...(page.designColors.secondary ? { "--secondary": page.designColors.secondary } : {}),
  } as CSSProperties;
  return (
    <div className="cms-page" style={colors}>
      {page.customCode.css && <style>{page.customCode.css}</style>}
      <CmsSectionRenderer page={page} />
      {page.customCode.html && <CmsRichText html={page.customCode.html} />}
    </div>
  );
}
