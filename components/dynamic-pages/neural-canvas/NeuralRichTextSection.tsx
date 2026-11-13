"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import {
  ArrowUpRight,
  Check,
  Quote,
  Sparkles,
} from "lucide-react";

import Link from "next/link";

import {
  useRef,
} from "react";

import type {
  RichTextBlock,
  RichTextSection,
} from "@/types/dynamic-page";

import { cn } from "@/lib/utils";

import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
} from "../shared/MotionReveal";

import { SectionHeading } from "../shared/SectionHeading";

/* =========================================================
   TYPES
========================================================= */

interface NeuralRichTextSectionProps {
  section: RichTextSection;
  sectionIndex?: number;
}

interface EditorialBlockProps {
  block: RichTextBlock;
  index: number;
  totalBlocks: number;
}

/* =========================================================
   EDITORIAL BLOCK
========================================================= */

function EditorialBlock({
  block,
  index,
  totalBlocks,
}: EditorialBlockProps) {
  const blockRef =
    useRef<HTMLElement>(null);

  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: blockRef,
    offset: [
      "start 82%",
      "end 35%",
    ],
  });

  const rawOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.82, 1],
    [0.3, 1, 1, 0.55],
  );

  const rawY = useTransform(
    scrollYProgress,
    [0, 0.22],
    [45, 0],
  );

  const opacity = useSpring(
    rawOpacity,
    {
      stiffness: 110,
      damping: 25,
    },
  );

  const y = useSpring(rawY, {
    stiffness: 110,
    damping: 24,
  });

  return (
    <motion.article
      ref={blockRef}
      className={cn(
        "group/editorial",
        "relative",
        "border-t border-white/[0.07]",
        "py-12",
        "first:border-t-0",
        "first:pt-0",
        "sm:py-16",
      )}
      style={
        reduceMotion
          ? undefined
          : {
              opacity,
              y,
            }
      }
    >
      <div
        className={cn(
          "grid grid-cols-1",
          "gap-7",
          "xl:grid-cols-[90px_1fr]",
          "xl:gap-10",
        )}
      >
        {/* Block index */}
        <div>
          <span
            className={cn(
              "inline-flex",
              "items-center gap-3",
              "font-mono",
              "text-[0.62rem]",
              "tracking-[0.15em]",
              "text-white/25",
            )}
          >
            {String(index + 1).padStart(
              2,
              "0",
            )}

            <span
              aria-hidden="true"
              className={cn(
                "h-px w-8",
                "bg-[linear-gradient(90deg,var(--neural-primary),transparent)]",
              )}
            />
          </span>
        </div>

        <div>
          {block.heading && (
            <h3
              className={cn(
                "max-w-3xl",
                "text-2xl",
                "font-semibold",
                "leading-[1.15]",
                "tracking-[-0.04em]",
                "text-white",
                "sm:text-4xl",
              )}
            >
              {block.heading}
            </h3>
          )}

          {block.paragraphs.map(
            (paragraph, paragraphIndex) => (
              <p
                key={`${paragraph.slice(0, 30)}-${paragraphIndex}`}
                className={cn(
                  "max-w-3xl",
                  "text-base",
                  "leading-[1.9]",
                  "text-white/48",
                  "sm:text-lg",
                  block.heading
                    ? "mt-6"
                    : paragraphIndex > 0 &&
                        "mt-6",
                )}
              >
                {paragraph}
              </p>
            ),
          )}

          {block.bullets &&
            block.bullets.length > 0 && (
              <StaggerContainer
                className={cn(
                  "mt-8 grid gap-3",
                  "sm:grid-cols-2",
                )}
                stagger={0.06}
                amount={0.3}
              >
                {block.bullets.map(
                  (bullet) => (
                    <StaggerItem
                      key={bullet}
                      preset="fade-up"
                    >
                      <div
                        className={cn(
                          "flex h-full",
                          "items-start gap-3",
                          "rounded-xl",
                          "border border-white/[0.065]",
                          "bg-white/[0.025]",
                          "px-4 py-4",
                          "text-sm",
                          "leading-relaxed",
                          "text-white/48",
                          "transition-colors",
                          "duration-300",
                          "hover:border-white/[0.12]",
                          "hover:bg-white/[0.045]",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 grid",
                            "h-5 w-5",
                            "shrink-0",
                            "place-items-center",
                            "rounded-full",
                            "bg-[var(--neural-soft)]",
                          )}
                        >
                          <Check
                            aria-hidden="true"
                            className="h-3 w-3 text-[var(--neural-secondary)]"
                          />
                        </span>

                        {bullet}
                      </div>
                    </StaggerItem>
                  ),
                )}
              </StaggerContainer>
            )}

          {block.quote && (
            <MotionReveal
              preset="fade-scale"
              className={cn(
                "relative mt-9",
                "overflow-hidden",
                "rounded-2xl",
                "border",
                "border-[var(--neural-primary)]/30",
                "bg-[var(--neural-soft)]",
                "p-6",
                "sm:p-8",
              )}
            >
              <Quote
                aria-hidden="true"
                className={cn(
                  "h-6 w-6",
                  "text-[var(--neural-highlight)]",
                )}
              />

              <blockquote
                className={cn(
                  "mt-4",
                  "text-base",
                  "font-medium",
                  "leading-[1.75]",
                  "text-white/75",
                  "sm:text-lg",
                )}
              >
                {block.quote}
              </blockquote>
            </MotionReveal>
          )}

          {block.links &&
            block.links.length > 0 && (
              <div
                className={cn(
                  "mt-8 flex",
                  "flex-wrap gap-3",
                )}
              >
                {block.links.map(
                  (link) => {
                    const isExternal =
                      link.external ||
                      link.href.startsWith(
                        "http",
                      );

                    return (
                      <Link
                        key={`${link.href}-${link.label}`}
                        href={link.href}
                        target={
                          isExternal
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          isExternal
                            ? "noopener noreferrer"
                            : undefined
                        }
                        aria-label={
                          link.ariaLabel ??
                          link.label
                        }
                        className={cn(
                          "group/link",
                          "inline-flex",
                          "items-center gap-2",
                          "rounded-full",
                          "border",
                          "border-white/[0.09]",
                          "bg-white/[0.035]",
                          "px-4 py-3",
                          "text-xs",
                          "font-semibold",
                          "text-white/60",
                          "transition-all",
                          "duration-300",
                          "hover:border-[var(--neural-primary)]",
                          "hover:bg-[var(--neural-soft)]",
                          "hover:text-white",
                        )}
                      >
                        {link.label}

                        <ArrowUpRight
                          aria-hidden="true"
                          className={cn(
                            "h-3.5 w-3.5",
                            "transition-transform",
                            "duration-300",
                            "group-hover/link:translate-x-0.5",
                            "group-hover/link:-translate-y-0.5",
                          )}
                        />
                      </Link>
                    );
                  },
                )}
              </div>
            )}
        </div>
      </div>

      {/* Current block indicator */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute right-0 top-12",
          "hidden",
          "font-mono",
          "text-[0.55rem]",
          "tracking-[0.12em]",
          "text-white/15",
          "sm:block",
        )}
      >
        {String(index + 1).padStart(
          2,
          "0",
        )}
        /
        {String(totalBlocks).padStart(
          2,
          "0",
        )}
      </span>
    </motion.article>
  );
}

/* =========================================================
   TWO-COLUMN LAYOUT
========================================================= */

function TwoColumnBlocks({
  blocks,
}: {
  blocks: RichTextBlock[];
}) {
  return (
    <StaggerContainer
      className={cn(
        "grid grid-cols-1 gap-4",
        "lg:grid-cols-2",
      )}
      stagger={0.08}
    >
      {blocks.map((block, index) => (
        <StaggerItem
          key={`${block.heading}-${index}`}
          preset="fade-scale"
        >
          <article
            className={cn(
              "relative h-full",
              "overflow-hidden",
              "glass rounded-3xl",
              "p-5",
              "shadow-[0_28px_90px_-58px_var(--neural-primary)]",
              "transition-[border-color,box-shadow]",
              "duration-500",
              "hover:border-[var(--neural-primary)]/35",
              "hover:shadow-[0_40px_120px_-48px_var(--neural-soft)]",
              "sm:p-6",
            )}
          >
            <span
              className={cn(
                "font-mono",
                "text-[0.6rem]",
                "tracking-[0.15em]",
                "text-[var(--neural-secondary)]",
              )}
            >
              {String(index + 1).padStart(
                2,
                "0",
              )}
            </span>

            {block.heading && (
              <h3
                className={cn(
                  "mt-6",
                  "text-2xl",
                  "font-semibold",
                  "tracking-[-0.035em]",
                  "text-white",
                  "sm:text-3xl",
                )}
              >
                {block.heading}
              </h3>
            )}

            {block.paragraphs.map(
              (
                paragraph,
                paragraphIndex,
              ) => (
                <p
                  key={`${paragraph.slice(0, 25)}-${paragraphIndex}`}
                  className={cn(
                    "text-sm",
                    "leading-[1.85]",
                    "text-white/45",
                    block.heading ||
                      paragraphIndex > 0
                      ? "mt-5"
                      : "",
                  )}
                >
                  {paragraph}
                </p>
              ),
            )}

            {block.bullets &&
              block.bullets.length >
                0 && (
                <ul className="mt-7 space-y-3">
                  {block.bullets.map(
                    (bullet) => (
                      <li
                        key={bullet}
                        className={cn(
                          "flex items-start",
                          "gap-3",
                          "text-sm",
                          "leading-relaxed",
                          "text-white/45",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-1 grid",
                            "h-4 w-4",
                            "shrink-0",
                            "place-items-center",
                            "rounded-full",
                            "bg-[var(--neural-soft)]",
                          )}
                        >
                          <Check
                            aria-hidden="true"
                            className="h-2.5 w-2.5 text-[var(--neural-secondary)]"
                          />
                        </span>

                        {bullet}
                      </li>
                    ),
                  )}
                </ul>
              )}

            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none",
                "absolute -bottom-28",
                "-right-28",
                "h-56 w-56",
                "rounded-full",
                "bg-[var(--neural-primary)]",
                "opacity-[0.06]",
                "blur-[80px]",
              )}
            />
          </article>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}

/* =========================================================
   MAIN SECTION
========================================================= */

export function NeuralRichTextSection({
  section,
  sectionIndex = 7,
}: NeuralRichTextSectionProps) {
  const sectionRef =
    useRef<HTMLElement>(null);

  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: [
      "start 80%",
      "end 20%",
    ],
  });

  const rawGlowY = useTransform(
    scrollYProgress,
    [0, 1],
    [-180, 500],
  );

  const glowY = useSpring(rawGlowY, {
    stiffness: 80,
    damping: 26,
  });

  if (section.blocks.length === 0) {
    return null;
  }

  const useTwoColumnLayout =
    section.layout === "two-column";

  const usesFaqTightHeading = true;

  return (
    <section
      ref={sectionRef}
      id={section.id}
      className={cn(
        "relative isolate",
        "overflow-clip",
        "border-b border-white/[0.065]",
        section.tone === "contrast"
          ? "bg-[#08070d]"
          : "bg-[#050507]",
        "px-5 py-8",
        "sm:px-8 sm:py-10",
        "lg:px-12 lg:py-12",
      )}
    >
      {/* Background grid */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none",
          "absolute inset-0",
          "opacity-20",
          "bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)]",
          "bg-[size:76px_76px]",
          "[mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]",
        )}
      />

      {/* Scroll-linked ambient glow */}
      <motion.div
        aria-hidden="true"
        className={cn(
          "pointer-events-none",
          "absolute -left-72 top-1/4",
          "h-[650px] w-[650px]",
          "rounded-full",
          "bg-[var(--neural-primary)]",
          "opacity-[0.055]",
          "blur-[170px]",
        )}
        style={
          reduceMotion
            ? undefined
            : {
                y: glowY,
              }
        }
      />

      <div
        className={cn(
          "relative z-10",
          "mx-auto max-w-[1440px]",
        )}
      >
        {useTwoColumnLayout ? (
          <>
            <div
              className={cn(
                usesFaqTightHeading &&
                  "-mb-16 sm:-mb-14 lg:-mb-56",
              )}
            >
              <SectionHeading
                eyebrow={section.eyebrow}
                title={
                  section.title ??
                  "Technical perspective"
                }
                description={
                  usesFaqTightHeading
                    ? undefined
                    : section.description
                }
                index={sectionIndex}
                size="large"
              />
            </div>

            <div className="mt-0 sm:mt-1">
              <TwoColumnBlocks
                blocks={section.blocks}
              />
            </div>
          </>
        ) : (
          <div
            className={cn(
              "grid grid-cols-1",
              usesFaqTightHeading
                ? "gap-0"
                : "gap-4",
              "lg:grid-cols-[0.72fr_1.28fr]",
              "lg:gap-8",
              "xl:gap-10",
            )}
          >
            {/* Sticky section heading */}
            <div className="relative">
              <div className="lg:sticky lg:top-32">
                {/* No negative bottom margin here: it pulled the
                    "Scroll to explore" hint up over the heading. */}
                <div>
                  <SectionHeading
                    eyebrow={
                      section.eyebrow
                    }
                    title={
                      section.title ??
                      "Technical perspective"
                    }
                    description={
                      usesFaqTightHeading
                        ? undefined
                        : section.description
                    }
                    index={
                      sectionIndex
                    }
                    size="large"
                  />
                </div>

                <MotionReveal
                  preset="fade-up"
                  delay={0.15}
                  className={cn(
                    "mt-4 hidden",
                    "items-center gap-3",
                    "text-[0.6rem]",
                    "uppercase",
                    "tracking-[0.14em]",
                    "text-white/22",
                    "lg:flex",
                  )}
                >
                  <Sparkles
                    aria-hidden="true"
                    className="h-3 w-3 text-[var(--neural-secondary)]"
                  />

                  Scroll to explore
                </MotionReveal>
              </div>
            </div>

            {/* Editorial content */}
            <div>
              {section.blocks.map(
                (block, index) => (
                  <EditorialBlock
                    key={`${section.id}-${block.heading}-${index}`}
                    block={block}
                    index={index}
                    totalBlocks={
                      section.blocks.length
                    }
                  />
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
