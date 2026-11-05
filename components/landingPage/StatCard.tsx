export function StatCardSection() {
  return (
    <section className="relative bg-background text-foreground py-32 px-6 md:px-12 overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
      >
        <div
          className="w-full h-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.65 0.25 290), transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
            Studio
          </p>

          <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter leading-[0.95]">
            A small studio.
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.22 290), oklch(0.82 0.20 30))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              A serious craft.
            </span>
          </h2>
        </div>

        <p className="text-lg text-muted-foreground max-w-md">
          Engineers, designers and product strategists work as one team. We
          design and build digital products that are fast, clear and ready to
          be maintained after launch. Numbers go on this site only when they
          have a named, linkable source.
        </p>
      </div>
    </section>
  );
}
