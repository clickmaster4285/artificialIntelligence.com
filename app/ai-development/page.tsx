
// src/app/ai-development/page.tsx

import { aiDevelopmentLandingData, getAllPageData } from '@/data/ai-development-pages-data';
import { ServiceLayout } from '@/components/services/layout';
import { ServiceHero } from '@/components/services/Hero';
import { ServiceOverview } from '@/components/services/Overview';
import { ServicePricing } from '@/components/services/PricingTable';
import { ServiceApplications } from '@/components/services/ServiceApplication';
import { ServiceFAQs } from '@/components/services/Faq';
import { ServiceCTA } from '@/components/services/Cta';
import { ServiceDropdownNav } from '@/components/services/ServiceDropdownNav';
import { CrawlableIndex } from '@/components/site/PageContextLinks';
import { generateServiceSchema } from '@/lib/schema';
import { fallbackSiteUrl, pageAlternates } from '@/lib/site';
import { withEditedPageSeo } from '@/lib/cms/erp-edits';

const pageMetadata = {
  title: aiDevelopmentLandingData.meta.title,
  description: aiDevelopmentLandingData.meta.description,
  keywords: [
    aiDevelopmentLandingData.meta.primaryKW,
    ...aiDevelopmentLandingData.meta.secondaryKWs,
  ].join(', '),
  alternates: pageAlternates(aiDevelopmentLandingData.meta.slug),
};

export const revalidate = 60;

export async function generateMetadata() {
  return withEditedPageSeo('/ai-development', pageMetadata);
}

export default async function AIDevelopmentLandingPage() {
  const pageData = aiDevelopmentLandingData;
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
        <ServiceHero data={pageData.hero} h1={pageData.h1} />
        <ServiceOverview data={pageData.overview} />
        <ServicePricing data={pageData.pricing} />
        <ServiceApplications data={pageData.applications} />
        <ServiceFAQs data={pageData.faqs} />
        <CrawlableIndex
          title="AI development services"
          intro="Industry and service pages for the systems ClickMasters designs and builds."
          links={getAllPageData().map(({ slug, data }) => ({
            href: `/ai-development/${slug}`,
            label: data.meta.title.split("|")[0].trim(),
          }))}
        />
        <ServiceCTA data={pageData.cta} />
      </ServiceLayout>
    </>
  );
}