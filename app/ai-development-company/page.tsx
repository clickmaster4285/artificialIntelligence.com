// app/ai-development-company/page.tsx
import React from 'react';
import { PageLayout } from '@/components/locations/PageLayout';
import { HeroSection } from '@/components/locations/sections/Hero';
import { OverviewSection } from '@/components/locations/sections/Overview';
import { PricingSection } from '@/components/locations/sections/PricingTable';
import { FAQSection } from '@/components/locations/sections/Faq';
import { CTASection } from '@/components/locations/sections/Cta';
import { StatsSection } from '@/components/locations/sections/Stats';

export const metadata = {
  title: 'AI Development Company | ClickMasters AI',
  description: 'AI development company with locations across USA and Canada. Custom AI, RAG systems, LLM integration & AI agents. Fixed-price. Free consultation.',
  alternates: {
    canonical: '/ai-development-company/',
  },
};

export default function LocationOverviewPage() {
  return (
    <PageLayout withGrain>
      <HeroSection
        tagline="AI Development Company"
        title="AI Development Company — Custom AI Solutions Across North America"
        description="ClickMasters is a custom AI development company serving clients across the United States and Canada. We build production-ready AI systems — RAG knowledge platforms, LLM applications, AI agents, custom ML models, and generative AI applications — for enterprises and startups at every stage. Projects start at $20,000. Fixed-price milestone contracts. Full IP transfer."
        ctaText="Get a Free AI Consultation"
        ctaLink="/contact"
        startingPrice="$20,000"
        badge="Fixed-Price | Full IP | USA-Based"
        stats={[
          { label: 'Project Start', value: '$20,000', description: 'Focused integrations' },
          { label: 'Locations', value: '35+', description: 'Across US and Canada' },
          { label: 'Senior Engineers', value: '100%', description: 'USA & Canada based' },
        ]}
      />

      <OverviewSection
        title="Why Choose ClickMasters for AI Development"
        content="ClickMasters is a custom AI development company that builds production-ready AI systems for enterprises and startups. We specialize in RAG knowledge platforms, LLM applications, AI agents, custom ML models, and generative AI applications. Every engagement uses fixed-price milestone contracts, transfers full IP to you, and is delivered by senior engineers working in your timezone.\n\nOur clients choose us because we publish our pricing, we don't charge geographic premiums, and we have deep domain experience across FinTech, healthcare, eCommerce, legal, insurance, logistics, HR, real estate, retail, education, media, customer service, cybersecurity, agriculture, supply chain, energy, telecommunications, government, and construction."
        stats={[
          { label: 'Project Start', value: '$20,000', description: 'Focused integrations' },
          { label: 'Typical Range', value: '$20,000–$500,000', description: 'Full AI development projects' },
          { label: 'Timezones', value: 'Eastern to Pacific', description: 'US & Canada coverage' },
        ]}
      />

      <StatsSection
        title="AI Development Across North America"
        stats={[
          { label: 'US Locations', value: '30+', description: 'Major tech hubs' },
          { label: 'Canadian Locations', value: '4', description: 'Toronto, Vancouver, Calgary, Montreal' },
          { label: 'Timezones', value: '4', description: 'Eastern to Pacific' },
          { label: 'Industries', value: '19', description: 'Vertical expertise' },
        ]}
      />

      <PricingSection
        title="AI Development Pricing — 2026"
        description="ClickMasters delivers senior AI engineering at transparent, published rates with fixed-price milestone contracts."
        items={[
          { systemType: 'AI SaaS Product (MVP)', priceRange: '$70,000–$250,000', timeline: '16–32 weeks', primaryOutcome: 'Pre-Series A/B AI product companies' },
          { systemType: 'Generative AI Application', priceRange: '$40,000–$180,000', timeline: '12–24 weeks', primaryOutcome: 'GenAI feature products, AI-native startups' },
          { systemType: 'RAG / Knowledge System', priceRange: '$25,000–$80,000', timeline: '8–14 weeks', primaryOutcome: 'Enterprise knowledge management' },
          { systemType: 'AI Agent System', priceRange: '$35,000–$120,000', timeline: '10–20 weeks', primaryOutcome: 'Autonomous workflow agents' },
          { systemType: 'Custom ML Model', priceRange: '$30,000–$120,000', timeline: '10–20 weeks', primaryOutcome: 'Prediction and classification products' },
          { systemType: 'LLM Integration', priceRange: '$20,000–$80,000', timeline: '6–14 weeks', primaryOutcome: 'SaaS product AI features' },
          { systemType: 'Computer Vision', priceRange: '$45,000–$160,000', timeline: '12–22 weeks', primaryOutcome: 'Robotics, retail, manufacturing' },
          { systemType: 'Dedicated AI Engineer', priceRange: '$10,000–$22,000/month', timeline: '2-week start', primaryOutcome: 'Ongoing development' },
        ]}
        note="Prices vary based on data quality, integration complexity, and compliance requirements."
      />

      <FAQSection
        items={[
          {
            question: 'What is an AI development company?',
            answer: 'An AI development company builds custom AI systems for businesses — RAG knowledge bases, LLM applications, AI agents, custom ML models, and generative AI applications. ClickMasters builds production-ready AI systems with fixed-price contracts and full IP transfer.'
          },
          {
            question: 'How much does AI development cost?',
            answer: 'AI development at ClickMasters starts at $20,000 for focused integrations and scales to $500,000+ for enterprise platforms. Most first AI projects cost $30,000–$120,000. See our full pricing guide for detailed breakdowns by project type.'
          },
          {
            question: 'What industries does ClickMasters serve?',
            answer: 'ClickMasters serves FinTech, healthcare, eCommerce, legal, insurance, logistics, HR, real estate, retail, education, media, customer service, cybersecurity, agriculture, supply chain, energy, telecommunications, government, and construction.'
          },
          {
            question: 'Where is ClickMasters located?',
            answer: 'ClickMasters serves clients across the United States and Canada with remote-first engineering teams operating in Eastern, Central, Mountain, and Pacific timezones. We have served clients in every major US and Canadian tech hub.'
          },
        ]}
      />

      <CTASection
        title="Ready to Start Your AI Project?"
        description="Get a free AI consultation with a senior ClickMasters AI architect. We'll assess your requirements, provide honest technical guidance, and give you a clear path forward."
        ctaText="Book Your Free Consultation"
        ctaLink="/contact"
        secondaryText="24-hour response • 2-week start"
      />
    </PageLayout>
  );
}