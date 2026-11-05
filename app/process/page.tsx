import type { Metadata } from "next";
import Link from "next/link";

import { SitePage } from "@/components/site/SitePage";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "How ClickMasters works",
  description:
    "The ClickMasters delivery process, from discovery and architecture through launch and support.",
  alternates: pageAlternates("/process"),
};

const steps = [
  {
    title: "Discover",
    text: "We interview the people who will use the system and the people who own the outcome. The output is a written problem statement, the constraints, and the decision this version must support.",
  },
  {
    title: "Research",
    text: "We inspect the data, the current tools and the adjacent products. Gaps are called out before a timeline is promised, especially where source data is incomplete or access is still pending.",
  },
  {
    title: "Strategy",
    text: "Scope is cut to the smallest release that proves the outcome. Success is defined as something that can be checked after launch, not a list of features.",
  },
  {
    title: "Architecture",
    text: "We choose the model, the application boundary and the integration points. The architecture note names what is built, what is bought, and what is deliberately left out of the first release.",
  },
  {
    title: "UX and interface",
    text: "Flows are prototyped against the real task. Copy, empty states and failure states are part of the design, because an AI product is judged on what it does when it is unsure.",
  },
  {
    title: "Development",
    text: "Work lands in the repository in reviewable increments. You see the running software each week, not a status slide. Feedback changes the next increment, not a backlog that waits until the end.",
  },
  {
    title: "Quality assurance",
    text: "We test the paths users actually take, including bad input, slow dependencies and the cases the model should refuse. Fixes are merged before the release candidate is called done.",
  },
  {
    title: "Security review",
    text: "Access, secrets, logging and dependency risk are reviewed against the environment the system will run in. Findings are fixed or explicitly accepted in writing before launch.",
  },
  {
    title: "Launch",
    text: "Deployment, monitoring and a rollback path are in place before traffic is switched. The first days after launch are staffed so a production issue has an owner.",
  },
  {
    title: "Support",
    text: "After release we watch the metrics that were agreed up front and schedule the next change from evidence, not from a feature wish list.",
  },
];

export default function ProcessPage() {
  return (
    <SitePage
      eyebrow="Process"
      title="A sequence you can follow."
      lede="Every engagement uses the same ten stages. The length of each stage changes with the project. The order does not, because skipping a stage is how estimates go wrong."
    >
      <ol className="space-y-6">
        {steps.map((step, index) => (
          <li key={step.title} className="border-t border-border/40 pt-6">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {String(index + 1).padStart(2, "0")} {step.title}
            </h2>
            <p className="mt-2">{step.text}</p>
          </li>
        ))}
      </ol>
      <p>
        If you already know the problem, start at{" "}
        <Link className="border-b border-foreground pb-0.5" href="/contact">
          contact
        </Link>
        . If you want to see the kinds of systems this process is used for, read{" "}
        <Link className="border-b border-foreground pb-0.5" href="/work">
          the work
        </Link>
        .
      </p>
    </SitePage>
  );
}
