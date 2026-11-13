import Link from "next/link";

// data-not-found lets components/cms/ErpPageEdits notice when a page shown as
// "not found" has since been published in the CRM, and swap it in live.
export default function NotFound() {
  return (
    <section data-not-found className="relative isolate flex min-h-[70vh] items-center overflow-hidden px-4 py-24">
      <div
        aria-hidden
        className="absolute left-1/2 top-1/3 -z-10 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl"
      />
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Page not found</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          The page you are looking for does not exist or has moved.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition-colors hover:border-white/50"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
