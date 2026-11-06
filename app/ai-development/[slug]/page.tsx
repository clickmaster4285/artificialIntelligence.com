// src/app/ai-development/[slug]/page.tsx

import { notFound } from 'next/navigation';
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

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllPageSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export default async function AIDevelopmentSubPage({ params }: PageProps) {
  const { slug } = await params;
  const pageData = getPageDataBySlug(slug);

  if (!pageData) {
    notFound();
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
    return {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.',
    };
  }

  return {
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
  };
}