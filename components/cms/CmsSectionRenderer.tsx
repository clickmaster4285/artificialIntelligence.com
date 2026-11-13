// components/cms/CmsSectionRenderer.tsx
// Maps Nexus CMS section JSON onto ClickMasters components.
// The CMS controls content only; styling always comes from these components.
// Unknown section types (currently "newsletter", "columns", "html") are
// skipped, and nothing from the CMS is ever
// injected as raw HTML or executed as script (rich text goes through
// CmsRichText's allow-list).

import Link from "next/link";
import CmsTextSection from "./CmsTextSection";
import CmsFeaturesSection from "./CmsFeaturesSection";
import CmsSplitHero from "./CmsSplitHero";
import CmsRichTextSection from "./CmsRichTextSection";
import CmsAuthorSection from "./CmsAuthorSection";
import CmsPostsSection, { type CmsPostCard } from "./CmsPostsSection";
import CmsStatsSection from "./CmsStatsSection";
import CmsImageTextSection from "./CmsImageTextSection";
import CmsTestimonialsSection from "./CmsTestimonialsSection";
import CmsTeamSection from "./CmsTeamSection";
import CmsTimelineSection from "./CmsTimelineSection";
import CmsPricingSection from "./CmsPricingSection";
import CmsGallerySection from "./CmsGallerySection";
import CmsLogosSection from "./CmsLogosSection";
import CmsVideoSection, { videoEmbedUrl } from "./CmsVideoSection";
import CmsContactSection from "./CmsContactSection";
import CmsBentoSection from "./CmsBentoSection";
import CmsRichText from "./CmsRichText";
import { button, items, pick, safeHref, safeImage } from "./cmsContent";
import type { CmsPage, CmsSection } from "@/lib/cms/cms";
import { isSafeStyle } from "@/lib/cms/erp-edits-shared";

// The site's own Nav/Footer (app/layout.tsx) replace the CMS chrome sections.
const SITE_CHROME = new Set(["header", "navbar", "footer"]);
const GRID_TYPES = new Set(["features", "services", "benefits", "process", "cards"]);
const KNOWN_TYPES = new Set([
  ...SITE_CHROME,
  "hero", "text", "richText", "image", "imageText", "video", "cards",
  "features", "services", "benefits", "process", "timeline", "testimonials",
  "team", "pricing", "faq", "gallery", "stats", "logos", "cta", "contact",
  "newsletter", "blogPosts", "relatedPosts", "author", "customContent", "html",
  "bento",
]);

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function postCards(section: CmsSection, page: CmsPage): CmsPostCard[] {
  const c = section.content;
  const cards: CmsPostCard[] =
    c.mode === "manual"
      ? items(c).map((i) => ({
          title: pick(i, "title"),
          url: safeHref(pick(i, "url")),
          excerpt: pick(i, "description", "excerpt"),
          image: safeImage(pick(i, "image")),
        }))
      : page.posts.map((p) => ({
          title: p.title,
          url: safeHref(p.url),
          excerpt: p.excerpt,
          image: safeImage(p.image),
          date: formatDate(p.publishedAt),
        }));
  const limit = typeof c.limit === "number" ? Math.min(Math.max(Math.floor(c.limit), 1), 24) : 3;
  return cards.filter((p) => p.title && p.url).slice(0, limit);
}

function renderSection(section: CmsSection, page: CmsPage) {
  const c = section.content;
  const type = section.type;

  if (SITE_CHROME.has(type)) return null;

  if (GRID_TYPES.has(type)) {
    const list = items(c)
      .map((i) => ({
        icon: pick(i, "icon"),
        title: pick(i, "title"),
        description: pick(i, "description"),
        url: safeHref(pick(i, "url")),
        linkLabel: pick(i, "linkLabel"),
      }))
      .filter((i) => i.title);
    if (!list.length) return null;
    return (
      <CmsFeaturesSection
        data={{
          eyebrow: pick(c, "eyebrow"),
          heading: pick(c, "heading"),
          description: pick(c, "description"),
          items: list,
          columns: typeof section.settings.columns === "number" ? section.settings.columns : undefined,
        }}
      />
    );
  }

  switch (type) {
    case "hero": {
      const headline = pick(c, "heading", "title");
      if (!headline) return null;
      const image = safeImage(pick(c, "image", "backgroundImage"));
      return (
        <CmsSplitHero
          data={{
            eyebrow: pick(c, "eyebrow", "subtitle"),
            heading: headline,
            layout: typeof section.settings.layout === "string" ? section.settings.layout : undefined,
            overlay: typeof section.settings.overlay === "string" ? section.settings.overlay : undefined,
            description: pick(c, "description"),
            meta: pick(c, "meta"),
            image,
            cta: button(c, "primary"),
            secondaryCta: button(c, "secondary"),
          }}
        />
      );
    }

    case "text": {
      const heading = pick(c, "heading");
      const body = pick(c, "body");
      if (!heading && !body) return null;
      return <CmsTextSection data={{ eyebrow: pick(c, "eyebrow"), heading, body }} />;
    }

    case "richText":
    case "customContent": {
      const html = pick(c, "bodyHtml");
      if (!html) return null;
      return (
        <CmsRichTextSection data={{ heading: pick(c, "heading"), html, wide: section.settings.width === "wide" }} />
      );
    }

    case "html": {
      const html = pick(c, "code", "html");
      return html ? <CmsRichText html={html} /> : null;
    }

    case "image":
    case "imageText": {
      const image = safeImage(pick(c, "image"));
      const bodyHtml = pick(c, "bodyHtml");
      if (!image && !bodyHtml) return null;
      return (
        <CmsImageTextSection
          data={{
            eyebrow: pick(c, "eyebrow"),
            heading: pick(c, "heading"),
            bodyHtml,
            image,
            alt: pick(c, "alt"),
            caption: pick(c, "caption"),
            cta: button(c, "primary") ?? button(c, "button"),
            imageFirst: section.settings.imagePosition === "left",
          }}
        />
      );
    }

    case "stats": {
      const list = items(c)
        .map((i) => ({ value: pick(i, "value"), label: pick(i, "label") }))
        .filter((i) => i.value);
      if (!list.length) return null;
      return <CmsStatsSection data={{ heading: pick(c, "heading"), description: pick(c, "description"), items: list }} />;
    }

    case "bento": {
      const list = items(c)
        .map((i) => ({
          title: pick(i, "title"),
          description: pick(i, "description"),
          span: pick(i, "span"),
          image: safeImage(pick(i, "image")),
        }))
        .filter((i) => i.title);
      if (!list.length) return null;
      return <CmsBentoSection data={{ heading: pick(c, "heading"), items: list }} />;
    }

    case "author": {
      const name = pick(c, "name");
      if (!name) return null;
      return (
        <CmsAuthorSection
          data={{
            label: pick(c, "heading"),
            name,
            role: pick(c, "role"),
            image: safeImage(pick(c, "image")),
            bioHtml: pick(c, "bioHtml"),
          }}
        />
      );
    }

    case "blogPosts":
    case "relatedPosts": {
      const posts = postCards(section, page);
      if (!posts.length) return null;
      return <CmsPostsSection data={{ heading: pick(c, "heading"), description: pick(c, "description"), posts }} />;
    }

    case "testimonials": {
      const list = items(c)
        .map((i) => ({ quote: pick(i, "quote"), name: pick(i, "name"), role: pick(i, "role"), image: safeImage(pick(i, "image")) }))
        .filter((i) => i.quote);
      if (!list.length) return null;
      return <CmsTestimonialsSection data={{ heading: pick(c, "heading"), items: list }} />;
    }

    case "team": {
      const list = items(c)
        .map((i) => ({ name: pick(i, "name"), role: pick(i, "role"), image: safeImage(pick(i, "image")), bio: pick(i, "bio") }))
        .filter((i) => i.name);
      if (!list.length) return null;
      return <CmsTeamSection data={{ heading: pick(c, "heading"), description: pick(c, "description"), items: list }} />;
    }

    case "timeline": {
      const list = items(c)
        .map((i) => ({ date: pick(i, "date"), title: pick(i, "title"), description: pick(i, "description") }))
        .filter((i) => i.title);
      if (!list.length) return null;
      return <CmsTimelineSection data={{ heading: pick(c, "heading"), description: pick(c, "description"), items: list }} />;
    }

    case "pricing": {
      const list = items(c)
        .map((i) => {
          const text = pick(i, "buttonLabel");
          const link = safeHref(pick(i, "buttonUrl"));
          return {
            name: pick(i, "name"),
            price: pick(i, "price"),
            period: pick(i, "period"),
            description: pick(i, "description"),
            features: pick(i, "features").split(/\r?\n/).map((f) => f.trim()).filter(Boolean),
            cta: text && link ? { text, link } : undefined,
            featured: i.featured === true,
          };
        })
        .filter((i) => i.name);
      if (!list.length) return null;
      return <CmsPricingSection data={{ heading: pick(c, "heading"), description: pick(c, "description"), items: list }} />;
    }

    case "gallery": {
      const list = items(c)
        .map((i) => ({ image: safeImage(pick(i, "image")), caption: pick(i, "caption") }))
        .filter((i) => i.image);
      if (!list.length) return null;
      return <CmsGallerySection data={{ heading: pick(c, "heading"), description: pick(c, "description"), items: list }} />;
    }

    case "logos": {
      const list = items(c)
        .map((i) => ({ image: safeImage(pick(i, "image")), name: pick(i, "name"), url: safeHref(pick(i, "url")) }))
        .filter((i) => i.image || i.name);
      if (!list.length) return null;
      return <CmsLogosSection data={{ heading: pick(c, "heading"), items: list }} />;
    }

    case "video": {
      const embedUrl = videoEmbedUrl(pick(c, "videoUrl"));
      if (!embedUrl) return null;
      return <CmsVideoSection data={{ heading: pick(c, "heading"), description: pick(c, "description"), embedUrl }} />;
    }

    case "contact":
      return (
        <CmsContactSection
          data={{
            heading: pick(c, "heading"),
            description: pick(c, "description"),
            email: pick(c, "email"),
            phone: pick(c, "phone"),
            address: pick(c, "address"),
            buttonLabel: pick(c, "buttonLabel"),
          }}
        />
      );

    case "newsletter": {
      const heading = pick(c, "heading");
      const description = pick(c, "description");
      if (!heading && !description) return null;
      return (
        <section className="bg-paper py-12 md:py-24">
          <div className="mx-auto max-w-3xl px-4 md:px-6 text-center">
            {heading && <h2 className="display text-3xl sm:text-4xl md:text-5xl">{heading}</h2>}
            {description && <p className="mt-4 text-base md:text-lg text-muted-foreground">{description}</p>}
            <Link href="/contact" className="cms-btn mt-8">
              {pick(c, "buttonLabel") || "Get in touch"}
            </Link>
          </div>
        </section>
      );
    }

    case "faq": {
      const list = items(c)
        .map((i) => ({ question: pick(i, "question", "q"), answer: pick(i, "answer", "a") }))
        .filter((i) => i.question && i.answer);
      if (!list.length) return null;
      return (
        <section className="bg-paper py-12 md:py-24">
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <h2 className="display text-3xl sm:text-4xl md:text-5xl">
              {pick(c, "heading") || "Frequently asked questions"}
            </h2>
            {pick(c, "description") && (
              <p className="mt-4 text-base md:text-lg text-muted-foreground">
                {pick(c, "description")}
              </p>
            )}
            <div className="mt-8 divide-y divide-border border-y border-border">
              {list.map((item, index) => (
                <details key={`${item.question}-${index}`} className="cms-faq group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-medium md:text-lg">
                    {item.question}
                    <span aria-hidden className="text-2xl leading-none text-brand transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "cta": {
      const heading = pick(c, "heading");
      const description = pick(c, "description");
      const cta = button(c, "primary");
      if (!heading) return null;
      const secondaryCta = button(c, "secondary");
      const renderCta = (link: { text: string; link: string }, className: string) =>
        link.link.startsWith("/") ? (
          <Link className={className} href={link.link}>
            {link.text}
          </Link>
        ) : (
          <a className={className} href={link.link} rel="noopener noreferrer">
            {link.text}
          </a>
        );
      return (
        <section className="cms-cta py-12 md:py-24">
          <div className="mx-auto max-w-4xl px-4 md:px-6 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">{heading}</h2>
            {description && <p className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">{description}</p>}
            {(cta || secondaryCta) && (
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {cta && renderCta(cta, "cms-btn")}
                {secondaryCta && renderCta(secondaryCta, "cms-btn-outline")}
              </div>
            )}
          </div>
        </section>
      );
    }

    default:
      return null;
  }
}

export default function CmsSectionRenderer({ page }: { page: CmsPage }) {
  return (
    <>
      {page.sections.map((section) => {
        if (!KNOWN_TYPES.has(section.type)) return null;
        const content = renderSection(section, page);
        const background = ["primary", "muted", "dark", "light", "gradient"].includes(
          String(section.settings.background),
        )
          ? String(section.settings.background)
          : undefined;
        const paddingY = Array.isArray(section.settings.paddingY)
          ? section.settings.paddingY
          : null;
        const top = typeof paddingY?.[0] === "number" ? paddingY[0] : undefined;
        const bottom = typeof paddingY?.[1] === "number" ? paddingY[1] : undefined;
        // Padding goes through CSS variables so globals.css can scale it down on phones.
        const styles: Record<string, string | number> = {};
        if (top !== undefined && top >= 0 && top <= 500) styles["--cms-pt"] = `${top}px`;
        if (bottom !== undefined && bottom >= 0 && bottom <= 500) styles["--cms-pb"] = `${bottom}px`;
        for (const [rawProperty, rawValue] of Object.entries(section.styles)) {
          if (typeof rawValue !== "string") continue;
          const property = rawProperty.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).toLowerCase();
          if (isSafeStyle(property, rawValue)) {
            styles[property] = rawValue;
          }
        }
        const hasPadding = top !== undefined || bottom !== undefined;
        const motion =
          typeof section.settings.motion === "string" &&
          ["fade-up", "fade-in", "slide-in"].includes(section.settings.motion)
            ? section.settings.motion
            : undefined;
        return (
          <div
            key={section.id}
            className="cms-section"
            data-cms-section={section.type}
            data-layout={typeof section.settings.layout === "string" ? section.settings.layout : undefined}
            data-width={["narrow", "wide", "superWide", "full"].includes(String(section.settings.width)) ? section.settings.width : undefined}
            data-background={background}
            data-has-padding={hasPadding || undefined}
            data-motion={motion}
            style={styles as React.CSSProperties}
          >
            {content ?? (section.settings.required === true ? <section aria-label={pick(section.content, "heading") || section.type} /> : null)}
          </div>
        );
      })}
    </>
  );
}
