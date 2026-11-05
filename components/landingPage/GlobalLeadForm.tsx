"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  Sparkles,
} from "lucide-react";
import { COMPANY } from "@/lib/company";
import { submitLeadToCrm } from "@/lib/crm";

const projectTypes = [
  "AI product",
  "RAG / LLM system",
  "Web platform",
  "Mobile app",
  "Product redesign",
];

export function GlobalLeadForm() {
  const [submitted, setSubmitted] =
    useState(false);
  const [submitting, setSubmitting] =
    useState(false);
  const [submitError, setSubmitError] =
    useState("");

  return (
    <section className="relative overflow-hidden border-t border-border/30 bg-background px-6 py-16 text-foreground md:px-12 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-10 h-[28rem] w-[28rem] rounded-full bg-violet-500/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-0 h-[24rem] w-[24rem] rounded-full bg-cyan-400/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-border/60 bg-foreground/[0.03] px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            Start a Project
          </div>

          <h2 className="text-4xl font-semibold leading-[0.96] tracking-tighter md:text-6xl lg:text-7xl">
            Tell us what you want to{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text font-serif italic font-normal text-transparent">
              ship
            </span>
            .
          </h2>

          <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
            Share the goal, the timeline and what already exists. We will turn it into a clear build path, estimate and next-step recommendation.
          </p>

          <div className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            {[
              "24-hour response",
              "Fixed-scope options",
              "Senior technical review",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                {item}
              </div>
            ))}
          </div>

          <a
            href={`mailto:${COMPANY.email}`}
            className="mt-8 inline-flex items-center gap-3 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4 text-violet-400" />
            {COMPANY.email}
          </a>
        </div>

        <form
          className="glass relative overflow-hidden rounded-3xl p-5 shadow-[0_40px_120px_-70px_rgba(139,92,246,0.9)] md:p-7"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const formData = new FormData(form);

            setSubmitError("");
            setSubmitting(true);

            try {
              await submitLeadToCrm({
                name: String(formData.get("name") ?? ""),
                email: String(formData.get("email") ?? ""),
                message: [
                  String(formData.get("message") ?? ""),
                  formData.get("projectType")
                    ? `Project Type: ${formData.get("projectType")}`
                    : "",
                  formData.get("budget")
                    ? `Budget: ${formData.get("budget")}`
                    : "",
                ]
                  .filter(Boolean)
                  .join("\n"),
              });

              form.reset();
              setSubmitted(true);
            } catch {
              setSubmitError(
                "Something went wrong while sending your message. Please try again.",
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Name
              </span>
              <input
                name="name"
                required
                placeholder="Your name"
                className="h-12 rounded-2xl border border-border/60 bg-background/60 px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/55 focus:border-violet-400"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Email
              </span>
              <input
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                className="h-12 rounded-2xl border border-border/60 bg-background/60 px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/55 focus:border-violet-400"
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Project Type
              </span>
              <select
                name="projectType"
                required
                defaultValue=""
                className="h-12 rounded-2xl border border-border/60 bg-background/60 px-4 text-sm outline-none transition-colors focus:border-violet-400"
              >
                <option value="" disabled>
                  Select one
                </option>
                {projectTypes.map((type) => (
                  <option key={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Budget
              </span>
              <select
                name="budget"
                required
                defaultValue=""
                className="h-12 rounded-2xl border border-border/60 bg-background/60 px-4 text-sm outline-none transition-colors focus:border-violet-400"
              >
                <option value="" disabled>
                  Select range
                </option>
                <option>$20K - $50K</option>
                <option>$50K - $100K</option>
                <option>$100K - $250K</option>
                <option>$250K+</option>
              </select>
            </label>
          </div>

          <label className="mt-4 grid gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              What are we building?
            </span>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Tell us about the product, data, users, timeline or technical problem."
              className="min-h-36 resize-y rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-sm leading-6 outline-none transition-colors placeholder:text-muted-foreground/55 focus:border-violet-400"
            />
          </label>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={submitting}
              className="group inline-flex h-12 items-center justify-center gap-3 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Sending..."
                : "Send project brief"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            <p className="text-xs leading-5 text-muted-foreground">
              No spam. Just a senior review and a clear next step.
            </p>
          </div>

          {submitError && (
            <div className="mt-5 rounded-2xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {submitError}
            </div>
          )}

          {submitted && (
            <div className="mt-5 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
              Thanks. Your brief is ready for review. For immediate help, email {COMPANY.email}.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
