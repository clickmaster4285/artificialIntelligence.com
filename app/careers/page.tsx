import type { Metadata } from "next";
import Link from "next/link";

import { SitePage } from "@/components/site/SitePage";
import { COMPANY } from "@/lib/company";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "Careers at ClickMasters",
  description:
    "How to apply to ClickMasters Artificial Intelligence Company. Send work you can walk through, not a generic portfolio dump.",
  alternates: pageAlternates("/careers"),
};

export default function CareersPage() {
  return (
    <SitePage
      eyebrow="Careers"
      title="Build the product with us."
      lede="We hire engineers, designers and product people who can take a problem from a conversation to software that is in use. Open roles are listed here only when we are actively hiring for them."
    >
      <p>
        There is no open role posted on this page right now. Applications are
        still read. If the work on the site is the work you want to do, write
        to us and point at something you shipped.
      </p>
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          What to send
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>A short note on the kind of product you want to build next.</li>
          <li>One project you can explain end to end, including the part that failed.</li>
          <li>Where you work from, and when you can start a conversation.</li>
        </ul>
      </section>
      <p>
        Email{" "}
        <a className="border-b border-foreground pb-0.5" href={`mailto:${COMPANY.email}`}>
          {COMPANY.email}
        </a>{" "}
        with the subject line “Careers”. We reply either way when we have read
        the note. Please do not send a résumé as the only content of the email.
      </p>
      <p>
        Read{" "}
        <Link className="border-b border-foreground pb-0.5" href="/about">
          about the studio
        </Link>{" "}
        and{" "}
        <Link className="border-b border-foreground pb-0.5" href="/process">
          the delivery process
        </Link>{" "}
        before you write. The note is more useful when it is specific to how we
        work.
      </p>
    </SitePage>
  );
}
