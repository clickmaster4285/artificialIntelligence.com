// app/ai-development-company/[slug]/page.tsx
import React from 'react';
import { PageLayout } from '@/components/locations/PageLayout';
import { BreadcrumbTrail, RelatedPages } from '@/components/site/PageContextLinks';
import {
  locationBreadcrumbs,
  locationRelatedLinks,
} from '@/lib/related-content';
import { HeroSection } from '@/components/locations/sections/Hero';
import { OverviewSection } from '@/components/locations/sections/Overview';
import { PricingSection } from '@/components/locations/sections/PricingTable';
import { ApplicationsSection } from '@/components/locations/sections/Application';
import { ComplianceSection } from '@/components/locations/sections/Compliance';
import { FAQSection } from '@/components/locations/sections/Faq';
import { CTASection } from '@/components/locations/sections/Cta';
import { StatsSection } from '@/components/locations/sections/Stats';
import { 
  getAllLocationPageSlugs, 
  getLocationPageDataBySlug 
} from '@/data/ai-development-company-pages-data';
import { pageAlternates } from '@/lib/site';
import CmsRoute, { cmsRouteMetadata } from '@/components/cms/CmsRoute';
import { withEditedPageSeo } from '@/lib/cms/erp-edits';
import { getCmsPages } from '@/lib/cms/cms';

export async function generateStaticParams() {
  const codeSlugs = getAllLocationPageSlugs();
  const cmsSlugs = (await getCmsPages())
    .map((page) => page.slug)
    .filter((path) => path.split('/').filter(Boolean).length === 2)
    .filter((path) => path.toLowerCase().startsWith('/ai-development-company/'))
    .map((path) => path.split('/').filter(Boolean)[1])
    .filter((slug) => !codeSlugs.some((codeSlug) => codeSlug.toLowerCase() === slug.toLowerCase()));
  return [...codeSlugs, ...cmsSlugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = getLocationPageDataBySlug(slug);
  
  if (!location) {
    return cmsRouteMetadata(`/ai-development-company/${slug}`);
  }

  return withEditedPageSeo(`/ai-development-company/${slug}`, {
    title: location.meta.title,
    description: location.meta.description,
    alternates: pageAlternates(location.meta.slug),
  });
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = getLocationPageDataBySlug(slug);

  if (!location) {
    return <CmsRoute path={`/ai-development-company/${slug}`} />;
  }

  const locationName = location.h1.split(' — ')[0].replace('AI Development Company in ', '');

  return (
    <PageLayout withGrain>
      <BreadcrumbTrail
        className="pt-8"
        items={locationBreadcrumbs(locationName)}
      />
      <HeroSection
        tagline={location.hero.tagline}
        title={location.h1}
        description={location.hero.description}
        ctaText={location.hero.ctaText}
        ctaLink={location.hero.ctaLink}
        startingPrice={location.hero.startingPrice}
        badge={location.hero.badge}
        stats={location.overview.stats}
      />

      <OverviewSection
        title={location.overview.title}
        content={location.overview.content}
        stats={location.overview.stats}
      />

      <StatsSection
        title={`Why ${locationName} Organizations Choose ClickMasters`}
        stats={location.overview.stats ?? []}
      />

      <PricingSection
        title={location.pricing.title}
        description={location.pricing.description}
        items={location.pricing.items}
        note={location.pricing.note}
      />

      <ApplicationsSection
        title={location.applications.title}
        description={location.applications.description}
        items={location.applications.items}
      />

      {location.compliance && (
        <ComplianceSection
          title={location.compliance.title}
          description={location.compliance.description}
          items={location.compliance.items}
        />
      )}

      <FAQSection items={location.faqs} />

      <RelatedPages
        className="py-16"
        links={locationRelatedLinks(slug, location.internalLinks)}
      />

      <CTASection
        title={location.cta.title}
        description={location.cta.description}
        ctaText={location.cta.ctaText}
        ctaLink={location.cta.ctaLink}
        secondaryText="24-hour response • 2-week start"
      />
    </PageLayout>
  );
}