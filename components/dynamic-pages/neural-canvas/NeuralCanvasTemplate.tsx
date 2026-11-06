import type {
  CSSProperties,
} from "react";

import type {
  DynamicPageData,
  PageAccent,
} from "@/types/dynamic-page";

import { cn } from "@/lib/utils";

import { PageScrollIndicator } from "../shared/PageScrollIndicator";

import { NeuralCanvasHero } from "./NeuralCanvasHero";
import { BreadcrumbTrail, RelatedPages } from "@/components/site/PageContextLinks";
import {
  dynamicBreadcrumbs,
  dynamicRelatedLinks,
} from "@/lib/related-content";

import {
  getNeuralNavigationItems,
  NeuralSectionRenderer,
} from "./NeuralSectionRenderer";

/* =========================================================
   TYPES
========================================================= */

interface NeuralCanvasTemplateProps {
  page: DynamicPageData;
}

interface AccentTheme {
  primary: string;
  secondary: string;
  highlight: string;
  soft: string;
  selection: string;
}

type TemplateCSSProperties =
  CSSProperties &
    Record<
      `--${string}`,
      string | number
    >;

/* =========================================================
   ACCENT THEMES
========================================================= */

const accentThemes: Record<
  PageAccent,
  AccentTheme
> = {
  violet: {
    primary: "#8b5cf6",
    secondary: "#22d3ee",
    highlight: "#e879f9",
    soft: "rgba(139, 92, 246, 0.18)",
    selection:
      "rgba(139, 92, 246, 0.45)",
  },

  cyan: {
    primary: "#22d3ee",
    secondary: "#3b82f6",
    highlight: "#67e8f9",
    soft: "rgba(34, 211, 238, 0.18)",
    selection:
      "rgba(34, 211, 238, 0.4)",
  },

  blue: {
    primary: "#3b82f6",
    secondary: "#6366f1",
    highlight: "#93c5fd",
    soft: "rgba(59, 130, 246, 0.18)",
    selection:
      "rgba(59, 130, 246, 0.42)",
  },

  emerald: {
    primary: "#10b981",
    secondary: "#22d3ee",
    highlight: "#6ee7b7",
    soft: "rgba(16, 185, 129, 0.18)",
    selection:
      "rgba(16, 185, 129, 0.4)",
  },

  orange: {
    primary: "#f97316",
    secondary: "#f43f5e",
    highlight: "#fdba74",
    soft: "rgba(249, 115, 22, 0.18)",
    selection:
      "rgba(249, 115, 22, 0.42)",
  },

  rose: {
    primary: "#f43f5e",
    secondary: "#a855f7",
    highlight: "#fb7185",
    soft: "rgba(244, 63, 94, 0.18)",
    selection:
      "rgba(244, 63, 94, 0.42)",
  },
};

/* =========================================================
   MASTER TEMPLATE
========================================================= */

export function NeuralCanvasTemplate({
  page,
}: NeuralCanvasTemplateProps) {
  const theme =
    accentThemes[
      page.appearance.accent
    ];

  const templateStyles:
    TemplateCSSProperties = {
    "--neural-primary":
      theme.primary,

    "--neural-secondary":
      theme.secondary,

    "--neural-highlight":
      theme.highlight,

    "--neural-soft":
      theme.soft,

    "--neural-selection":
      theme.selection,
  };

  const navigationItems =
    getNeuralNavigationItems(page);

  return (
    <article
      data-page-template="neural-canvas"
      data-page-slug={page.slug}
      style={templateStyles}
      className={cn(
        "relative isolate",
        "overflow-clip",
        "bg-[#050507]",
        "text-white",
        "[color-scheme:dark]",
        "selection:bg-[var(--neural-selection)]",
        "selection:text-white",
      )}
    >
      {/* Accessibility skip link */}
      <a
        href="#dynamic-page-content"
        className={cn(
          "fixed left-4 top-4",
          "z-[150]",
          "-translate-y-24",
          "rounded-full",
          "bg-white",
          "px-5 py-3",
          "text-sm",
          "font-semibold",
          "text-black",
          "transition-transform",
          "focus:translate-y-0",
        )}
      >
        Skip to page content
      </a>

      {/* Global page progress/navigation */}
      {page.appearance
        .scrollProgress && (
        <PageScrollIndicator
          sections={navigationItems}
          showNavigation
        />
      )}

      {/* Fixed atmospheric lighting */}
      {page.appearance.glow && (
        <>
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none",
              "fixed -left-[28rem]",
              "top-[18vh]",
              "z-[-1]",
              "h-[700px]",
              "w-[700px]",
              "rounded-full",
              "bg-[var(--neural-primary)]",
              "opacity-[0.04]",
              "blur-[180px]",
            )}
          />

          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none",
              "fixed -right-[28rem]",
              "top-[58vh]",
              "z-[-1]",
              "h-[700px]",
              "w-[700px]",
              "rounded-full",
              "bg-[var(--neural-secondary)]",
              "opacity-[0.035]",
              "blur-[180px]",
            )}
          />
        </>
      )}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-8">
        <BreadcrumbTrail items={dynamicBreadcrumbs(page)} />
      </div>

      {/* Cinematic hero */}
      <NeuralCanvasHero
        hero={page.hero}
        appearance={page.appearance}
      />

      {/* JSON-controlled content */}
      <div id="dynamic-page-content">
        <NeuralSectionRenderer
          page={page}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16">
        <RelatedPages links={dynamicRelatedLinks(page)} />
      </div>
    </article>
  );
}