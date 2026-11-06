// src/lib/schema.ts

import { AIPageData } from '@/data/ai-development-pages-data';
import { COMPANY, companyContactPoints, companyLogoUrl } from '@/lib/company';
import { absoluteUrl, fallbackSiteUrl, localeForSite } from '@/lib/site';

function offerFromStartingPrice(startingPrice?: string) {
  if (!startingPrice) return {};

  const price = startingPrice.replace(/[$,\s]/g, "");

  if (!/^\d+(\.\d+)?$/.test(price)) return {};

  return {
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };
}

/**
 * Generate Service Schema (Product/Services page schema)
 * Used for SEO to describe the service offering
 */
export function generateServiceSchema(pageData: AIPageData, siteUrl: string = fallbackSiteUrl()) {
  const baseUrl = siteUrl;
  const fullUrl = absoluteUrl(pageData.meta.slug, baseUrl);

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: pageData.h1,
    description: pageData.meta.description,
    url: fullUrl,
    provider: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: COMPANY.legalName,
      url: baseUrl,
      logo: companyLogoUrl(baseUrl),
      email: COMPANY.email,
      contactPoint: companyContactPoints()
    },
    serviceType: 'AI Development',
    serviceOutput: pageData.meta.primaryKW,
    areaServed: [
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'Pakistan' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'AI Development Services',
      description: pageData.meta.description,
      itemListElement: pageData.pricing.items.map((item, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: item.systemType,
          description: item.primaryOutcome
        },
        price: item.priceRange,
        priceCurrency: 'USD',
        position: index + 1
      }))
    },
    ...(offerFromStartingPrice(pageData.hero.startingPrice)),
    about: {
      '@type': 'Thing',
      name: 'AI Development Services',
      description: pageData.meta.description
    },
    audience: {
      '@type': 'BusinessAudience',
      audienceType: 'Enterprise Organizations'
    }
  };
}

/**
 * Generate FAQ Schema
 * Used for FAQ sections to get rich results in search
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * Generate Breadcrumb Schema
 * Used for breadcrumb navigation rich results
 */
export function generateBreadcrumbSchema(pageData: AIPageData, siteUrl: string = fallbackSiteUrl()) {
  const baseUrl = siteUrl;
  const isSubPage = pageData.meta.slug !== '/ai-development/';
  
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'AI Development',
      item: absoluteUrl("/ai-development", baseUrl)
    }
  ];

  if (isSubPage) {
    const pageTitle = pageData.h1
      .split(' — ')[0]
      .replace('AI Development for ', '')
      .replace('AI Development — ', '')
      .replace('AI Development and ', '');
    
    items.push({
      '@type': 'ListItem',
      position: 3,
      name: pageTitle,
      item: absoluteUrl(pageData.meta.slug, baseUrl)
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
  };
}

/**
 * Generate Organization Schema
 * Used for the main organization entity
 */
export function generateOrganizationSchema(siteUrl: string = fallbackSiteUrl()) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: COMPANY.legalName,
    alternateName: COMPANY.brandName,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: companyLogoUrl(siteUrl)
    },
    description:
      'ClickMasters Artificial Intelligence Company designs and builds AI products, web platforms and mobile software.',
    email: COMPANY.email,
    contactPoint: companyContactPoints()
  };
}

export function generateWebSiteSchema(siteUrl: string = fallbackSiteUrl()) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: COMPANY.legalName,
    alternateName: COMPANY.brandName,
    url: siteUrl,
    publisher: {
      '@id': `${siteUrl}/#organization`
    },
    inLanguage: localeForSite(siteUrl)
  };
}

function withoutContext(schema: Record<string, unknown>) {
  const node = { ...schema };
  delete node["@context"];
  return node;
}

export function generateSiteJsonLd(siteUrl: string = fallbackSiteUrl()) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      withoutContext(generateOrganizationSchema(siteUrl)),
      withoutContext(generateWebSiteSchema(siteUrl))
    ]
  };
}

/**
 * Generate Article/BlogPost Schema
 * Used for blog posts or articles
 */
export function generateArticleSchema(
  title: string,
  description: string,
  url: string,
  publishDate: string,
  authorName: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: url,
    datePublished: publishDate,
    dateModified: publishDate,
    author: {
      '@type': 'Person',
      name: authorName
    },
    publisher: {
      '@type': 'Organization',
      name: 'ClickMasters Artificial Intelligence Company',
      logo: {
        '@type': 'ImageObject',
        url: `${fallbackSiteUrl()}/logo.png`
      }
    }
  };
}

/**
 * Generate HowTo Schema
 * Used for step-by-step guides or processes
 */
export function generateHowToSchema(
  name: string,
  description: string,
  steps: { name: string; text: string }[],
  totalTime?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: name,
    description: description,
    totalTime: totalTime || 'PT12W',
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text
    }))
  };
}

/**
 * Generate Review Schema
 * Used for testimonials and reviews
 */
export function generateReviewSchema(
  name: string,
  reviewBody: string,
  ratingValue: number,
  authorName: string,
  datePublished: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name: name,
    reviewBody: reviewBody,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: ratingValue,
      bestRating: 5
    },
    author: {
      '@type': 'Person',
      name: authorName
    },
    datePublished: datePublished,
    publisher: {
      '@type': 'Organization',
      name: 'ClickMasters Artificial Intelligence Company'
    }
  };
}

/**
 * Generate all schemas for a page
 */
export function generateAllSchemas(pageData: AIPageData, siteUrl: string = fallbackSiteUrl()) {
  return {
    service: generateServiceSchema(pageData, siteUrl),
    faq: generateFAQSchema(pageData.faqs),
    breadcrumb: generateBreadcrumbSchema(pageData, siteUrl),
    organization: generateOrganizationSchema(siteUrl)
  };
}

/**
 * Convert schemas to JSON-LD script tags
 */
export function generateSchemaScripts(pageData: AIPageData) {
  const schemas = generateAllSchemas(pageData);
  
  return Object.values(schemas).map((schema) => ({
    type: 'application/ld+json',
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(schema)
    }
  }));
}