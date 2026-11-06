"use client";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

import Link from "next/link";

import type {
  GlossaryCategory,
} from "@/types/glossary";

import {
  GLOSSARY_ALPHABET,
} from "@/lib/glossary/glossary-filter";

import { cn } from "@/lib/utils";

/* =========================================================
   TYPES
========================================================= */

interface CategoryFilterItem {
  category:
    | GlossaryCategory
    | "All";
  count: number;
}

interface GlossaryFiltersProps {
  activeLetter?: string;
  activeCategory?: string;
  searchQuery?: string;
  activeLetters: string[];
  categories: CategoryFilterItem[];
  totalResults: number;
}

/* =========================================================
   URL BUILDER
========================================================= */

function createFilterUrl({
  search,
  letter,
  category,
}: {
  search?: string;
  letter?: string;
  category?: string;
}): string {
  const searchParams =
    new URLSearchParams();

  if (search?.trim()) {
    searchParams.set(
      "search",
      search.trim(),
    );
  }

  if (
    letter &&
    letter.toUpperCase() !== "ALL"
  ) {
    searchParams.set(
      "letter",
      letter.toUpperCase(),
    );
  }

  if (
    category &&
    category.toLowerCase() !== "all"
  ) {
    searchParams.set(
      "category",
      category,
    );
  }

  const queryString =
    searchParams.toString();

  return queryString
    ? `/glossary?${queryString}`
    : "/glossary";
}

/* =========================================================
   COMPONENT
========================================================= */

export function GlossaryFilters({
  activeLetter = "ALL",
  activeCategory = "All",
  searchQuery = "",
  activeLetters,
  categories,
  totalResults,
}: GlossaryFiltersProps) {
  const reduceMotion = useReducedMotion();

  const normalizedActiveLetter =
    activeLetter.toUpperCase();

  const normalizedActiveCategory =
    activeCategory.toLowerCase();

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    normalizedActiveLetter !==
      "ALL" ||
    normalizedActiveCategory !==
      "all";

  return (
    <motion.div
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 24,
              filter: "blur(8px)",
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.7,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className={cn(
        "relative",
        "overflow-hidden",
        "rounded-3xl",
        "border border-white/[0.08]",
        "bg-white/[0.025]",
        "p-4",
        "shadow-[0_30px_100px_-65px_rgba(139,92,246,0.85)]",
        "backdrop-blur-2xl",
        "sm:p-5",
      )}
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none",
          "absolute -right-20 -top-20",
          "h-52 w-52",
          "rounded-full",
          "bg-violet-500/10",
          "blur-[80px]",
        )}
      />

      {/* Header */}
      <div
        className={cn(
          "relative z-10",
          "flex flex-wrap",
          "items-center",
          "justify-between",
          "gap-4",
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "grid h-9 w-9",
              "place-items-center",
              "rounded-xl",
              "border border-violet-400/15",
              "bg-violet-400/[0.07]",
            )}
          >
            <SlidersHorizontal
              aria-hidden="true"
              className="h-4 w-4 text-violet-300"
            />
          </span>

          <div>
            <h2
              className={cn(
                "text-sm",
                "font-semibold",
                "text-white/85",
              )}
            >
              Refine the index
            </h2>

            <p
              className={cn(
                "mt-0.5",
                "text-xs",
                "text-white/35",
              )}
            >
              {totalResults}{" "}
              {totalResults === 1
                ? "term"
                : "terms"}{" "}
              found
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <Link
            href="/glossary"
            className={cn(
              "inline-flex",
              "items-center gap-2",
              "rounded-full",
              "border border-white/[0.08]",
              "bg-white/[0.025]",
              "px-3 py-2",
              "text-xs",
              "text-white/45",
              "transition-all",
              "duration-300",
              "hover:border-violet-400/25",
              "hover:bg-violet-400/[0.08]",
              "hover:text-white/80",
            )}
          >
            <RotateCcw
              aria-hidden="true"
              className="h-3.5 w-3.5"
            />

            Reset filters
          </Link>
        )}
      </div>

      {/* Alphabet filter */}
      <div className="relative z-10 mt-5">
        <span
          className={cn(
            "mb-2.5 block",
            "text-[0.6rem]",
            "font-semibold uppercase",
            "tracking-[0.17em]",
            "text-white/30",
          )}
        >
          Browse alphabetically
        </span>

        <div
          className={cn(
            "flex flex-wrap gap-1.5",
          )}
        >
          <Link
            href={createFilterUrl({
              search: searchQuery,
              category:
                activeCategory,
            })}
            rel="nofollow"
            aria-current={
              normalizedActiveLetter ===
              "ALL"
                ? "page"
                : undefined
            }
            className={cn(
              "grid h-9 min-w-12",
              "place-items-center",
              "rounded-lg",
              "border",
              "px-3",
              "text-[0.66rem]",
              "font-semibold uppercase",
              "tracking-[0.1em]",
              "transition-all",
              "duration-300",
              normalizedActiveLetter ===
                "ALL"
                ? [
                    "border-violet-400/35",
                    "bg-violet-400/15",
                    "text-violet-100",
                    "shadow-[0_0_24px_rgba(139,92,246,0.13)]",
                  ].join(" ")
                : [
                    "border-white/[0.07]",
                    "bg-white/[0.02]",
                    "text-white/38",
                    "hover:border-white/[0.14]",
                    "hover:bg-white/[0.045]",
                    "hover:text-white/75",
                  ].join(" "),
            )}
          >
            All
          </Link>

          {GLOSSARY_ALPHABET.map(
            (letter) => {
              const isAvailable =
                activeLetters.includes(
                  letter,
                );

              const isActive =
                normalizedActiveLetter ===
                letter;

              if (!isAvailable) {
                return (
                  <span
                    key={letter}
                    aria-disabled="true"
                    className={cn(
                      "grid h-9 w-9",
                      "cursor-not-allowed",
                      "place-items-center",
                      "rounded-lg",
                      "border border-white/[0.035]",
                      "bg-transparent",
                      "text-xs font-semibold",
                      "text-white/12",
                    )}
                  >
                    {letter}
                  </span>
                );
              }

              return (
                <Link
                  key={letter}
                  href={createFilterUrl({
                    search: searchQuery,
                    letter,
                    category:
                      activeCategory,
                  })}
                  rel="nofollow"
                  aria-current={
                    isActive
                      ? "page"
                      : undefined
                  }
                  className={cn(
                    "grid h-9 w-9",
                    "place-items-center",
                    "rounded-lg",
                    "border",
                    "text-xs font-semibold",
                    "transition-all",
                    "duration-300",
                    isActive
                      ? [
                          "border-cyan-300/35",
                          "bg-cyan-300/[0.12]",
                          "text-cyan-100",
                          "shadow-[0_0_22px_rgba(34,211,238,0.12)]",
                        ].join(" ")
                      : [
                          "border-white/[0.07]",
                          "bg-white/[0.02]",
                          "text-white/42",
                          "hover:-translate-y-0.5",
                          "hover:border-violet-400/25",
                          "hover:bg-violet-400/[0.07]",
                          "hover:text-white/80",
                        ].join(" "),
                  )}
                >
                  {letter}
                </Link>
              );
            },
          )}
        </div>
      </div>

      {/* Category filters */}
      <div className="relative z-10 mt-5">
        <span
          className={cn(
            "mb-2.5 block",
            "text-[0.6rem]",
            "font-semibold uppercase",
            "tracking-[0.17em]",
            "text-white/30",
          )}
        >
          Filter by category
        </span>

        <div className="flex flex-wrap gap-2">
          {categories.map(
            ({ category, count }) => {
              const isActive =
                normalizedActiveCategory ===
                category.toLowerCase();

              return (
                <Link
                  key={category}
                  href={createFilterUrl({
                    search: searchQuery,
                    letter:
                      activeLetter,
                    category,
                  })}
                  rel="nofollow"
                  aria-current={
                    isActive
                      ? "page"
                      : undefined
                  }
                  className={cn(
                    "inline-flex",
                    "items-center gap-2",
                    "rounded-full",
                    "border",
                    "px-3 py-2",
                    "text-xs",
                    "transition-all",
                    "duration-300",
                    isActive
                      ? [
                          "border-violet-400/30",
                          "bg-violet-400/[0.12]",
                          "text-violet-100",
                        ].join(" ")
                      : [
                          "border-white/[0.07]",
                          "bg-white/[0.02]",
                          "text-white/38",
                          "hover:border-white/[0.14]",
                          "hover:bg-white/[0.045]",
                          "hover:text-white/70",
                        ].join(" "),
                  )}
                >
                  <span>{category}</span>

                  <span
                    className={cn(
                      "grid min-w-5",
                      "place-items-center",
                      "rounded-full",
                      "bg-black/25",
                      "px-1.5 py-0.5",
                      "font-mono",
                      "text-[0.58rem]",
                      isActive
                        ? "text-violet-100/70"
                        : "text-white/25",
                    )}
                  >
                    {count}
                  </span>
                </Link>
              );
            },
          )}
        </div>
      </div>
    </motion.div>
  );
}