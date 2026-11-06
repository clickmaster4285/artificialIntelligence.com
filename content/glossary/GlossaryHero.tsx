"use client";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowRight,
  BookOpen,
  Search,
  Sparkles,
} from "lucide-react";

import Link from "next/link";

import type {
  FormEvent,
} from "react";

import { useRouter } from "next/navigation";

import type {
  GlossaryLandingHero,
} from "@/types/glossary";

import { cn } from "@/lib/utils";

import { GlossaryBackground } from "./shared/GlossaryBackground";

/* =========================================================
   TYPES
========================================================= */

interface GlossaryHeroProps {
  hero: GlossaryLandingHero;
  totalTerms: number;
  totalCategories: number;
}

/* =========================================================
   ANIMATION
========================================================= */

const entranceEase = [
  0.22,
  1,
  0.36,
  1,
] as const;

/* =========================================================
   COMPONENT
========================================================= */

export function GlossaryHero({
  hero,
  totalTerms,
  totalCategories,
}: GlossaryHeroProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  function handleSearch(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const formData = new FormData(
      event.currentTarget,
    );

    const searchValue = String(
      formData.get("search") ?? "",
    ).trim();

    if (!searchValue) {
      router.push("/glossary");
      return;
    }

    const searchParams =
      new URLSearchParams();

    searchParams.set(
      "search",
      searchValue,
    );

    router.push(
      `/glossary?${searchParams.toString()}`,
    );
  }

  return (
    <section
      className={cn(
        "relative isolate",
        "overflow-hidden",
        "border-b border-white/[0.07]",
        "bg-[#030305]",
      )}
    >
      <GlossaryBackground
        intensity="strong"
        className="z-[-3]"
      />

      {/* Top highlight */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none",
          "absolute inset-x-0 top-0",
          "h-px",
          "bg-[linear-gradient(90deg,transparent,rgba(139,92,246,0.8),rgba(34,211,238,0.7),transparent)]",
        )}
      />

      <div
        className={cn(
          "relative z-10",
          "mx-auto w-full",
          "max-w-[1500px]",
          "px-5 pb-14 pt-10",
          "sm:px-8 sm:pb-16 sm:pt-14",
          "lg:px-12 lg:pb-20 lg:pt-16",
          "xl:px-16",
        )}
      >
        <div
          className={cn(
            "mx-auto",
            "max-w-[1120px]",
            "text-center",
          )}
        >
          {/* Eyebrow */}
          {hero.eyebrow && (
            <motion.div
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 16,
                      filter:
                        "blur(8px)",
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              transition={{
                duration: 0.7,
                ease: entranceEase,
              }}
              className={cn(
                "mx-auto mb-5",
                "inline-flex",
                "items-center gap-2.5",
                "rounded-full",
                "border border-violet-400/20",
                "bg-violet-400/[0.07]",
                "px-4 py-2",
                "backdrop-blur-xl",
              )}
            >
              <span
                className={cn(
                  "grid h-6 w-6",
                  "place-items-center",
                  "rounded-full",
                  "bg-violet-400/10",
                )}
              >
                <Sparkles
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-violet-300"
                />
              </span>

              <span
                className={cn(
                  "text-[0.64rem]",
                  "font-semibold uppercase",
                  "tracking-[0.22em]",
                  "text-violet-200/80",
                  "sm:text-[0.7rem]",
                )}
              >
                {hero.eyebrow}
              </span>
            </motion.div>
          )}

          {/* Heading */}
          <motion.h1
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 30,
                    filter:
                      "blur(14px)",
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 0.9,
              delay: 0.08,
              ease: entranceEase,
            }}
            className={cn(
              "mx-auto",
              "max-w-[1050px]",
              "text-[clamp(3rem,7vw,7.2rem)]",
              "font-semibold",
              "leading-[0.88]",
              "tracking-[-0.07em]",
              "text-white",
            )}
          >
            <span className="block">
              {hero.title}
            </span>

            {hero.highlightedText && (
              <span
                className={cn(
                  "mt-2 block",
                  "bg-[linear-gradient(100deg,#c084fc_4%,#8b5cf6_34%,#6366f1_58%,#22d3ee_94%)]",
                  "bg-clip-text",
                  "text-transparent",
                )}
              >
                {hero.highlightedText}
              </span>
            )}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 20,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.75,
              delay: 0.2,
              ease: entranceEase,
            }}
            className={cn(
              "mx-auto mt-6",
              "max-w-[760px]",
              "text-base",
              "leading-[1.75]",
              "text-white/52",
              "sm:text-lg",
            )}
          >
            {hero.description}
          </motion.p>

          {/* Search */}
          <motion.div
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 24,
                    scale: 0.97,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: entranceEase,
            }}
            className={cn(
              "relative",
              "mx-auto mt-8",
              "max-w-[780px]",
            )}
          >
            {/* Search glow */}
            <div
              aria-hidden="true"
              className={cn(
                "absolute -inset-3",
                "rounded-[2rem]",
                "bg-[linear-gradient(90deg,rgba(139,92,246,0.16),rgba(34,211,238,0.12))]",
                "opacity-80",
                "blur-2xl",
              )}
            />

            <form
              action="/glossary"
              method="get"
              onSubmit={handleSearch}
              role="search"
              className={cn(
                "group/search",
                "relative flex",
                "items-center",
                "rounded-2xl",
                "border border-white/[0.11]",
                "bg-[#0a0a0f]/85",
                "p-2",
                "shadow-[0_30px_100px_-45px_rgba(139,92,246,0.8)]",
                "backdrop-blur-2xl",
                "transition-all duration-300",
                "focus-within:border-violet-400/40",
                "focus-within:shadow-[0_35px_110px_-42px_rgba(139,92,246,0.95)]",
              )}
            >
              <Search
                aria-hidden="true"
                className={cn(
                  "ml-3 h-5 w-5",
                  "shrink-0",
                  "text-white/30",
                  "transition-colors",
                  "group-focus-within/search:text-violet-300",
                  "sm:ml-4",
                )}
              />

              <input
                type="search"
                name="search"
                autoComplete="off"
                placeholder={
                  hero.searchPlaceholder ??
                  "Search the AI glossary..."
                }
                aria-label="Search glossary"
                className={cn(
                  "h-12 min-w-0",
                  "flex-1",
                  "bg-transparent",
                  "px-3",
                  "text-sm text-white",
                  "outline-none",
                  "placeholder:text-white/28",
                  "sm:h-14 sm:px-4",
                  "sm:text-base",
                )}
              />

              <button
                type="submit"
                className={cn(
                  "group/button",
                  "inline-flex h-12",
                  "shrink-0",
                  "items-center",
                  "justify-center gap-2",
                  "rounded-xl",
                  "bg-white",
                  "px-4",
                  "text-sm font-semibold",
                  "text-black",
                  "transition-all",
                  "duration-300",
                  "hover:bg-violet-200",
                  "hover:shadow-[0_0_35px_rgba(196,181,253,0.3)]",
                  "active:scale-[0.98]",
                  "sm:h-14 sm:px-6",
                )}
              >
                <span className="hidden sm:inline">
                  Explore
                </span>

                <ArrowRight
                  aria-hidden="true"
                  className={cn(
                    "h-4 w-4",
                    "transition-transform",
                    "group-hover/button:translate-x-1",
                  )}
                />
              </button>
            </form>
          </motion.div>

          {/* Popular terms */}
          {hero.popularSearches &&
            hero.popularSearches.length >
              0 && (
              <motion.div
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 16,
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.42,
                  ease: entranceEase,
                }}
                className={cn(
                  "mx-auto mt-5",
                  "flex max-w-[850px]",
                  "flex-wrap",
                  "items-center",
                  "justify-center",
                  "gap-2",
                )}
              >
                <span
                  className={cn(
                    "mr-1",
                    "text-xs",
                    "text-white/30",
                  )}
                >
                  Popular:
                </span>

                {hero.popularSearches.map(
                  (term) => (
                    <Link
                      key={term}
                      href={`/glossary?search=${encodeURIComponent(
                        term,
                      )}`}
                      rel="nofollow"
                      className={cn(
                        "rounded-full",
                        "border border-white/[0.07]",
                        "bg-white/[0.025]",
                        "px-3 py-1.5",
                        "text-xs",
                        "text-white/42",
                        "transition-all",
                        "duration-300",
                        "hover:border-violet-400/25",
                        "hover:bg-violet-400/[0.08]",
                        "hover:text-white/75",
                      )}
                    >
                      {term}
                    </Link>
                  ),
                )}
              </motion.div>
            )}

          {/* Stats */}
          <motion.div
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 20,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.75,
              delay: 0.52,
              ease: entranceEase,
            }}
            className={cn(
              "mx-auto mt-9",
              "flex max-w-[650px]",
              "items-center",
              "justify-center",
              "divide-x divide-white/[0.09]",
              "rounded-2xl",
              "border border-white/[0.07]",
              "bg-white/[0.02]",
              "px-3 py-4",
              "backdrop-blur-xl",
            )}
          >
            <div className="flex flex-1 items-center justify-center gap-3">
              <BookOpen
                aria-hidden="true"
                className="h-4 w-4 text-violet-300"
              />

              <div className="text-left">
                <strong className="block text-lg font-semibold text-white">
                  {totalTerms}+
                </strong>

                <span
                  className={cn(
                    "block",
                    "text-[0.58rem]",
                    "uppercase",
                    "tracking-[0.14em]",
                    "text-white/32",
                  )}
                >
                  AI terms
                </span>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-center gap-3">
              <Sparkles
                aria-hidden="true"
                className="h-4 w-4 text-cyan-300"
              />

              <div className="text-left">
                <strong className="block text-lg font-semibold text-white">
                  {totalCategories}
                </strong>

                <span
                  className={cn(
                    "block",
                    "text-[0.58rem]",
                    "uppercase",
                    "tracking-[0.14em]",
                    "text-white/32",
                  )}
                >
                  Categories
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}