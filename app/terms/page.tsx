import type { Metadata } from "next";
import Link from "next/link";

import { ContactDetails } from "@/components/site/ContactDetails";
import { SitePage } from "@/components/site/SitePage";
import { COMPANY } from "@/lib/company";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "Website Terms of Use | ClickMasters",
  description:
    "Terms for using the ClickMasters Artificial Intelligence Company website.",
  alternates: pageAlternates("/terms"),
};

export default function TermsPage() {
  return (
    <SitePage
      eyebrow="Terms"
      title="Terms of use"
      lede={`These terms govern use of the website operated by ${COMPANY.legalName}. They were last updated on 5 November 2026. A paid engagement is governed by a separate written agreement, not by this page.`}
    >
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          The site
        </h2>
        <p className="mt-3">
          Pages on this domain describe services, a delivery process and
          reference material. They are an invitation to talk. Sending the
          project form or an email does not create a contract, a retainer, or
          an obligation to begin work.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          What you can rely on
        </h2>
        <p className="mt-3">
          We write the pages to be accurate. Service descriptions are general.
          A price, timeline or technical approach for your project is valid
          only when it is in a proposal or statement of work addressed to you.
          Named client results are published only with permission. If a page
          does not name a client and link the result, do not treat it as one.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Your use of the site
        </h2>
        <p className="mt-3">
          You may read the site and share links to it. You may not copy the
          pages into another product, scrape them into a dataset, or present
          the text as your own. You may not attempt to break, overload or
          bypass the site.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Intellectual property
        </h2>
        <p className="mt-3">
          The text, design and code of this website belong to{" "}
          {COMPANY.legalName} or its licensors. Work delivered under a
          contract is owned as that contract says. Nothing on this website
          assigns that work to a visitor.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Liability
        </h2>
        <p className="mt-3">
          The site is provided as published. We do not warrant that every page
          is complete for your situation or that the site will be uninterrupted.
          To the extent the law allows, we are not liable for decisions you
          make solely from reading these pages. Liability for a contracted
          project is set in that contract.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Law
        </h2>
        <p className="mt-3">
          A paid project is governed by the written agreement for that
          project. This page does not name a court. Contact{" "}
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> before
          starting a dispute about the site. See also the{" "}
          <Link className="border-b border-foreground pb-0.5" href="/privacy">
            privacy notice
          </Link>
          .
        </p>
      </section>

      <ContactDetails className="text-muted-foreground" />
    </SitePage>
  );
}
