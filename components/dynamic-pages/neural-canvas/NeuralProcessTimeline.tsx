"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import {
  Check,
  Clock3,
  CornerDownRight,
} from "lucide-react";

import {
  useRef,
} from "react";

import type {
  ProcessSection,
  ProcessStep,
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

interface NeuralProcessTimelineProps {
  section: ProcessSection;
  sectionIndex?: number;
}

interface ProcessCardProps {
  step: ProcessStep;
  index: number;
  totalSteps: number;
}

/* =========================================================
   PROCESS CARD
========================================================= */

function ProcessCard({
  step,
  index,
  totalSteps,
}: ProcessCardProps) {
  const cardRef =
    useRef<HTMLLIElement>(null);

  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: [
      "start 88%",
      "end 28%",
    ],
  });

  const rawOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.72, 1],
    [0.35, 1, 1, 0.5],
  );

  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.25, 0.7, 1],
    [0.94, 1, 1, 0.96],
  );

  const rawX = useTransform(
    scrollYProgress,
    [0, 0.25],
    [45, 0],
  );

  const opacity = useSpring(
    rawOpacity,
    {
      stiffness: 110,
      damping: 25,
    },
  );

  const scale = useSpring(
    rawScale,
    {
      stiffness: 110,
      damping: 24,
    },
  );

  const x = useSpring(rawX, {
    stiffness: 110,
    damping: 24,
  });

  return (
    <motion.li
      ref={cardRef}
      className={cn(
        "group/process relative",
        "min-h-[285px]",
        "overflow-hidden",
        "glass rounded-3xl",
        "p-6",
        "shadow-[0_28px_90px_-58px_var(--neural-primary)]",
        "transition-[border-color,box-shadow]",
        "duration-500",
        "hover:border-[var(--neural-primary)]/35",
        "hover:shadow-[0_40px_120px_-48px_var(--neural-soft)]",
        "sm:min-h-[320px]",
        "sm:p-7",
      )}
      style={
        reduceMotion
          ? undefined
          : {
              opacity,
              scale,
              x,
            }
      }
    >
      {/* Top gradient line */}
      <motion.div
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-0",
          "h-px origin-left",
          "bg-[linear-gradient(90deg,var(--neural-primary),var(--neural-secondary),transparent)]",
        )}
        initial={{
          scaleX: 0,
        }}
        whileInView={{
          scaleX: 1,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          delay: 0.15,
          duration: 1,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
      />

      {/* Background number */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none",
          "absolute -right-3 -top-10",
          "font-mono",
          "text-[9rem]",
          "font-semibold",
          "leading-none",
          "tracking-[-0.08em]",
          "text-white/[0.018]",
          "transition-colors",
          "duration-500",
          "group-hover/process:text-white/[0.035]",
          "sm:text-[13rem]",
        )}
      >
        {step.number ??
          String(index + 1).padStart(
            2,
            "0",
          )}
      </span>

      {/* Ambient card glow */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none",
          "absolute -bottom-40",
          "-right-32",
          "h-80 w-80",
          "rounded-full",
          "bg-[var(--neural-primary)]",
          "opacity-0",
          "blur-[110px]",
          "transition-opacity",
          "duration-500",
          "group-hover/process:opacity-[0.12]",
        )}
      />

      <div className="relative z-10 flex h-full flex-col">
        {/* Card header */}
        <div
          className={cn(
            "flex items-start",
            "justify-between gap-5",
          )}
        >
          <div>
            <span
              className={cn(
                "font-mono",
                "text-[0.65rem]",
                "font-semibold",
                "tracking-[0.18em]",
                "text-[var(--neural-secondary)]",
              )}
            >
              PHASE{" "}
              {step.number ??
                String(
                  index + 1,
                ).padStart(2, "0")}
            </span>

            <span
              className={cn(
                "mt-2 block",
                "text-[0.58rem]",
                "uppercase",
                "tracking-[0.14em]",
                "text-white/25",
              )}
            >
              {index + 1} of{" "}
              {totalSteps}
            </span>
          </div>

          {step.duration && (
            <div
              className={cn(
                "inline-flex",
                "items-center gap-2",
                "rounded-full",
                "border border-white/[0.08]",
                "bg-white/[0.035]",
                "px-3 py-2",
                "text-[0.62rem]",
                "font-medium",
                "text-white/45",
              )}
            >
              <Clock3
                aria-hidden="true"
                className="h-3.5 w-3.5 text-[var(--neural-secondary)]"
              />

              {step.duration}
            </div>
          )}
        </div>

        {/* Main copy */}
        <div className="mt-8">
          <h3
            className={cn(
              "max-w-2xl",
              "text-2xl",
              "font-semibold",
              "leading-[1.08]",
              "tracking-[-0.04em]",
              "text-white",
              "sm:text-4xl",
            )}
          >
            {step.title}
          </h3>

          <p
            className={cn(
              "mt-5 max-w-2xl",
              "text-sm",
              "leading-[1.8]",
              "text-white/43",
              "sm:text-base",
            )}
          >
            {step.description}
          </p>
        </div>

        {/* Deliverables */}
        {step.deliverables &&
          step.deliverables.length >
            0 && (
            <div className="mt-auto pt-7">
              <div
                className={cn(
                  "mb-4 flex",
                  "items-center gap-2",
                )}
              >
                <CornerDownRight
                  aria-hidden="true"
                  className="h-4 w-4 text-white/25"
                />

                <span
                  className={cn(
                    "text-[0.58rem]",
                    "font-semibold",
                    "uppercase",
                    "tracking-[0.16em]",
                    "text-white/30",
                  )}
                >
                  Key deliverables
                </span>
              </div>

              <StaggerContainer
                className={cn(
                  "grid gap-2.5",
                  "sm:grid-cols-2",
                )}
                stagger={0.06}
                amount={0.4}
              >
                {step.deliverables.map(
                  (deliverable) => (
                    <StaggerItem
                      key={deliverable}
                      preset="fade-up"
                    >
                      <div
                        className={cn(
                          "flex items-center",
                          "gap-2.5",
                          "rounded-xl",
                          "border border-white/[0.065]",
                          "bg-white/[0.025]",
                          "px-3 py-3",
                          "text-xs",
                          "text-white/50",
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-5 w-5",
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

                        {deliverable}
                      </div>
                    </StaggerItem>
                  ),
                )}
              </StaggerContainer>
            </div>
          )}
      </div>
    </motion.li>
  );
}

/* =========================================================
   STICKY PROGRESS
========================================================= */

function StickyProgress({
  progress,
  totalSteps,
}: {
  progress: ReturnType<
    typeof useSpring
  >;
  totalSteps: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "mt-4 hidden",
        "items-center gap-4",
        "lg:flex",
      )}
    >
      <div
        className={cn(
          "relative h-px flex-1",
          "overflow-hidden",
          "bg-white/[0.08]",
        )}
      >
        <motion.div
          className={cn(
            "absolute inset-0",
            "origin-left",
            "bg-[linear-gradient(90deg,var(--neural-primary),var(--neural-secondary))]",
            "shadow-[0_0_14px_var(--neural-primary)]",
          )}
          style={{
            scaleX: progress,
          }}
        />
      </div>

      <span
        className={cn(
          "font-mono",
          "text-[0.62rem]",
          "tracking-[0.14em]",
          "text-white/25",
        )}
      >
        {String(totalSteps).padStart(
          2,
          "0",
        )} PHASES
      </span>
    </div>
  );
}

/* =========================================================
   MAIN SECTION
========================================================= */

export function NeuralProcessTimeline({
  section,
  sectionIndex = 4,
}: NeuralProcessTimelineProps) {
  const sectionRef =
    useRef<HTMLElement>(null);

  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: [
      "start 75%",
      "end 35%",
    ],
  });

  const smoothProgress = useSpring(
    scrollYProgress,
    {
      stiffness: 100,
      damping: 25,
      mass: 0.35,
    },
  );

  const ambientY = useTransform(
    scrollYProgress,
    [0, 1],
    [-100, 350],
  );

  if (section.steps.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id={section.id}
      className={cn(
        "relative isolate",
        "overflow-clip",
        "border-b border-white/[0.065]",
        "bg-[#07070a]",
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
          "bg-[size:80px_80px]",
          "[mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]",
        )}
      />

      {/* Ambient glow */}
      <motion.div
        aria-hidden="true"
        className={cn(
          "pointer-events-none",
          "absolute -left-64 top-1/3",
          "h-[650px] w-[650px]",
          "rounded-full",
          "bg-[var(--neural-primary)]",
          "opacity-[0.055]",
          "blur-[160px]",
        )}
        style={
          reduceMotion
            ? undefined
            : {
                y: ambientY,
              }
        }
      />

      <div
        className={cn(
          "relative z-10",
          "mx-auto grid",
          "max-w-[1440px]",
          "grid-cols-1 gap-4",
          "lg:grid-cols-[0.76fr_1.24fr]",
          "lg:gap-8",
          "xl:gap-10",
        )}
      >
        {/* Sticky heading */}
        <div className="relative">
          <div className="lg:sticky lg:top-32">
            <div className="-mb-16 sm:-mb-14 lg:-mb-56">
              <SectionHeading
                eyebrow={section.eyebrow}
                title={
                  section.title ??
                  "How we build"
                }
                index={sectionIndex}
                size="large"
              />
            </div>

            <StickyProgress
              progress={
                smoothProgress
              }
              totalSteps={
                section.steps.length
              }
            />

            <MotionReveal
              preset="fade-up"
              delay={0.15}
              className={cn(
                "mt-4 hidden",
                "max-w-md",
                "text-xs",
                "leading-relaxed",
                "text-white/28",
                "lg:block",
              )}
            >
              Scroll through each phase to
              explore the decisions,
              deliverables and quality gates
              along the way.
            </MotionReveal>
          </div>
        </div>

        {/* Process cards */}
        <ol className="space-y-6 lg:space-y-10">
          {section.steps.map(
            (step, index) => (
              <ProcessCard
                key={`${section.id}-${step.title}`}
                step={step}
                index={index}
                totalSteps={
                  section.steps.length
                }
              />
            ),
          )}
        </ol>
      </div>
    </section>
  );
}
