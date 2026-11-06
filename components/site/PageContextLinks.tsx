import Link from "next/link";

export type ContextLink = {
  href?: string;
  label: string;
};

export function BreadcrumbTrail({
  items,
  className = "",
}: {
  items: ContextLink[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link className="hover:text-foreground" href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function RelatedPages({
  links,
  title = "Related pages",
  className = "",
}: {
  links: ContextLink[];
  title?: string;
  className?: string;
}) {
  const linked = links.filter(
    (link): link is { href: string; label: string } => Boolean(link.href),
  );

  if (linked.length === 0) return null;

  return (
    <section aria-label={title} className={className}>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {linked.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-2xl border border-border/60 px-4 py-3 text-sm text-foreground/90 hover:border-foreground/40"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CrawlableIndex({
  title,
  intro,
  links,
}: {
  title: string;
  intro: string;
  links: { href: string; label: string }[];
}) {
  return (
    <section aria-label={title} className="py-16">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mt-3 max-w-3xl text-muted-foreground">{intro}</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-2xl border border-border/60 px-4 py-3 text-sm text-foreground/90 hover:border-foreground/40"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
