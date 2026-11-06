import { SITE_URL } from "@/lib/site";

/**
 * Public company facts used by visible pages and JSON-LD.
 * Phone numbers are the verified contact lines. No street address or
 * founding year is published here, because neither has been verified.
 */
export const COMPANY = {
  legalName: "ClickMasters Artificial Intelligence Company",
  brandName: "ClickMasters",
  email: "hello@clickmastersartificialintelligencecompany.com",
  phones: [
    {
      region: "United Kingdom",
      regionCode: "GB",
      display: "+44 7988 576086",
      tel: "+447988576086",
    },
    {
      region: "United States",
      regionCode: "US",
      display: "+1 325 202 4074",
      tel: "+13252024074",
    },
    {
      region: "Pakistan",
      regionCode: "PK",
      display: "+92 332 5394285",
      tel: "+923325394285",
    },
  ],
  url: SITE_URL,
  logoPath: "/logo.png",
} as const;

export function companyLogoUrl(siteUrl: string = COMPANY.url) {
  return `${siteUrl}${COMPANY.logoPath}`;
}

export function companyContactPoints() {
  return COMPANY.phones.map((phone) => ({
    "@type": "ContactPoint" as const,
    telephone: phone.display,
    contactType: "customer support",
    areaServed: phone.regionCode,
    availableLanguage: ["English"],
  }));
}
