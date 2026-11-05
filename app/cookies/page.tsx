import type { Metadata } from "next";
import Link from "next/link";

import { SitePage } from "@/components/site/SitePage";
import { COMPANY } from "@/lib/company";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie notice",
  description:
    "Cookies used by the ClickMasters Artificial Intelligence Company website.",
  alternates: pageAlternates("/cookies"),
};

export default function CookiesPage() {
  return (
    <SitePage
      eyebrow="Cookies"
      title="Cookie notice"
      lede={`This page lists the cookies ${COMPANY.legalName} uses on this website. It was last updated on 5 November 2026.`}
    >
      <p>
        This site does not run third-party advertising cookies and it does not
        embed social trackers. A visit can still store a small amount of data
        that the site needs in order to load and to remember a form while you
        are using it.
      </p>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          What may be stored
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>
            A strictly necessary cookie or equivalent browser storage used by
            the site framework to serve the page and keep a session stable.
          </li>
          <li>
            Nothing is written by an advertising network, because no advertising
            network is loaded.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          How to remove them
        </h2>
        <p className="mt-3">
          Use your browser settings to block or delete cookies for this domain.
          Blocking strictly necessary storage can stop the project form from
          submitting. The form itself sends the fields you type to our lead
          system; that transfer is described in the{" "}
          <Link className="border-b border-foreground pb-0.5" href="/privacy">
            privacy notice
          </Link>
          , and it is not a cookie.
        </p>
      </section>

      <p>
        Questions:{" "}
        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
        {" · "}
        <a href={`tel:${COMPANY.telephone}`}>{COMPANY.telephone}</a>
      </p>
    </SitePage>
  );
}
