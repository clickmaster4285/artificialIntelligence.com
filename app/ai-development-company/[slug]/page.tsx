// app/ai-development-company/[slug]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { PageLayout } from '@/components/locations/PageLayout';
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

export async function generateStaticParams() {
  const slugs = getAllLocationPageSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = getLocationPageDataBySlug(slug);
  
  if (!location) {
    return {
      title: 'Location Not Found',
      description: 'The requested location page could not be found.',
    };
  }

  return {
    title: location.meta.title,
    description: location.meta.description,
    alternates: {
      canonical: location.meta.slug,
    },
  };
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = getLocationPageDataBySlug(slug);

  if (!location) {
    notFound();
  }

  const locationName = location.h1.split(' — ')[0].replace('AI Development Company in ', '');

  return (
    <PageLayout withGrain>
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