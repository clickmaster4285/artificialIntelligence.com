import {
  ExternalLink,
} from "lucide-react";

import type {
  GlossaryCardData,
  GlossaryTerm,
} from "@/types/glossary";

import { cn } from "@/lib/utils";

import { GlossaryDetailHero } from "./detail/GlossaryDetailHero";
import { BreadcrumbTrail } from "@/components/site/PageContextLinks";
import { GlossaryTableOfContents } from "./detail/GlossaryTableOfContents";
import { GlossaryArticle } from "./detail/GlossaryArticle";
import { GlossaryFaqSection } from "./detail/GlossaryFaqSection";
import { RelatedGlossaryTerms } from "./detail/RelatedGlossaryTerms";
import { GlossaryAdjacentNavigation } from "./detail/GlossaryAdjacentNavigation";
import { GlossaryDetailCta } from "./detail/GlossaryDetailCta";

/* =========================================================
   TYPES
========================================================= */

interface GlossaryDetailPageProps {
  term: GlossaryTerm;

  relatedTerms?: GlossaryCardData[];

  previousTerm?: GlossaryCardData;

  nextTerm?: GlossaryCardData;
}

/* =========================================================
   REFERENCES
========================================================= */

function GlossaryReferences({
  term,
}: {
  term: GlossaryTerm;
}) {
  if (!term.references?.length) {
    return null;
  }

  return (
    <section
      aria-labelledby="glossary-references-title"
      className={cn(
        "border-t",
        "border-white/[0.07]",
        "pt-8",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={cn(
            "h-px w-8",
            "bg-[linear-gradient(90deg,#8b5cf6,transparent)]",
          )}
        />

        <span
          className={cn(
            "text-[0.6rem]",
            "font-semibold uppercase",
            "tracking-[0.18em]",
            "text-violet-300/60",
          )}
        >
          Further reading
        </span>
      </div>

      <h2
        id="glossary-references-title"
        className={cn(
          "mt-3",
          "text-2xl",
          "font-semibold",
          "tracking-[-0.04em]",
          "text-white/88",
          "sm:text-3xl",
        )}
      >
        References and sources
      </h2>

      <ul className="mt-5 grid gap-3">
        {term.references.map(
          (reference, index) => (
            <li
              key={`${reference.href}-${index}`}
            >
              <a
                href={reference.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group/reference",
                  "flex items-start",
                  "justify-between",
                  "gap-4",
                  "rounded-2xl",
                  "border border-white/[0.065]",
                  "bg-white/[0.02]",
                  "px-4 py-4",
                  "transition-all",
                  "duration-300",
                  "hover:-translate-y-0.5",
                  "hover:border-violet-400/20",
                  "hover:bg-violet-400/[0.035]",
                )}
              >
                <div>
                  <span
                    className={cn(
                      "block",
                      "text-sm",
                      "font-medium",
                      "leading-[1.55]",
                      "text-white/58",
                      "transition-colors",
                      "group-hover/reference:text-white/80",
                    )}
                  >
                    {reference.label}
                  </span>

                  {reference.publisher && (
                    <span
                      className={cn(
                        "mt-1.5 block",
                        "text-xs",
                        "text-white/25",
                      )}
                    >
                      {
                        reference.publisher
                      }
                    </span>
                  )}
                </div>

                <ExternalLink
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 h-4 w-4",
                    "shrink-0",
                    "text-white/20",
                    "transition-all",
                    "group-hover/reference:-translate-y-0.5",
                    "group-hover/reference:translate-x-0.5",
                    "group-hover/reference:text-violet-300",
                  )}
                />
              </a>
            </li>
          ),
        )}
      </ul>
    </section>
  );
}

/* =========================================================
   MAIN DETAIL PAGE
========================================================= */

export function GlossaryDetailPage({
  term,
  relatedTerms = [],
  previousTerm,
  nextTerm,
}: GlossaryDetailPageProps) {
  return (
    <div
      className={cn(
        "min-h-screen",
        "bg-[#030305]",
        "text-white",
      )}
    >
      <BreadcrumbTrail
        className="px-5 pt-6 text-white/70 sm:px-8 lg:px-12 [&_span]:text-white"
        items={[
          { href: "/", label: "Home" },
          { href: "/glossary", label: "AI Glossary" },
          { label: term.title },
        ]}
      />

      {/* Detail hero */}
      <GlossaryDetailHero
        term={term}
      />

      {/* Article area */}
      <section
        className={cn(
          "relative isolate",
          "overflow-visible",
          "border-b border-white/[0.065]",
          "bg-[#050507]",
          "px-5 py-12",
          "sm:px-8 sm:py-16",
          "lg:px-12 lg:py-20",
        )}
      >
        {/* Violet ambient glow */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none",
            "absolute -left-72 top-36",
            "h-[560px] w-[560px]",
            "rounded-full",
            "bg-violet-500/[0.06]",
            "blur-[155px]",
          )}
        />

        {/* Cyan ambient glow */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none",
            "absolute -right-72 top-[45%]",
            "h-[560px] w-[560px]",
            "rounded-full",
            "bg-cyan-400/[0.045]",
            "blur-[160px]",
          )}
        />

        {/* Faint grid */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none",
            "absolute inset-0",
            "opacity-[0.12]",
            "bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)]",
            "bg-[size:80px_80px]",
            "[mask-image:linear-gradient(to_bottom,black,transparent_90%)]",
          )}
        />

        <div
          className={cn(
            "relative z-10",
            "mx-auto",
            "max-w-[1440px]",
          )}
        >
          <div
            className={cn(
              "grid grid-cols-1",
              "gap-10",
              "lg:grid-cols-[280px_minmax(0,1fr)]",
              "lg:items-start",
              "lg:gap-12",
              "xl:grid-cols-[310px_minmax(0,1fr)]",
              "xl:gap-16",
            )}
          >
            {/* Sticky table of contents */}
            <div
              className={cn(
                "lg:sticky",
                "lg:top-28",
              )}
            >
              <GlossaryTableOfContents
                sections={
                  term.sections
                }
              />
            </div>

            {/* Main readable column */}
            <div
              className={cn(
                "min-w-0",
                "max-w-[930px]",
              )}
            >
              <GlossaryArticle
                sections={
                  term.sections
                }
              />

              {/* FAQ */}
              {term.faqs &&
                term.faqs.items.length >
                  0 && (
                  <GlossaryFaqSection
                    faqs={term.faqs}
                    className={cn(
                      "mt-14",
                      "border-t",
                      "border-white/[0.07]",
                      "pt-12",
                      "sm:mt-16",
                      "sm:pt-14",
                    )}
                  />
                )}

              {/* References */}
              <GlossaryReferences
                term={term}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Related content area */}
      <section
        className={cn(
          "relative isolate",
          "overflow-hidden",
          "border-b border-white/[0.065]",
          "bg-[#030305]",
          "px-5 py-12",
          "sm:px-8 sm:py-16",
          "lg:px-12 lg:py-20",
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none",
            "absolute left-1/2 top-0",
            "h-[420px] w-[720px]",
            "-translate-x-1/2",
            "rounded-full",
            "bg-violet-500/[0.065]",
            "blur-[150px]",
          )}
        />

        <div
          className={cn(
            "relative z-10",
            "mx-auto",
            "max-w-[1440px]",
          )}
        >
          {/* Related terms */}
          <RelatedGlossaryTerms
            terms={relatedTerms}
          />

          {/* Previous/next */}
          <GlossaryAdjacentNavigation
            previous={previousTerm}
            next={nextTerm}
            className={
              relatedTerms.length > 0
                ? "mt-14"
                : undefined
            }
          />

          {/* CTA */}
          {term.cta && (
            <GlossaryDetailCta
              cta={term.cta}
              className={cn(
                relatedTerms.length >
                  0 ||
                  previousTerm ||
                  nextTerm
                  ? "mt-14"
                  : undefined,
              )}
            />
          )}
        </div>
      </section>
    </div>
  );
}