import CmsRoute, { cmsPath, cmsRouteMetadata } from "@/components/cms/CmsRoute";
import { getCmsPages } from "@/lib/cms/cms";

type CmsCatchAllProps = {
  params: Promise<{ cmsSlug: string[] }>;
};

export const revalidate = 60;

export async function generateStaticParams() {
  const reservedRoots = new Set([
    "ai-development",
    "ai-development-company",
    "api",
    "glossary",
  ]);
  return (await getCmsPages())
    .filter((page) => {
      const segments = page.slug.split("/").filter(Boolean);
      if (segments.length < 2 || segments[0]?.toLowerCase() === "api") return false;
      return segments.length > 2 || !reservedRoots.has(segments[0]?.toLowerCase() ?? "");
    })
    .map((page) => ({
      cmsSlug: page.slug.split("/").filter(Boolean),
    }));
}

export async function generateMetadata({ params }: CmsCatchAllProps) {
  const { cmsSlug } = await params;
  return cmsRouteMetadata(cmsPath(cmsSlug));
}

export default async function CmsCatchAllPage({ params }: CmsCatchAllProps) {
  const { cmsSlug } = await params;
  return <CmsRoute path={cmsPath(cmsSlug)} />;
}
