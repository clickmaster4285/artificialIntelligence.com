import type { Metadata } from "next";
import Link from "next/link";

import { ContactDetails } from "@/components/site/ContactDetails";
import { SitePage } from "@/components/site/SitePage";
import { COMPANY } from "@/lib/company";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "About ClickMasters",
  description:
    "ClickMasters Artificial Intelligence Company designs and builds AI products, web platforms and mobile software from New York.",
  alternates: pageAlternates("/about"),
};

export default function AboutPage() {
  return (
    <SitePage
      eyebrow="About"
      title="A software studio for AI products."
      lede={`${COMPANY.legalName} was founded in ${COMPANY.foundingYear}. We design, engineer and ship software for teams that need a product, not a slide deck.`}
    >
      <p>
        The studio works across custom AI systems, web platforms and mobile
        applications. A typical engagement starts with the constraint that
        actually matters: the data you have, the workflow you want to change,
        and the date the first version has to be in front of users.
      </p>
      <p>
        Engineers and designers sit in one team. Strategy, interface and
        implementation are sequenced so a decision made in week one is still
        visible in the code that ships. We write the software, hand over the
        repository, and stay available for the release.
      </p>
      <p>
        Client names, result metrics and testimonials appear on this site only
        when the client has agreed to be named and the claim can be linked to
        a public source. Until that permission exists, we describe the work
        by the kind of system we build.
      </p>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Studio
        </h2>
        <dl className="mt-4 space-y-3">
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Legal name
            </dt>
            <dd>{COMPANY.legalName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Founded
            </dt>
            <dd>{COMPANY.foundingYear}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Location
            </dt>
            <dd>
              {COMPANY.address.locality}, {COMPANY.address.region},{" "}
              {COMPANY.address.countryName}
            </dd>
          </div>
        </dl>
      </section>

      <ContactDetails className="text-muted-foreground" />

      <p>
        <Link className="border-b border-foreground pb-0.5" href="/work">
          What we build
        </Link>
        {" · "}
        <Link className="border-b border-foreground pb-0.5" href="/careers">
          Careers
        </Link>
      </p>
    </SitePage>
  );
}
