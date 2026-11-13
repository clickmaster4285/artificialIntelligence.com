// lib/cms/cms-to-dynamic.ts
// Converts a page published in the CRM (Nexus CMS) into the site's own page
// format (types/dynamic-page.ts), so CRM pages render with the same
// neural-canvas template, components and styling as every other page on the
// site. The CRM supplies content only; the look always comes from the site.
//
// CRM sections without a counterpart in the site's design (images, gallery,
// video, raw HTML) are left out.
import type {
  DynamicPageData,
  DynamicPageSection,
  FeatureCard,
  HeroSection,
  PageAccent,
  PageLink,
  RichTextBlock,
} from "@/types/dynamic-page";
import type { CmsPage, CmsSection } from "@/lib/cms/cms";

type Content = Record<string, unknown>;

/* ------------------------------- helpers ------------------------------- */

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

function pick(content: Content, ...keys: string[]): string {
  for (const key of keys) {
    const value = str(content[key]);
    if (value) return value;
  }
  return "";
}

function items(content: Content): Content[] {
  const value = content.items;
  return Array.isArray(value)
    ? value.filter((item): item is Content => !!item && typeof item === "object" && !Array.isArray(item))
    : [];
}

/** Same-site paths, anchors and http(s)/mailto/tel links only. */
function safeHref(url: string): string {
  if (!url) return "";
  if (url.startsWith("/") && !url.startsWith("//") && !url.includes("\\")) return url;
  if (url.startsWith("#")) return url;
  return /^(https?:|mailto:|tel:)/i.test(url) ? url : "";
}

function link(label: string, href: string): PageLink | undefined {
  const safe = safeHref(href);
  if (!label || !safe) return undefined;
  return { label, href: safe, ...(/^https?:/i.test(safe) ? { external: true } : {}) };
}

function button(content: Content, prefix: string): PageLink | undefined {
  return link(
    pick(content, `${prefix}Label`, `${prefix}Button`),
    pick(content, `${prefix}Url`, `${prefix}Link`),
  );
}

const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", "#39": "'",
  mdash: "—", ndash: "–", hellip: "…", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“",
};

/** HTML fragment → plain text (tags removed, entities decoded, whitespace collapsed). */
function text(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&(#\d+|#x[\da-f]+|[a-z]+\d*|#39);/gi, (match, entity: string) => {
      const lower = entity.toLowerCase();
      if (lower in ENTITIES) return ENTITIES[lower];
      if (lower.startsWith("#x")) return String.fromCodePoint(parseInt(lower.slice(2), 16) || 32);
      if (lower.startsWith("#")) return String.fromCodePoint(Number(lower.slice(1)) || 32);
      return match;
    })
    .replace(/\s+/g, " ")
    .trim();
}

/** Links inside an HTML fragment, as PageLinks. */
function linksIn(html: string): PageLink[] {
  const links: PageLink[] = [];
  for (const match of html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const found = link(text(match[2]), match[1]);
    if (found) links.push(found);
  }
  return links;
}

/**
 * CRM rich text (HTML) → the site's rich-text blocks. Every h1–h6 starts a new
 * block; paragraphs, lists, quotes and links are collected under it.
 */
function htmlToBlocks(html: string, firstHeading = ""): RichTextBlock[] {
  const blocks: RichTextBlock[] = [];
  let current: RichTextBlock = { heading: firstHeading || undefined, paragraphs: [] };
  const flush = () => {
    if (current.heading || current.paragraphs.length || current.bullets?.length || current.quote) {
      blocks.push(current);
    }
  };

  const pattern = /<(h[1-6]|p|ul|ol|blockquote|div)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let matched = false;
  for (const match of html.matchAll(pattern)) {
    matched = true;
    const tag = match[1].toLowerCase();
    const inner = match[2];
    if (tag.startsWith("h")) {
      flush();
      current = { heading: text(inner) || undefined, paragraphs: [] };
    } else if (tag === "ul" || tag === "ol") {
      const bullets = [...inner.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((li) => text(li[1])).filter(Boolean);
      current.bullets = [...(current.bullets ?? []), ...bullets];
    } else if (tag === "blockquote") {
      current.quote = text(inner) || current.quote;
    } else {
      const paragraph = text(inner);
      if (paragraph) current.paragraphs.push(paragraph);
    }
    const links = linksIn(inner);
    if (links.length) current.links = [...(current.links ?? []), ...links];
  }
  // Plain text without block tags.
  if (!matched) {
    for (const paragraph of html.split(/\n{2,}/).map(text).filter(Boolean)) current.paragraphs.push(paragraph);
  }
  flush();
  return blocks;
}

/** Closest of the site's accents to the CRM's primary colour. */
function accentFor(hex?: string): PageAccent {
  const match = /^#?([\da-f]{6}|[\da-f]{3})$/i.exec(hex ?? "");
  if (!match) return "blue";
  const full = match[1].length === 3 ? match[1].replace(/./g, (c) => c + c) : match[1];
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max - min < 0.08) return "violet"; // greys: the site's default accent
  let hue =
    max === r ? ((g - b) / (max - min)) % 6 : max === g ? (b - r) / (max - min) + 2 : (r - g) / (max - min) + 4;
  hue = (hue * 60 + 360) % 360;
  if (hue < 15 || hue >= 330) return "rose";
  if (hue < 50) return "orange";
  if (hue < 165) return "emerald";
  if (hue < 200) return "cyan";
  if (hue < 250) return "blue";
  if (hue < 300) return "violet";
  return "rose";
}

const ICONS: NonNullable<FeatureCard["icon"]>[] = [
  "sparkles", "layers", "workflow", "shield", "chart", "brain", "code", "network", "cloud", "search", "bot", "database",
];

/* ------------------------------- sections ------------------------------ */

function base(section: CmsSection, index: number, title = pick(section.content, "heading", "title")) {
  return {
    id: `cms-${section.type.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index + 1}`,
    ...(title ? { title } : {}),
    ...(pick(section.content, "eyebrow") ? { eyebrow: pick(section.content, "eyebrow") } : {}),
    ...(pick(section.content, "description") ? { description: pick(section.content, "description") } : {}),
  };
}

function convertSection(section: CmsSection, index: number, page: CmsPage): DynamicPageSection | null {
  const c = section.content;
  const columns = (n: number) => Math.min(Math.max(Math.round(n), 2), 4) as 2 | 3 | 4;

  switch (section.type) {
    case "features":
    case "services":
    case "benefits":
    case "cards":
    case "bento": {
      const cards = items(c)
        .map((item, i): FeatureCard => ({
          title: pick(item, "title"),
          description: pick(item, "description"),
          icon: ICONS[i % ICONS.length],
          ...(link(pick(item, "linkLabel") || "Learn more", pick(item, "url"))
            ? { link: link(pick(item, "linkLabel") || "Learn more", pick(item, "url")) }
            : {}),
        }))
        .filter((item) => item.title);
      if (!cards.length) return null;
      const requested = typeof section.settings.columns === "number" ? section.settings.columns : 3;
      return {
        ...base(section, index),
        type: "feature-grid",
        variant: section.type === "bento" ? "bento" : cards.length === 4 ? "bento" : "glass",
        columns: columns(requested),
        tone: "default",
        width: "wide",
        animation: "stagger",
        items: cards,
      };
    }

    case "team": {
      const cards = items(c)
        .map((item, i): FeatureCard => ({
          title: pick(item, "name"),
          label: pick(item, "role") || undefined,
          description: pick(item, "bio") || pick(item, "role"),
          icon: ICONS[i % ICONS.length],
        }))
        .filter((item) => item.title);
      if (!cards.length) return null;
      return { ...base(section, index), type: "feature-grid", variant: "glass", columns: 3, width: "wide", animation: "stagger", items: cards };
    }

    case "process":
    case "timeline": {
      const steps = items(c)
        .map((item, i) => ({
          number: String(i + 1).padStart(2, "0"),
          title: pick(item, "title"),
          description: pick(item, "description"),
          ...(pick(item, "date") ? { duration: pick(item, "date") } : {}),
        }))
        .filter((step) => step.title);
      if (!steps.length) return null;
      return { ...base(section, index), type: "process", variant: "vertical-timeline", width: "wide", animation: "stagger", steps };
    }

    case "pricing": {
      const plans = items(c).filter((item) => pick(item, "name"));
      if (!plans.length) return null;
      const firstButton = plans.map((item) => link(pick(item, "buttonLabel"), pick(item, "buttonUrl"))).find(Boolean);
      return {
        ...base(section, index),
        type: "table",
        variant: "pricing",
        tone: "contrast",
        width: "wide",
        animation: "horizontal-reveal",
        columns: [
          { key: "plan", label: "Plan" },
          { key: "price", label: "Price" },
          { key: "includes", label: "What's included" },
        ],
        rows: plans.map((item, i) => {
          const features = pick(item, "features").split(/\r?\n/).map((f) => f.trim()).filter(Boolean);
          return {
            id: `plan-${i + 1}`,
            cells: {
              plan: pick(item, "name"),
              price: `${pick(item, "price")}${pick(item, "period")}`,
              includes: [pick(item, "description"), features.join(" · ")].filter(Boolean).join(" — "),
            },
            ...(item.featured === true ? { highlighted: true, badge: "Popular" } : {}),
          };
        }),
        ...(firstButton ? { cta: firstButton } : {}),
      };
    }

    case "stats": {
      const stats = items(c)
        .map((item) => ({ value: pick(item, "value"), label: pick(item, "label"), ...(pick(item, "description") ? { description: pick(item, "description") } : {}) }))
        .filter((item) => item.value && item.label);
      if (!stats.length) return null;
      return { ...base(section, index), type: "stats", variant: "counter-grid", width: "wide", animation: "stagger", items: stats };
    }

    case "faq": {
      const faqs = items(c)
        .map((item) => ({ question: pick(item, "question", "q"), answer: pick(item, "answer", "a") }))
        .filter((item) => item.question && item.answer);
      if (!faqs.length) return null;
      return {
        ...base(section, index, pick(c, "heading") || "Frequently asked questions"),
        type: "faq",
        variant: "indexed",
        width: "content",
        animation: "fade-up",
        items: faqs,
      };
    }

    case "richText":
    case "customContent":
    case "text":
    case "image":
    case "imageText": {
      const html = pick(c, "bodyHtml") || pick(c, "body").replace(/\n{2,}/g, "</p><p>");
      const heading = pick(c, "heading");
      const blocks = htmlToBlocks(html.startsWith("<") ? html : `<p>${html}</p>`);
      const extra = button(c, "primary") ?? button(c, "button");
      if (extra && blocks.length) blocks[blocks.length - 1].links = [...(blocks[blocks.length - 1].links ?? []), extra];
      if (!blocks.length) return null;
      return {
        ...base(section, index, heading),
        type: "rich-text",
        layout: heading ? "sticky-heading" : "single-column",
        tone: heading ? "surface" : "default",
        width: "content",
        animation: "fade-up",
        blocks,
      };
    }

    case "author": {
      const name = pick(c, "name");
      if (!name) return null;
      const bio = htmlToBlocks(pick(c, "bioHtml")).flatMap((block) => block.paragraphs);
      return {
        ...base(section, index, pick(c, "heading") || "About the author"),
        type: "rich-text",
        layout: "single-column",
        width: "content",
        animation: "fade-up",
        blocks: [{ heading: [name, pick(c, "role")].filter(Boolean).join(" — "), paragraphs: bio }],
      };
    }

    case "testimonials": {
      const blocks = items(c)
        .filter((item) => pick(item, "quote"))
        .map((item) => ({
          quote: pick(item, "quote"),
          paragraphs: [[pick(item, "name"), pick(item, "role")].filter(Boolean).join(", ")].filter(Boolean),
        }));
      if (!blocks.length) return null;
      return { ...base(section, index), type: "rich-text", layout: "two-column", width: "wide", animation: "fade-up", blocks };
    }

    case "logos": {
      const names = items(c).map((item) => pick(item, "name")).filter(Boolean);
      if (!names.length) return null;
      return { ...base(section, index), type: "technologies", variant: "grid", width: "wide", items: names.map((name) => ({ name })) };
    }

    case "blogPosts":
    case "relatedPosts": {
      const limit = typeof c.limit === "number" ? Math.min(Math.max(Math.floor(c.limit), 1), 12) : 3;
      const posts =
        c.mode === "manual"
          ? items(c).map((item) => ({ title: pick(item, "title"), url: pick(item, "url"), excerpt: pick(item, "description", "excerpt") }))
          : page.posts.map((post) => ({ title: post.title, url: post.url, excerpt: post.excerpt }));
      const cards = posts
        .map((post, i): FeatureCard | null => {
          const href = link("Read article", post.url);
          return post.title && href
            ? { title: post.title, description: post.excerpt || post.title, icon: ICONS[i % ICONS.length], link: href }
            : null;
        })
        .filter((card): card is FeatureCard => card !== null)
        .slice(0, limit);
      if (!cards.length) return null;
      return { ...base(section, index), type: "feature-grid", variant: "glass", columns: 3, width: "wide", animation: "stagger", items: cards };
    }

    case "cta":
    case "newsletter":
    case "contact": {
      const heading = pick(c, "heading");
      if (!heading) return null;
      const email = pick(c, "email");
      return {
        ...base(section, index),
        type: "cta",
        variant: "orbital",
        tone: "contrast",
        width: "wide",
        animation: "fade-scale",
        heading,
        ...(pick(c, "description") ? { text: pick(c, "description") } : {}),
        primaryCta:
          button(c, "primary") ??
          link(pick(c, "buttonLabel") || "Contact us", "/contact") ??
          { label: "Contact us", href: "/contact" },
        ...(button(c, "secondary") ? { secondaryCta: button(c, "secondary") } : {}),
        ...(email && /^[^\s@]+@[^\s@]+$/.test(email) ? { contactEmail: email } : {}),
      };
    }

    default:
      // header/footer (the site has its own), image-only sections, gallery,
      // video and raw HTML have no counterpart in the site's design.
      return null;
  }
}

/* --------------------------------- page -------------------------------- */

export function cmsPageToDynamicPage(page: CmsPage): DynamicPageData {
  const heroSection = page.sections.find((section) => section.type === "hero");
  const hc = heroSection?.content ?? {};
  const title = pick(hc, "heading", "title") || page.title;
  const featureNames = page.sections
    .filter((section) => ["features", "services", "benefits", "process"].includes(section.type))
    .flatMap((section) => items(section.content).map((item) => pick(item, "title")))
    .filter(Boolean)
    .slice(0, 5);

  const hero: HeroSection = {
    ...(pick(hc, "eyebrow", "subtitle") ? { eyebrow: pick(hc, "eyebrow", "subtitle") } : {}),
    title,
    description: pick(hc, "description") || page.seo.metaDescription || "",
    primaryCta: button(hc, "primary") ?? { label: "Talk to our team", href: "/contact" },
    ...(button(hc, "secondary") ? { secondaryCta: button(hc, "secondary") } : {}),
    ...(pick(hc, "meta") ? { trustText: pick(hc, "meta") } : {}),
    visual: {
      type: "neural-sphere",
      ...(featureNames.length ? { label: pick(hc, "eyebrow") || page.title, modelNames: featureNames } : {}),
    },
  };

  const sections = page.sections
    .filter((section) => section !== heroSection)
    .map((section, index) => convertSection(section, index, page))
    .filter((section): section is DynamicPageSection => section !== null);

  return {
    slug: page.slug.replace(/^\/+|\/+$/g, ""),
    status: "published",
    seo: {
      title: page.seo.title || page.title,
      description: page.seo.metaDescription || hero.description,
      canonical: page.seo.canonicalUrl || `${page.slug}/`,
      primaryKeyword: page.seo.focusKeyword || title,
      ...(page.seo.ogImage ? { openGraphImage: page.seo.ogImage } : {}),
      noIndex: page.noindex,
    },
    appearance: {
      template: "neural-canvas",
      accent: accentFor(page.designColors.primary),
      background: "neural-grid",
      grain: true,
      glow: true,
      scrollProgress: sections.length > 2,
      customCursor: true,
    },
    hero,
    sections,
  };
}
