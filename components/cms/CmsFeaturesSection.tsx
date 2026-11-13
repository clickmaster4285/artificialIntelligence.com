"use client";

import { Marker, splitHeading } from "./CmsShared";

type CmsFeatureItem = { icon?: string; title: string; description?: string; url?: string; linkLabel?: string };

type CmsFeaturesData = {
  eyebrow?: string;
  heading?: string;
  description?: string;
  items: CmsFeatureItem[];
  columns?: number;
};

// Same grid/card treatment as landingPage/Benefits, but with CMS-controlled
// labels instead of the landing page's fixed "05 / Why Automate" header.
// Used for the CMS "features", "services", "benefits", "process" and "cards" types.
export default function CmsFeaturesSection({ data }: { data: CmsFeaturesData }) {
  const { head, tail } = splitHeading(data.heading ?? "");

  return (
    <section className="bg-paper py-12 md:py-24">
      <div className="mx-auto max-w-[90vw] md:max-w-[84vw] px-4 md:px-6">
        {data.eyebrow && (
          <div className="flex items-center w-full gap-3 md:gap-4 mb-8 md:mb-12">
            <div className="flex-1 h-px bg-border" />
            <span className="eyebrow text-muted-foreground whitespace-nowrap text-xs md:text-sm">
              {data.eyebrow}
            </span>
          </div>
        )}

        {(data.heading || data.description) && (
          <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
            <h2 className="display text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              {head}
              {head && <br />}
              <span className="display-italic text-brand">{tail}</span>
            </h2>
            {data.description && (
              <p className="text-base md:text-lg text-muted-foreground md:text-right md:self-end">
                {data.description}
              </p>
            )}
          </div>
        )}

        <div
          className="cms-feature-grid grid grid-cols-1 sm:grid-cols-2 gap-4"
          style={
            {
              "--cms-columns": Math.min(Math.max(data.columns ?? 3, 1), 6),
            } as React.CSSProperties
          }
        >
          {data.items.map((item, i) => (
            <div
              key={i}
              className="cms-stagger group rounded-2xl border border-border bg-card p-7 transition-colors duration-300 hover:border-brand/50"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-center justify-between py-4">
                <Marker n={String(i + 1).padStart(2, "0")} />
                {item.icon && <span className="text-2xl" aria-hidden>{item.icon}</span>}
              </div>
              <h3 className="display text-2xl md:text-3xl mb-3">{item.title}</h3>
              {item.description && (
                <p className="text-sm md:text-md text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              )}
              {item.url && (
                <a
                  href={item.url}
                  className="inline-block mt-4 text-sm font-medium text-brand transition-colors"
                >
                  {item.linkLabel || "Learn more"} ›
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
