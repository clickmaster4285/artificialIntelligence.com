import "server-only";

import {
  readdirSync,
  readFileSync,
} from "node:fs";

import {
  join,
} from "node:path";

import type {
  GlossaryCardData,
  GlossaryCategory,
  GlossaryTerm,
} from "@/types/glossary";

/* =========================================================
   RAW GLOSSARY DATA
========================================================= */

const glossaryTermsDirectory = join(
  process.cwd(),
  "content",
  "glossary",
  "terms",
);

let glossaryTermCache: GlossaryTerm[] | null = null;
let publishedGlossaryCache: GlossaryTerm[] | null = null;
let glossaryTermMap: Map<string, GlossaryTerm> | null = null;

function readGlossaryTermFiles(): GlossaryTerm[] {
  if (glossaryTermCache) {
    return glossaryTermCache;
  }

  glossaryTermCache = readdirSync(
    glossaryTermsDirectory,
  )
    .filter((fileName) =>
      fileName
        .toLowerCase()
        .endsWith(".json"),
    )
    .sort((firstFile, secondFile) =>
      firstFile.localeCompare(
        secondFile,
        "en",
        {
          sensitivity: "base",
        },
      ),
    )
    .map((fileName) => {
      const filePath = join(
        glossaryTermsDirectory,
        fileName,
      );

      const fileContents =
        readFileSync(
          filePath,
          "utf8",
        );

      try {
        return JSON.parse(
          fileContents,
        ) as GlossaryTerm;
      } catch (error) {
        throw new Error(
          `[Glossary] Failed to parse ${fileName}: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`,
        );
      }
    });

  return glossaryTermCache;
}

/* =========================================================
   NORMALIZED GLOSSARY TERMS
========================================================= */

export function getGlossaryTerms(): GlossaryTerm[] {
  return readGlossaryTermFiles();
}

/* =========================================================
   PUBLISHED TERMS
========================================================= */

export function getPublishedGlossaryTerms(): GlossaryTerm[] {
  if (publishedGlossaryCache) {
    return publishedGlossaryCache;
  }

  publishedGlossaryCache = getGlossaryTerms()
    .filter(
      (term) =>
        term.status === "published",
    )
    .sort((firstTerm, secondTerm) =>
      firstTerm.title.localeCompare(
        secondTerm.title,
        "en",
        {
          sensitivity: "base",
        },
      ),
    );

  glossaryTermMap = new Map(
    publishedGlossaryCache.map((term) => [
      normalizeGlossarySlug(term.slug),
      term,
    ]),
  );

  return publishedGlossaryCache;
}

/* =========================================================
   TERM MAP
========================================================= */

/**
 * Map gives fast slug lookup for the current terms folder.
 */

function getGlossaryTermMap() {
  if (!glossaryTermMap) {
    getPublishedGlossaryTerms();
  }

  return glossaryTermMap ?? new Map();
}

/* =========================================================
   HELPERS
========================================================= */

/**
 * Clean user-provided or route-provided slug.
 */
export function normalizeGlossarySlug(
  slug: string,
): string {
  return decodeURIComponent(slug)
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
}

/**
 * Find one published glossary term by slug.
 */
export function getGlossaryTermBySlug(
  slug: string,
): GlossaryTerm | undefined {
  const normalizedSlug =
    normalizeGlossarySlug(slug);

  return getGlossaryTermMap().get(
    normalizedSlug,
  );
}

/**
 * Get slugs for generateStaticParams().
 */
export function getAllGlossarySlugs(): string[] {
  return getPublishedGlossaryTerms().map(
    (term) => term.slug,
  );
}

/**
 * Lightweight card-safe term data.
 */
export function getGlossaryCardData(
  term: GlossaryTerm,
): GlossaryCardData {
  return {
    slug: term.slug,
    title: term.title,
    shortTitle: term.shortTitle,
    abbreviation: term.abbreviation,
    letter: term.letter,
    category: term.category,
    shortDefinition:
      term.shortDefinition,
    featured: term.featured,
    readingTime: term.readingTime,
  };
}

/**
 * All published terms formatted for cards.
 */
export function getAllGlossaryCards(): GlossaryCardData[] {
  return getPublishedGlossaryTerms().map(
    getGlossaryCardData,
  );
}

/**
 * Featured glossary cards.
 */
export function getFeaturedGlossaryTerms(): GlossaryCardData[] {
  return getPublishedGlossaryTerms()
    .filter((term) => term.featured)
    .map(getGlossaryCardData);
}

/**
 * Find terms by their first letter.
 */
export function getGlossaryTermsByLetter(
  letter: string,
): GlossaryTerm[] {
  const normalizedLetter =
    letter.trim().toUpperCase();

  return getPublishedGlossaryTerms().filter(
    (term) =>
      term.letter.toUpperCase() ===
      normalizedLetter,
  );
}

/**
 * Find terms by category.
 */
export function getGlossaryTermsByCategory(
  category: GlossaryCategory,
): GlossaryTerm[] {
  return getPublishedGlossaryTerms().filter(
    (term) =>
      term.category === category,
  );
}

/**
 * Get every category that currently contains
 * at least one published term.
 */
export function getAvailableGlossaryCategories(): GlossaryCategory[] {
  return Array.from(
    new Set(
      getPublishedGlossaryTerms().map(
        (term) => term.category,
      ),
    ),
  ).sort((firstCategory, secondCategory) =>
    firstCategory.localeCompare(
      secondCategory,
    ),
  );
}

/**
 * Return related terms in the same order
 * as the relatedTerms slug array.
 *
 * Missing/unpublished slugs are safely ignored.
 */
export function getRelatedGlossaryTerms(
  term: GlossaryTerm,
): GlossaryCardData[] {
  if (!term.relatedTerms?.length) {
    return [];
  }

  return term.relatedTerms
    .map((relatedSlug) =>
      getGlossaryTermBySlug(
        relatedSlug,
      ),
    )
    .filter(
      (
        relatedTerm,
      ): relatedTerm is GlossaryTerm =>
        Boolean(relatedTerm),
    )
    .map(getGlossaryCardData);
}

/**
 * Get previous and next terms alphabetically.
 */
export function getAdjacentGlossaryTerms(
  currentSlug: string,
): {
  previous?: GlossaryCardData;
  next?: GlossaryCardData;
} {
  const normalizedSlug =
    normalizeGlossarySlug(
      currentSlug,
    );

  const publishedTerms =
    getPublishedGlossaryTerms();

  const currentIndex =
    publishedTerms.findIndex(
      (term) =>
        term.slug === normalizedSlug,
    );

  if (currentIndex === -1) {
    return {};
  }

  const previousTerm =
    publishedTerms[
      currentIndex - 1
    ];

  const nextTerm =
    publishedTerms[
      currentIndex + 1
    ];

  return {
    previous: previousTerm
      ? getGlossaryCardData(
          previousTerm,
        )
      : undefined,

    next: nextTerm
      ? getGlossaryCardData(nextTerm)
      : undefined,
  };
}

/* =========================================================
   VALIDATION
========================================================= */

/**
 * Development-time validation for duplicate slugs.
 */
function validateGlossaryTerms(): void {
  if (
    process.env.NODE_ENV ===
    "production"
  ) {
    return;
  }

  const usedSlugs = new Set<string>();

  for (const term of getGlossaryTerms()) {
    const normalizedSlug =
      normalizeGlossarySlug(term.slug);

    if (usedSlugs.has(normalizedSlug)) {
      throw new Error(
        `[Glossary] Duplicate slug detected: "${normalizedSlug}"`,
      );
    }

    usedSlugs.add(normalizedSlug);

    if (
      term.letter.length !== 1
    ) {
      throw new Error(
        `[Glossary] Term "${term.title}" must have a single-character letter.`,
      );
    }

    if (
      !term.seo?.title ||
      !term.seo?.description ||
      !term.seo?.canonical
    ) {
      throw new Error(
        `[Glossary] SEO data is incomplete for "${term.slug}".`,
      );
    }

    const expectedCanonical =
      `/glossary/${normalizedSlug}/`;

    if (
      term.seo.canonical !==
      expectedCanonical
    ) {
      console.warn(
        `[Glossary] Canonical mismatch for "${term.slug}". Expected "${expectedCanonical}", received "${term.seo.canonical}".`,
      );
    }
  }
}

validateGlossaryTerms();
