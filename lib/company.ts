import { SITE_URL } from "@/lib/site";

/**
 * Public company facts used by visible pages and JSON-LD.
 * Keep these in one place so the rendered contact details and
 * Organization schema cannot drift apart.
 */
export const COMPANY = {
  legalName: "ClickMasters Artificial Intelligence Company",
  brandName: "ClickMasters",
  email: "hello@clickmastersartificialintelligencecompany.com",
  telephone: "+1-800-555-0199",
  foundingYear: "2018",
  url: SITE_URL,
  logoPath: "/logo.png",
  address: {
    locality: "New York",
    region: "NY",
    country: "US",
    countryName: "United States",
  },
} as const;

export function companyLogoUrl(siteUrl: string = COMPANY.url) {
  return `${siteUrl}${COMPANY.logoPath}`;
}
