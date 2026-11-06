/**
 * City pages that exist at both URL shapes. The permanent URL is the
 * nested path. The flat path is a permanent redirect.
 *
 * /ai-development-company/phoenix
 * /ai-development-company-phoenix  -> 301
 */
export const DUPLICATE_CITY_SLUGS = [
  "atlanta",
  "austin",
  "boston",
  "chicago",
  "denver",
  "houston",
  "los-angeles",
  "miami",
  "minneapolis",
  "nashville",
  "new-york",
  "phoenix",
  "portland",
  "salt-lake-city",
  "san-diego",
  "san-francisco",
  "seattle",
  "tampa",
  "washington-dc",
] as const;

export function flatCityPageSlug(city: string) {
  return `ai-development-company-${city}`;
}

export function nestedCityPath(city: string) {
  return `/ai-development-company/${city}`;
}

const duplicateFlatSlugs = new Set(
  DUPLICATE_CITY_SLUGS.map((city) => flatCityPageSlug(city)),
);

export function isDuplicateFlatCityPage(slug: string) {
  return duplicateFlatSlugs.has(slug);
}

export function duplicateCityRedirects() {
  return DUPLICATE_CITY_SLUGS.map((city) => ({
    source: `/${flatCityPageSlug(city)}`,
    destination: nestedCityPath(city),
    statusCode: 301 as const,
  }));
}
