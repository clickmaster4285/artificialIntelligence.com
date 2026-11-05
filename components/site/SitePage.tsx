import type { ReactNode } from "react";

export function SitePage({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <article className="bg-background px-6 py-16 text-foreground md:px-12 md:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="text-4xl font-semibold tracking-tighter leading-[0.95] md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          {lede}
        </p>
        <div className="mt-12 space-y-8 text-base leading-relaxed text-foreground/90">
          {children}
        </div>
      </div>
    </article>
  );
}
