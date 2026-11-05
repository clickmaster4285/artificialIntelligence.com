import type { Metadata } from "next";
import Link from "next/link";

import { SitePage } from "@/components/site/SitePage";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work by ClickMasters",
  description:
    "AI systems, web platforms and mobile products built by ClickMasters. Named case studies are published only with client permission.",
  alternates: pageAlternates("/work"),
};

const practices = [
  {
    title: "AI systems",
    text: "Assistants, retrieval pipelines, classifiers and internal tools that sit on your data and your permissions. The model is chosen for the job, and the product is designed for the moment the model is wrong.",
    href: "/ai-development",
    label: "AI development services",
  },
  {
    title: "Web platforms",
    text: "Product sites, authenticated applications and operational dashboards. We build the interface and the service behind it so the thing you click is the thing that ships.",
    href: "/process",
    label: "How a web build runs",
  },
  {
    title: "Mobile products",
    text: "iOS and Android applications with the same source of truth as the web product, when both exist. Offline behavior, account recovery and release process are part of the scope.",
    href: "/contact",
    label: "Start a mobile brief",
  },
  {
    title: "Where the studio works",
    text: "Service pages describe the industries we build for. They explain the system, the delivery shape and the questions to settle before a contract. They are not client endorsements.",
    href: "/ai-development-company",
    label: "Locations and industries",
  },
];

export default function WorkPage() {
  return (
    <SitePage
      eyebrow="Work"
      title="Systems we build."
      lede="This page describes the work. It does not borrow another company's logo or publish a result we cannot attribute. A case study goes up only when the client is named, has agreed, and the outcome can be linked."
    >
      {practices.map((practice) => (
        <section key={practice.title} className="border-t border-border/40 pt-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {practice.title}
          </h2>
          <p className="mt-3">{practice.text}</p>
          <p className="mt-3">
            <Link className="border-b border-foreground pb-0.5" href={practice.href}>
              {practice.label}
            </Link>
          </p>
        </section>
      ))}
      <p>
        The glossary explains the terms we use in proposals, from retrieval to
        evaluation. It is reference material, not a client list.{" "}
        <Link className="border-b border-foreground pb-0.5" href="/glossary">
          Open the glossary
        </Link>
        .
      </p>
    </SitePage>
  );
}
