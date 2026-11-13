import Image from "next/image";

import { splitHeading } from "./CmsShared";

type HeroCta = { text: string; link: string };

type CmsSplitHeroData = {
  eyebrow?: string;
  heading: string;
  /** CMS layout: "split" (text + image), "center", or "background" (full-bleed image). */
  layout?: string;
  /** Overlay on a background image: "gradient" (default), "dark" or "none". */
  overlay?: string;
  description?: string;
  meta?: string;
  image?: string;
  cta?: HeroCta;
  secondaryCta?: HeroCta;
};

function Ctas({ cta, secondaryCta, centered }: Pick<CmsSplitHeroData, "cta" | "secondaryCta"> & { centered: boolean }) {
  if (!cta && !secondaryCta) return null;
  return (
    <div className={`mt-9 flex flex-col gap-3 sm:flex-row ${centered ? "sm:justify-center" : ""}`}>
      {cta && (
        <a href={cta.link} className="cms-btn">
          {cta.text}
          <span aria-hidden>→</span>
        </a>
      )}
      {secondaryCta && (
        <a href={secondaryCta.link} className="cms-btn-outline">
          {secondaryCta.text}
        </a>
      )}
    </div>
  );
}

function HeroText({ data, centered, onImage }: { data: CmsSplitHeroData; centered: boolean; onImage: boolean }) {
  const { head, tail } = splitHeading(data.heading);
  return (
    <div className={centered ? "mx-auto max-w-4xl text-center" : "max-w-2xl"}>
      {data.eyebrow && <span className="cms-eyebrow mb-6">{data.eyebrow}</span>}
      <h1 className="text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
        {head}
        {head && " "}
        <span className="text-brand">{tail}</span>
      </h1>
      {data.description && (
        <p
          className={`mt-6 max-w-xl text-base leading-relaxed sm:text-lg ${
            onImage ? "text-white/80" : "text-muted-foreground"
          } ${centered ? "mx-auto" : ""}`}
        >
          {data.description}
        </p>
      )}
      {data.meta && (
        <p className={`mt-6 text-xs uppercase tracking-[0.18em] ${onImage ? "text-white/60" : "text-muted-foreground"}`}>
          {data.meta}
        </p>
      )}
      <Ctas cta={data.cta} secondaryCta={data.secondaryCta} centered={centered} />
    </div>
  );
}

// CMS hero. "split": text beside the image; "center": centred text;
// "background": the image fills the section behind the text.
export default function CmsSplitHero({ data }: { data: CmsSplitHeroData }) {
  const layout = data.layout === "background" && data.image ? "background" : data.layout === "center" ? "center" : "split";

  if (layout === "background") {
    const overlay =
      data.overlay === "none"
        ? ""
        : data.overlay === "dark"
          ? "bg-black/60"
          : "bg-gradient-to-t from-black/90 via-black/55 to-black/20";
    return (
      <section className="cms-hero-bg relative isolate flex min-h-[min(72vh,46rem)] items-end overflow-hidden text-white">
        <Image
          src={data.image!}
          alt=""
          fill
          unoptimized
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        {overlay && <div className={`absolute inset-0 -z-10 ${overlay}`} />}
        <div className="mx-auto w-full max-w-[90vw] px-4 py-24 md:max-w-[84vw] md:px-6 md:py-32">
          <HeroText data={data} centered={false} onImage />
        </div>
      </section>
    );
  }

  const centered = layout === "center" || !data.image;
  return (
    <section className="cms-hero-split relative py-16 md:py-24">
      <div className="mx-auto max-w-[90vw] px-4 md:max-w-[84vw] md:px-6">
        {centered ? (
          <HeroText data={data} centered onImage={false} />
        ) : (
          <div className="grid items-center gap-10 md:grid-cols-[1.05fr_1fr] md:gap-14">
            <HeroText data={data} centered={false} onImage={false} />
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border shadow-2xl shadow-black/40">
              <Image
                src={data.image!}
                alt={data.heading}
                fill
                unoptimized
                priority
                sizes="(min-width: 768px) 42vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
