// src/lib/schema.ts

import { AIPageData } from '@/data/ai-development-pages-data';
import { SITE_URL } from '@/lib/site';

/**
 * Generate Service Schema (Product/Services page schema)
 * Used for SEO to describe the service offering
 */
export function generateServiceSchema(pageData: AIPageData) {
  const baseUrl = SITE_URL;
  const fullUrl = `${baseUrl}${pageData.meta.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: pageData.h1,
    description: pageData.meta.description,
    url: fullUrl,
    provider: {
      '@type': 'Organization',
      name: 'ClickMasters Artificial Intelligence Company',
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-800-555-0199',
        contactType: 'sales',
        availableLanguage: ['English'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00'
        }
      },
      sameAs: [
        'https://www.linkedin.com/company/clickmasters',
        'https://twitter.com/clickmasters',
        'https://github.com/clickmasters'
      ]
    },
    serviceType: 'AI Development',
    serviceOutput: pageData.meta.primaryKW,
    areaServed: {
      '@type': 'Country',
      name: 'United States'
    },
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
    offers: {
      '@type': 'Offer',
      price: pageData.hero.startingPrice?.replace('$', '').replace(',', '') || '30000',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString().split('T')[0],
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: pageData.hero.startingPrice?.replace('$', '').replace(',', '') || '30000',
        priceCurrency: 'USD',
        unitText: 'project'
      }
    },
    potentialAction: {
      '@type': 'ContactAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/contact`,
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform'
        ]
      }
    },
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
export function generateBreadcrumbSchema(pageData: AIPageData) {
  const baseUrl = SITE_URL;
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
      item: `${baseUrl}/ai-development/`
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
      item: `${baseUrl}${pageData.meta.slug}`
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
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ClickMasters Artificial Intelligence Company',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'AI development company building custom AI systems for enterprise and startups. USA-based senior engineers. Fixed-price contracts.',
    email: 'hello@clickmastersartificialintelligencecompany.com',
    telephone: '+1-800-555-0199',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
      addressLocality: 'New York',
      addressRegion: 'NY'
    },
    sameAs: [
      'https://www.linkedin.com/company/clickmasters',
      'https://twitter.com/clickmasters',
      'https://github.com/clickmasters',
      'https://www.youtube.com/@clickmasters'
    ],
    foundingDate: '2016',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: 50
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-555-0199',
      contactType: 'sales',
      availableLanguage: ['English']
    }
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
        url: `${SITE_URL}/logo.png`
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
export function generateAllSchemas(pageData: AIPageData) {
  return {
    service: generateServiceSchema(pageData),
    faq: generateFAQSchema(pageData.faqs),
    breadcrumb: generateBreadcrumbSchema(pageData),
    organization: generateOrganizationSchema()
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