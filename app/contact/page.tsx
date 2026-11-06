import type { Metadata } from "next";
import Link from "next/link";

import { ContactDetails } from "@/components/site/ContactDetails";
import { SitePage } from "@/components/site/SitePage";
import { COMPANY } from "@/lib/company";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact the ClickMasters AI Studio",
  description:
    "Email ClickMasters or call the UK, US, or Pakistan number. A senior engineer replies from this domain.",
  alternates: pageAlternates("/contact"),
};

export default function ContactPage() {
  return (
    <SitePage
      eyebrow="Contact"
      title="Talk to the studio."
      lede="Send a project brief and a senior engineer replies from this domain. Use the form at the bottom of any page, or reach the company directly."
    >
      <ContactDetails className="rounded-3xl border border-border/50 bg-card px-6 py-6 text-muted-foreground" />

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          What to include
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>The product or workflow you want to build.</li>
          <li>Who uses it, and which systems it has to talk to.</li>
          <li>The decision you need from us: a fixed estimate, a technical review, or a build plan.</li>
        </ul>
      </section>

      <p>
        The project form asks for your name, email, project type and a short
        description. Those details are sent to our CRM so the right person can
        reply. The privacy notice explains what is stored and how to ask for
        it to be deleted.
      </p>

      <p>
        <Link className="border-b border-foreground pb-0.5" href="/privacy">
          Privacy
        </Link>
        {" · "}
        <Link className="border-b border-foreground pb-0.5" href="/process">
          How an engagement runs
        </Link>
      </p>

      <p className="text-sm text-muted-foreground">{COMPANY.legalName}.</p>
    </SitePage>
  );
}
