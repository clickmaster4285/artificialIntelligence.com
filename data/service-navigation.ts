// data/service-navigation.ts

export interface ServiceNavItem {
  slug: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  category: string;
}

export interface ServiceCategory {
  title: string;
  items: ServiceNavItem[];
}

export const serviceNavigationItems: ServiceNavItem[] = [
  // Financial Services
  {
    slug: 'fintech',
    title: 'FinTech AI',
    description: 'Fraud detection, credit scoring, AML compliance',
    icon: '💰',
    path: '/ai-development/fintech',
    category: 'Financial Services'
  },
  {
    slug: 'insurance',
    title: 'Insurance AI',
    description: 'Claims automation, fraud detection, underwriting AI',
    icon: '🛡️',
    path: '/ai-development/insurance',
    category: 'Financial Services'
  },

  // Business Operations
  {
    slug: 'legal',
    title: 'Legal AI',
    description: 'Contract review, legal research, due diligence',
    icon: '⚖️',
    path: '/ai-development/legal',
    category: 'Business Operations'
  },
  {
    slug: 'hr-technology',
    title: 'HR Technology AI',
    description: 'Candidate screening, attrition prediction, HR chatbots',
    icon: '👥',
    path: '/ai-development/hr-technology',
    category: 'Business Operations'
  },
  {
    slug: 'customer-service',
    title: 'Customer Service AI',
    description: 'AI chatbots, agent assist, ticket routing',
    icon: '💬',
    path: '/ai-development/customer-service',
    category: 'Business Operations'
  },

  // Commerce & Retail
  {
    slug: 'ecommerce',
    title: 'eCommerce AI',
    description: 'Recommendation engines, visual search, demand forecasting',
    icon: '🛒',
    path: '/ai-development/ecommerce',
    category: 'Commerce & Retail'
  },
  {
    slug: 'retail',
    title: 'Retail AI',
    description: 'Demand forecasting, personalization, inventory optimization',
    icon: '🏪',
    path: '/ai-development/retail',
    category: 'Commerce & Retail'
  },

  // Supply Chain & Logistics
  {
    slug: 'logistics',
    title: 'Logistics AI',
    description: 'Route optimization, demand forecasting, warehouse AI',
    icon: '🚚',
    path: '/ai-development/logistics',
    category: 'Supply Chain & Logistics'
  },
  {
    slug: 'supply-chain',
    title: 'Supply Chain AI',
    description: 'Demand sensing, supplier risk, inventory optimization',
    icon: '📦',
    path: '/ai-development/supply-chain',
    category: 'Supply Chain & Logistics'
  },

  // Industry Specific
  {
    slug: 'healthcare',
    title: 'Healthcare AI',
    description: 'Clinical decision support, EHR AI, medical imaging',
    icon: '🏥',
    path: '/ai-development/healthcare',
    category: 'Industry Specific'
  },
  {
    slug: 'real-estate',
    title: 'Real Estate AI',
    description: 'Property valuation, lead scoring, document AI',
    icon: '🏠',
    path: '/ai-development/real-estate',
    category: 'Industry Specific'
  },
  {
    slug: 'construction',
    title: 'Construction AI',
    description: 'Safety monitoring, progress tracking, cost estimation',
    icon: '🏗️',
    path: '/ai-development/construction',
    category: 'Industry Specific'
  },
  {
    slug: 'manufacturing',
    title: 'Manufacturing AI',
    description: 'Quality inspection, predictive maintenance, process optimization',
    icon: '🏭',
    path: '/ai-development/manufacturing',
    category: 'Industry Specific'
  },
  {
    slug: 'energy',
    title: 'Energy AI',
    description: 'Grid optimization, renewable forecasting, energy trading',
    icon: '⚡',
    path: '/ai-development/energy',
    category: 'Industry Specific'
  },
  {
    slug: 'agriculture',
    title: 'Agriculture AI',
    description: 'Crop yield prediction, precision agriculture, livestock AI',
    icon: '🌾',
    path: '/ai-development/agriculture',
    category: 'Industry Specific'
  },
  {
    slug: 'telecommunications',
    title: 'Telecommunications AI',
    description: 'Network optimization, 5G AI, churn prediction',
    icon: '📡',
    path: '/ai-development/telecommunications',
    category: 'Industry Specific'
  },

  // Media & Technology
  {
    slug: 'media-content',
    title: 'Media & Content AI',
    description: 'Content recommendation, personalization, ad targeting',
    icon: '🎬',
    path: '/ai-development/media-content',
    category: 'Media & Technology'
  },
  {
    slug: 'cybersecurity',
    title: 'Cybersecurity AI',
    description: 'Threat detection, SIEM AI, security copilots',
    icon: '🔒',
    path: '/ai-development/cybersecurity',
    category: 'Media & Technology'
  },

  // Public Sector
  {
    slug: 'government',
    title: 'Government AI',
    description: 'Federal AI, state government AI, fraud detection',
    icon: '🏛️',
    path: '/ai-development/government',
    category: 'Public Sector'
  },

  // Education
  {
    slug: 'education',
    title: 'Education AI',
    description: 'Personalized learning, adaptive assessments, AI tutors',
    icon: '📚',
    path: '/ai-development/education',
    category: 'Education'
  }
];

// ============================================
// CATEGORIES - Properly typed
// ============================================

export const serviceCategories: ServiceCategory[] = [
  {
    title: 'Financial Services',
    items: serviceNavigationItems.filter((item: ServiceNavItem) => item.category === 'Financial Services')
  },
  {
    title: 'Business Operations',
    items: serviceNavigationItems.filter((item: ServiceNavItem) => item.category === 'Business Operations')
  },
  {
    title: 'Commerce & Retail',
    items: serviceNavigationItems.filter((item: ServiceNavItem) => item.category === 'Commerce & Retail')
  },
  {
    title: 'Supply Chain & Logistics',
    items: serviceNavigationItems.filter((item: ServiceNavItem) => item.category === 'Supply Chain & Logistics')
  },
  {
    title: 'Industry Specific',
    items: serviceNavigationItems.filter((item: ServiceNavItem) => item.category === 'Industry Specific')
  },
  {
    title: 'Media & Technology',
    items: serviceNavigationItems.filter((item: ServiceNavItem) => item.category === 'Media & Technology')
  },
  {
    title: 'Public Sector',
    items: serviceNavigationItems.filter((item: ServiceNavItem) => item.category === 'Public Sector')
  },
  {
    title: 'Education',
    items: serviceNavigationItems.filter((item: ServiceNavItem) => item.category === 'Education')
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all slugs for static generation
 */
export function getAllServiceSlugs(): string[] {
  return serviceNavigationItems.map((item: ServiceNavItem) => item.slug);
}

/**
 * Get service by slug
 */
export function getServiceBySlug(slug: string): ServiceNavItem | undefined {
  return serviceNavigationItems.find((item: ServiceNavItem) => item.slug === slug);
}

/**
 * Get services by category
 */
export function getServicesByCategory(category: string): ServiceNavItem[] {
  return serviceNavigationItems.filter((item: ServiceNavItem) => item.category === category);
}