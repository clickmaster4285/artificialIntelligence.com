"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";

import type {
  PropsWithChildren,
  ReactNode,
} from "react";

/* =========================================================
   TYPES
========================================================= */

export type RevealPreset =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "fade-scale"
  | "blur"
  | "mask";

interface MotionRevealProps
  extends PropsWithChildren,
    Omit<HTMLMotionProps<"div">, "children"> {
  preset?: RevealPreset;
  delay?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
  className?: string;
}

interface StaggerContainerProps
  extends PropsWithChildren,
    Omit<HTMLMotionProps<"div">, "children"> {
  delay?: number;
  stagger?: number;
  amount?: number;
  once?: boolean;
  className?: string;
}

interface StaggerItemProps
  extends PropsWithChildren,
    Omit<HTMLMotionProps<"div">, "children"> {
  preset?: Exclude<RevealPreset, "mask">;
  className?: string;
}

interface TextMaskRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
}

/* =========================================================
   EASING
========================================================= */

const premiumEase = [
  0.22,
  1,
  0.36,
  1,
] as const;

/* =========================================================
   REVEAL VARIANTS
========================================================= */

function createRevealVariants(
  preset: RevealPreset,
): Variants {
  switch (preset) {
    case "fade-down":
      return {
        hidden: {
          opacity: 0,
          y: -48,
        },
        visible: {
          opacity: 1,
          y: 0,
        },
      };

    case "fade-left":
      return {
        hidden: {
          opacity: 0,
          x: 64,
        },
        visible: {
          opacity: 1,
          x: 0,
        },
      };

    case "fade-right":
      return {
        hidden: {
          opacity: 0,
          x: -64,
        },
        visible: {
          opacity: 1,
          x: 0,
        },
      };

    case "fade-scale":
      return {
        hidden: {
          opacity: 0,
          scale: 0.88,
          y: 30,
        },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
        },
      };

    case "blur":
      return {
        hidden: {
          opacity: 0,
          y: 34,
          filter: "blur(18px)",
        },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        },
      };

    case "mask":
      return {
        hidden: {
          y: "115%",
          opacity: 0,
        },
        visible: {
          y: "0%",
          opacity: 1,
        },
      };

    case "fade-up":
    default:
      return {
        hidden: {
          opacity: 0,
          y: 48,
        },
        visible: {
          opacity: 1,
          y: 0,
        },
      };
  }
}

/* =========================================================
   STANDARD REVEAL
========================================================= */

export function MotionReveal({
  children,
  preset = "fade-up",
  delay = 0,
  duration = 0.85,
  amount = 0.25,
  once = true,
  className,
  ...props
}: MotionRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div
        className={className}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={createRevealVariants(preset)}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once,
        amount,
      }}
      transition={{
        delay,
        duration,
        ease: premiumEase,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   STAGGER CONTAINER
========================================================= */

/**
 * Wrap multiple StaggerItem components inside this component.
 *
 * Example:
 *
 * <StaggerContainer>
 *   <StaggerItem>Card One</StaggerItem>
 *   <StaggerItem>Card Two</StaggerItem>
 * </StaggerContainer>
 */
export function StaggerContainer({
  children,
  delay = 0,
  stagger = 0.1,
  amount = 0.2,
  once = true,
  className,
  ...props
}: StaggerContainerProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: stagger,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once,
        amount,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   STAGGER ITEM
========================================================= */

export function StaggerItem({
  children,
  preset = "fade-up",
  className,
  ...props
}: StaggerItemProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={createRevealVariants(preset)}
      transition={{
        duration: 0.8,
        ease: premiumEase,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   TEXT MASK REVEAL
========================================================= */

/**
 * Premium heading reveal.
 *
 * The outer element hides the text while it moves upward.
 */
export function TextMaskReveal({
  children,
  className,
  delay = 0,
  duration = 1,
  once = true,
  amount = 0.4,
}: TextMaskRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  // The in-view check watches the outer box, not the moving text. Hidden, the
  // text sits fully below this overflow-hidden box, and the browser reports a
  // fully clipped element as "not in view", so watching it directly meant the
  // reveal often never fired and headings stayed invisible.
  return (
    <motion.div
      className={`overflow-hidden ${
        className ?? ""
      }`}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once,
        amount,
      }}
    >
      <motion.div
        variants={createRevealVariants("mask")}
        transition={{
          delay,
          duration,
          ease: premiumEase,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}