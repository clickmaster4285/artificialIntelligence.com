import type { Metadata } from "next";
import Link from "next/link";

import { ContactDetails } from "@/components/site/ContactDetails";
import { SitePage } from "@/components/site/SitePage";
import { COMPANY } from "@/lib/company";
import { getRequestSiteUrl, pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy notice",
  description:
    "How ClickMasters Artificial Intelligence Company collects, uses and deletes information submitted through this website.",
  alternates: pageAlternates("/privacy"),
};

export default async function PrivacyPage() {
  const siteUrl = await getRequestSiteUrl();

  return (
    <SitePage
      eyebrow="Privacy"
      title="Privacy notice"
      lede={`This notice describes what ${COMPANY.legalName} collects on ${siteUrl.replace("https://", "")} and what we do with it. It was last updated on 5 November 2026.`}
    >
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Who is responsible
        </h2>
        <p className="mt-3">
          {COMPANY.legalName}, {COMPANY.address.locality}, {COMPANY.address.region},{" "}
          {COMPANY.address.countryName}, is the business that operates this
          website. Questions about this notice go to{" "}
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> or{" "}
          <a href={`tel:${COMPANY.telephone}`}>{COMPANY.telephone}</a>.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          What we collect
        </h2>
        <p className="mt-3">
          If you send the project form, we collect your name, email address,
          the project type you select, and the message you write. The form
          also sends the page you were on, the referring URL, and any UTM
          parameters present in the address bar. Those fields tell us which
          page the enquiry came from.
        </p>
        <p className="mt-3">
          If you email or call us, we keep the correspondence we need to answer
          you. We do not ask you to create an account on this website, and we
          do not run advertising pixels.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Why we collect it
        </h2>
        <p className="mt-3">
          We use the information to reply to the enquiry, prepare an estimate,
          and keep a record of the conversation. We do not sell the information
          and we do not use it to build an advertising profile.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Where it is stored
        </h2>
        <p className="mt-3">
          Form submissions are sent to the ClickMasters lead system at
          crm.clickmasters.pk so the studio can answer them. The site itself
          is served from this domain. Access is limited to people who handle
          enquiries and delivery.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          How long we keep it
        </h2>
        <p className="mt-3">
          Enquiry records are kept while the conversation is active and for up
          to 24 months after the last message, unless a contract requires a
          longer record or you ask us to delete them sooner.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Your requests
        </h2>
        <p className="mt-3">
          Email {COMPANY.email} to ask for a copy of the enquiry we hold, to
          correct it, or to delete it. We will respond to that request. Cookie
          details are on the{" "}
          <Link className="border-b border-foreground pb-0.5" href="/cookies">
            cookies
          </Link>{" "}
          page. The terms of using the site are on the{" "}
          <Link className="border-b border-foreground pb-0.5" href="/terms">
            terms
          </Link>{" "}
          page.
        </p>
      </section>

      <ContactDetails className="text-muted-foreground" />
    </SitePage>
  );
}
