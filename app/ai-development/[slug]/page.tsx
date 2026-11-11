// src/app/ai-development/[slug]/page.tsx

import { getPageDataBySlug, getAllPageSlugs } from '@/data/ai-development-pages-data';
import { ServiceLayout } from '@/components/services/layout';
import { ServiceHero } from '@/components/services/Hero';
import { ServiceOverview } from '@/components/services/Overview';
import { ServicePricing } from '@/components/services/PricingTable';
import { ServiceApplications } from '@/components/services/ServiceApplication';
import { ServiceTechnicalChallenges } from '@/components/services/TechnicalChallenges';
import { ServiceCompliance } from '@/components/services/ServiceCompliance';
import { ServiceFAQs } from '@/components/services/Faq';
import { ServiceCTA } from '@/components/services/Cta';
import { ServiceDropdownNav } from '@/components/services/ServiceDropdownNav';
import { BreadcrumbTrail, RelatedPages } from '@/components/site/PageContextLinks';
import { generateServiceSchema } from '@/lib/schema';
import { serviceBreadcrumbs, serviceRelatedLinks } from '@/lib/related-content';
import { fallbackSiteUrl, pageAlternates } from '@/lib/site';
import CmsRoute, { cmsRouteMetadata } from '@/components/cms/CmsRoute';
import { withEditedPageSeo } from '@/lib/cms/erp-edits';
import { getCmsPages } from '@/lib/cms/cms';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const codeSlugs = getAllPageSlugs();
  const cmsSlugs = (await getCmsPages())
    .map((page) => page.slug)
    .filter((path) => path.split('/').filter(Boolean).length === 2)
    .filter((path) => path.toLowerCase().startsWith('/ai-development/'))
    .map((path) => path.split('/').filter(Boolean)[1])
    .filter((slug) => !codeSlugs.some((codeSlug) => codeSlug.toLowerCase() === slug.toLowerCase()));
  return [...codeSlugs, ...cmsSlugs].map((slug) => ({ slug }));
}

export default async function AIDevelopmentSubPage({ params }: PageProps) {
  const { slug } = await params;
  const pageData = getPageDataBySlug(slug);

  if (!pageData) {
    return <CmsRoute path={`/ai-development/${slug}`} />;
  }

  const siteUrl = fallbackSiteUrl();
  const schema = generateServiceSchema(pageData, siteUrl);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ServiceLayout>
        <ServiceDropdownNav />
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <BreadcrumbTrail items={serviceBreadcrumbs(pageData.meta.title)} />
        </div>
        <ServiceHero data={pageData.hero} h1={pageData.h1} />
        <ServiceOverview data={pageData.overview} />
        <ServicePricing data={pageData.pricing} />
        <ServiceApplications data={pageData.applications} />
        {pageData.technicalChallenges && (
          <ServiceTechnicalChallenges data={pageData.technicalChallenges} />
        )}
        {pageData.compliance && (
          <ServiceCompliance data={pageData.compliance} />
        )}
        <ServiceFAQs data={pageData.faqs} />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <RelatedPages links={serviceRelatedLinks(slug, pageData.internalLinks)} />
        </div>
        <ServiceCTA data={pageData.cta} />
      </ServiceLayout>
    </>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const pageData = getPageDataBySlug(slug);

  if (!pageData) {
    return cmsRouteMetadata(`/ai-development/${slug}`);
  }

  return withEditedPageSeo(`/ai-development/${slug}`, {
    title: pageData.meta.title,
    description: pageData.meta.description,
    keywords: [pageData.meta.primaryKW, ...pageData.meta.secondaryKWs].join(', '),
    openGraph: {
      title: pageData.meta.title,
      description: pageData.meta.description,
      url: pageData.meta.slug,
      type: 'website',
    },
    alternates: pageAlternates(pageData.meta.slug),
  });
}