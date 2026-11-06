"use client";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import Link from "next/link";

import type {
  GlossaryPagination as GlossaryPaginationData,
} from "@/types/glossary";

import { cn } from "@/lib/utils";

/* =========================================================
   TYPES
========================================================= */

interface GlossaryPaginationProps {
  pagination: GlossaryPaginationData;
  searchQuery?: string;
  activeLetter?: string;
  activeCategory?: string;
}

type PaginationItem =
  | number
  | "ellipsis-start"
  | "ellipsis-end";

/* =========================================================
   URL BUILDER
========================================================= */

function createPaginationUrl({
  page,
  search,
  letter,
  category,
}: {
  page: number;
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

  if (page > 1) {
    searchParams.set(
      "page",
      String(page),
    );
  }

  const queryString =
    searchParams.toString();

  return queryString
    ? `/glossary?${queryString}`
    : "/glossary";
}

/* =========================================================
   PAGE NUMBER GENERATOR
========================================================= */

function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from(
      {
        length: totalPages,
      },
      (_, index) => index + 1,
    );
  }

  if (currentPage <= 4) {
    return [
      1,
      2,
      3,
      4,
      5,
      "ellipsis-end",
      totalPages,
    ];
  }

  if (
    currentPage >=
    totalPages - 3
  ) {
    return [
      1,
      "ellipsis-start",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis-start",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-end",
    totalPages,
  ];
}

/* =========================================================
   COMPONENT
========================================================= */

export function GlossaryPagination({
  pagination,
  searchQuery = "",
  activeLetter = "ALL",
  activeCategory = "All",
}: GlossaryPaginationProps) {
  const reduceMotion = useReducedMotion();

  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasPreviousPage,
    hasNextPage,
  } = pagination;

  if (
    totalPages <= 1 ||
    totalItems === 0
  ) {
    return null;
  }

  const paginationItems =
    getPaginationItems(
      currentPage,
      totalPages,
    );

  const firstVisibleItem =
    (currentPage - 1) *
      itemsPerPage +
    1;

  const lastVisibleItem = Math.min(
    currentPage * itemsPerPage,
    totalItems,
  );

  return (
    <motion.nav
      aria-label="Glossary pagination"
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 20,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.3,
      }}
      transition={{
        duration: 0.65,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className={cn(
        "mt-10",
        "flex flex-col",
        "items-center",
        "justify-between",
        "gap-5",
        "border-t border-white/[0.07]",
        "pt-7",
        "sm:flex-row",
      )}
    >
      {/* Result information */}
      <p
        className={cn(
          "text-xs",
          "text-white/32",
        )}
      >
        Showing{" "}
        <span className="font-semibold text-white/65">
          {firstVisibleItem}
        </span>
        {"–"}
        <span className="font-semibold text-white/65">
          {lastVisibleItem}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-white/65">
          {totalItems}
        </span>{" "}
        terms
      </p>

      {/* Pagination controls */}
      <div className="flex items-center gap-1.5">
        {hasPreviousPage ? (
          <Link
            href={createPaginationUrl({
              page: currentPage - 1,
              search: searchQuery,
              letter: activeLetter,
              category:
                activeCategory,
            })}
            rel="nofollow"
            aria-label="Go to previous glossary page"
            className={cn(
              "group/previous",
              "mr-1",
              "inline-flex h-10",
              "items-center",
              "justify-center gap-2",
              "rounded-xl",
              "border border-white/[0.08]",
              "bg-white/[0.025]",
              "px-3",
              "text-xs",
              "text-white/50",
              "transition-all",
              "duration-300",
              "hover:border-violet-400/25",
              "hover:bg-violet-400/[0.08]",
              "hover:text-white",
            )}
          >
            <ArrowLeft
              aria-hidden="true"
              className={cn(
                "h-3.5 w-3.5",
                "transition-transform",
                "group-hover/previous:-translate-x-0.5",
              )}
            />

            <span className="hidden sm:inline">
              Previous
            </span>
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className={cn(
              "mr-1",
              "inline-flex h-10",
              "cursor-not-allowed",
              "items-center",
              "justify-center gap-2",
              "rounded-xl",
              "border border-white/[0.04]",
              "px-3",
              "text-xs",
              "text-white/15",
            )}
          >
            <ArrowLeft
              aria-hidden="true"
              className="h-3.5 w-3.5"
            />

            <span className="hidden sm:inline">
              Previous
            </span>
          </span>
        )}

        {paginationItems.map(
          (item) => {
            if (
              item ===
                "ellipsis-start" ||
              item === "ellipsis-end"
            ) {
              return (
                <span
                  key={item}
                  aria-hidden="true"
                  className={cn(
                    "grid h-10 w-7",
                    "place-items-center",
                    "text-sm",
                    "text-white/22",
                  )}
                >
                  …
                </span>
              );
            }

            const isCurrent =
              item === currentPage;

            return (
              <Link
                key={item}
                href={createPaginationUrl({
                  page: item,
                  search:
                    searchQuery,
                  letter:
                    activeLetter,
                  category:
                    activeCategory,
                })}
                rel="nofollow"
                aria-label={`Go to glossary page ${item}`}
                aria-current={
                  isCurrent
                    ? "page"
                    : undefined
                }
                className={cn(
                  "relative grid",
                  "h-10 w-10",
                  "place-items-center",
                  "overflow-hidden",
                  "rounded-xl",
                  "border",
                  "text-xs font-semibold",
                  "transition-all",
                  "duration-300",
                  isCurrent
                    ? [
                        "border-violet-400/35",
                        "bg-violet-400/15",
                        "text-white",
                        "shadow-[0_0_25px_rgba(139,92,246,0.15)]",
                      ].join(" ")
                    : [
                        "border-white/[0.07]",
                        "bg-white/[0.02]",
                        "text-white/38",
                        "hover:-translate-y-0.5",
                        "hover:border-white/[0.14]",
                        "hover:bg-white/[0.045]",
                        "hover:text-white/75",
                      ].join(" "),
                )}
              >
                {isCurrent && (
                  <motion.span
                    layoutId="active-glossary-page"
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-0",
                      "bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.18),transparent_72%)]",
                    )}
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 28,
                    }}
                  />
                )}

                <span className="relative z-10">
                  {item}
                </span>
              </Link>
            );
          },
        )}

        {hasNextPage ? (
          <Link
            href={createPaginationUrl({
              page: currentPage + 1,
              search: searchQuery,
              letter: activeLetter,
              category:
                activeCategory,
            })}
            rel="nofollow"
            aria-label="Go to next glossary page"
            className={cn(
              "group/next",
              "ml-1",
              "inline-flex h-10",
              "items-center",
              "justify-center gap-2",
              "rounded-xl",
              "border border-white/[0.08]",
              "bg-white/[0.025]",
              "px-3",
              "text-xs",
              "text-white/50",
              "transition-all",
              "duration-300",
              "hover:border-cyan-300/25",
              "hover:bg-cyan-300/[0.07]",
              "hover:text-white",
            )}
          >
            <span className="hidden sm:inline">
              Next
            </span>

            <ArrowRight
              aria-hidden="true"
              className={cn(
                "h-3.5 w-3.5",
                "transition-transform",
                "group-hover/next:translate-x-0.5",
              )}
            />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className={cn(
              "ml-1",
              "inline-flex h-10",
              "cursor-not-allowed",
              "items-center",
              "justify-center gap-2",
              "rounded-xl",
              "border border-white/[0.04]",
              "px-3",
              "text-xs",
              "text-white/15",
            )}
          >
            <span className="hidden sm:inline">
              Next
            </span>

            <ArrowRight
              aria-hidden="true"
              className="h-3.5 w-3.5"
            />
          </span>
        )}
      </div>
    </motion.nav>
  );
}