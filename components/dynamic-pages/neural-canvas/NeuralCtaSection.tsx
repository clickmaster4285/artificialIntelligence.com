"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import {
  ArrowRight,
  Mail,
  Sparkles,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import {
  useRef,
} from "react";

import type {
  CtaSection,
  PageAccent,
} from "@/types/dynamic-page";

import { cn } from "@/lib/utils";

import {
  MotionReveal,
  TextMaskReveal,
} from "../shared/MotionReveal";

import { NeuralCanvasBackground } from "./NeuralCanvasBackground";

/* =========================================================
   TYPES
========================================================= */

interface NeuralCtaSectionProps {
  section: CtaSection;
  accent?: PageAccent;
  sectionIndex?: number;
}

/* =========================================================
   ORBITAL BACKGROUND
========================================================= */

function CtaOrbitalSystem({
  reduceMotion,
}: {
  reduceMotion: boolean | null;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none",
        "absolute left-1/2 top-1/2",
        "aspect-square w-[760px]",
        "-translate-x-1/2",
        "-translate-y-1/2",
        "opacity-75",
        "sm:w-[1000px]",
        "lg:w-[1250px]",
      )}
    >
      {/* Outer glow */}
      <motion.div
        className={cn(
          "absolute inset-[8%]",
          "rounded-full",
          "bg-[radial-gradient(circle,var(--neural-soft),transparent_65%)]",
          "blur-3xl",
        )}
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [
                  0.92,
                  1.08,
                  0.92,
                ],
                opacity: [
                  0.45,
                  0.85,
                  0.45,
                ],
              }
        }
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {[0, 1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className={cn(
            "absolute rounded-full",
            "border",
            ring % 2 === 0
              ? "border-white/[0.07]"
              : "border-dashed border-white/[0.09]",
          )}
          style={{
            inset: `${ring * 9}%`,
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  rotate:
                    ring % 2 === 0
                      ? 360
                      : -360,
              }
          }
          transition={{
            duration:
              30 + ring * 9,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <span
            className={cn(
              "absolute left-1/2 top-0",
              "-translate-x-1/2",
              "-translate-y-1/2",
              "rounded-full",
              ring % 2 === 0
                ? [
                    "h-2 w-2",
                    "bg-[var(--neural-secondary)]",
                    "shadow-[0_0_20px_var(--neural-secondary)]",
                  ].join(" ")
                : [
                    "h-1.5 w-1.5",
                    "bg-[var(--neural-primary)]",
                    "shadow-[0_0_18px_var(--neural-primary)]",
                  ].join(" "),
            )}
          />
        </motion.div>
      ))}

      {/* Central energy */}
      <motion.div
        className={cn(
          "absolute inset-[41%]",
          "rounded-full",
          "border border-white/[0.12]",
          "bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.32),var(--neural-primary)_35%,rgba(0,0,0,0.15)_72%)]",
          "shadow-[0_0_100px_var(--neural-soft)]",
        )}
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [
                  0.88,
                  1.08,
                  0.88,
                ],
              }
        }
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

/* =========================================================
   TRUST ITEMS
========================================================= */

const trustItems = [
  "ClickMasters",
  "Available for Q4 2026 partnerships",
] as const;

const ctaEmail =
  "hello@clickmastersartificialintelligencecompany.com";

/* =========================================================
   MAIN SECTION
========================================================= */

export function NeuralCtaSection({
  section,
  accent = "violet",
  sectionIndex = 10,
}: NeuralCtaSectionProps) {
  const sectionRef =
    useRef<HTMLElement>(null);

  const reduceMotion = useReducedMotion();

  const heading =
    section.heading ??
    section.title ??
    "Have an idea worth shipping? Tell us about it.";

  const text =
    section.text ??
    section.description ??
    "An AI studio building products, automation, and the systems around them.";

  const emailFromSecondary =
    section.secondaryCta?.href.startsWith(
      "mailto:",
    )
      ? section.secondaryCta.href.replace(
          "mailto:",
          "",
        )
      : undefined;

  const contactEmail =
    section.contactEmail ??
    emailFromSecondary ??
    ctaEmail;

  const secondaryHref =
    section.secondaryCta?.href ??
    `mailto:${contactEmail}`;

  const secondaryLabel =
    section.secondaryCta?.label ??
    contactEmail;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: [
      "start end",
      "end start",
    ],
  });

  const rawContentY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [100, 0, -100],
  );

  const rawOrbitY = useTransform(
    scrollYProgress,
    [0, 1],
    [-120, 120],
  );

  const contentY = useSpring(
    rawContentY,
    {
      stiffness: 90,
      damping: 24,
    },
  );

  const orbitY = useSpring(rawOrbitY, {
    stiffness: 75,
    damping: 26,
  });

  return (
    <section
      ref={sectionRef}
      id={section.id}
      className={cn(
        "relative isolate",
        "flex min-h-[56svh]",
        "items-center",
        "overflow-hidden",
        "border-b border-white/[0.065]",
        "bg-[#050507]",
        "px-5 py-10",
        "sm:px-8 sm:py-12",
        "lg:min-h-[62svh]",
        "lg:px-12 lg:py-14",
      )}
    >
      {/* Neural particle background */}
      <NeuralCanvasBackground
        accent={accent}
        interactive
        connectionDistance={165}
        speed={0.2}
        className="z-[-5] opacity-45"
      />

      {/* Dark atmospheric overlay */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none",
          "absolute inset-0",
          "z-[-4]",
          "bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,7,0.25)_45%,#050507_82%)]",
        )}
      />

      {/* Orbital visual */}
      <motion.div
        className="absolute inset-0 z-[-3]"
        style={
          reduceMotion
            ? undefined
            : {
                y: orbitY,
              }
        }
      >
        <CtaOrbitalSystem
          reduceMotion={reduceMotion}
        />
      </motion.div>

      {/* Top and bottom fades */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none",
          "absolute inset-x-0 top-0",
          "h-40",
          "bg-gradient-to-b",
          "from-[#050507]",
          "to-transparent",
        )}
      />

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none",
          "absolute inset-x-0 bottom-0",
          "h-40",
          "bg-gradient-to-t",
          "from-[#050507]",
          "to-transparent",
        )}
      />

      <motion.div
        className={cn(
          "relative z-10",
          "mx-auto w-full",
          "max-w-[1180px]",
        )}
        style={
          reduceMotion
            ? undefined
            : {
                y: contentY,
              }
        }
      >
        <div
          className={cn(
            "grid items-end gap-8",
            "lg:grid-cols-[1.1fr_0.9fr]",
            "lg:gap-12",
          )}
        >
          <div>
            {/* Eyebrow */}
            <MotionReveal preset="blur">
              <div
                className={cn(
                  "inline-flex",
                  "items-center gap-3",
                  "rounded-lg",
                  "border border-white/[0.1]",
                  "bg-black/35",
                  "px-3 py-2",
                  "backdrop-blur-2xl",
                )}
              >
                <Sparkles
                  aria-hidden="true"
                  className={cn(
                    "h-3.5 w-3.5",
                    "text-[var(--neural-secondary)]",
                    "drop-shadow-[0_0_12px_var(--neural-secondary)]",
                  )}
                />

                <span
                  className={cn(
                    "text-[0.62rem]",
                    "font-semibold",
                    "uppercase",
                    "tracking-[0.18em]",
                    "text-white/55",
                  )}
                >
                  {section.eyebrow ??
                    "Start With Technical Clarity"}
                </span>

                <span
                  className={cn(
                    "font-mono",
                    "text-[0.55rem]",
                    "text-white/20",
                  )}
                >
                  {String(
                    sectionIndex,
                  ).padStart(2, "0")}
                </span>
              </div>
            </MotionReveal>

            {/* Heading */}
            <TextMaskReveal
              className="mt-6 pb-2"
              duration={1.1}
            >
              <h2
                className={cn(
                  "max-w-[900px]",
                  "text-[clamp(2.8rem,6.4vw,7.2rem)]",
                  "font-semibold",
                  "leading-[0.92]",
                  "tracking-[-0.065em]",
                  "text-white",
                )}
              >
                {heading}
              </h2>
            </TextMaskReveal>

            <MotionReveal
              preset="blur"
              delay={0.15}
            >
              <p
                className={cn(
                  "mt-5 max-w-[680px]",
                  "text-base",
                  "leading-[1.75]",
                  "text-white/50",
                  "lg:text-[1.05rem]",
                )}
              >
                {text}
              </p>
            </MotionReveal>

            <MotionReveal
              preset="fade-up"
              delay={0.24}
            >
              <div
                className={cn(
                  "mt-7 flex flex-col gap-4",
                  "sm:flex-row sm:items-center",
                )}
              >
                <Link
                  href={
                    section.primaryCta
                      ?.href ?? "/contact/"
                  }
                  className={cn(
                    "group/cta inline-flex",
                    "h-12 items-center",
                    "justify-center gap-3",
                    "rounded-lg",
                    "border border-white/[0.12]",
                    "bg-white text-black",
                    "px-5",
                    "text-sm font-semibold",
                    "shadow-[0_18px_50px_-34px_rgba(255,255,255,0.7)]",
                    "transition-all duration-300",
                    "hover:-translate-y-0.5",
                    "hover:bg-[var(--neural-secondary)]",
                  )}
                >
                  {section.primaryCta?.label ??
                    "Book a discovery call"}
                  <ArrowRight
                    aria-hidden="true"
                    className={cn(
                      "h-4 w-4",
                      "transition-transform",
                      "group-hover/cta:translate-x-1",
                    )}
                  />
                </Link>

                <Link
                  href={secondaryHref}
                  className={cn(
                    "inline-flex h-12",
                    "items-center gap-3",
                    "rounded-lg",
                    "border border-white/[0.1]",
                    "bg-white/[0.035]",
                    "px-4",
                    "text-sm font-medium",
                    "text-white/65",
                    "backdrop-blur-xl",
                    "transition-colors",
                    "hover:text-white",
                  )}
                  >
                  <Mail
                    aria-hidden="true"
                    className="h-4 w-4 text-[var(--neural-secondary)]"
                  />
                  {secondaryLabel}
                </Link>
              </div>
            </MotionReveal>
          </div>

          <MotionReveal
            preset="fade-scale"
            delay={0.22}
          >
            <div
              className={cn(
                "relative overflow-hidden",
                "rounded-lg",
                "border border-white/[0.11]",
                "bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.018)_48%,rgba(34,211,238,0.035))]",
                "p-5",
                "shadow-[0_18px_70px_-52px_var(--neural-primary),inset_0_1px_0_rgba(255,255,255,0.08)]",
                "backdrop-blur-2xl",
              )}
            >
              <div
                className={cn(
                  "relative mx-auto",
                  "aspect-square w-full",
                  "max-w-[260px]",
                )}
              >
                <Image
                  src="/images/footer-robo.png"
                  alt="ClickMasters mascot"
                  fill
                  sizes="260px"
                  quality={60}
                  className="object-contain"
                  priority={false}
                />
              </div>

              <div
                className={cn(
                  "mt-4 border-t",
                  "border-white/[0.08] pt-4",
                )}
              >
                <p
                  className={cn(
                    "text-lg font-semibold",
                    "tracking-[-0.03em]",
                    "text-white",
                  )}
                >
                  {trustItems[0]}
                </p>

                <p
                  className={cn(
                    "mt-2 text-sm",
                    "leading-relaxed",
                    "text-white/45",
                  )}
                >
                  {section.trustText ??
                    trustItems[1]}
                </p>
              </div>
            </div>
          </MotionReveal>
        </div>
      </motion.div>
    </section>
  );
}
