// src/components/landingPage/HugeHero.tsx

'use client';

import { motion } from 'framer-motion';

const HEADING = "Unlock the Power of Intelligent Automation.";

interface HugeHeroProps {
  visible: boolean;
}

const words = ["Unlock", "the", "Power", "of", "Intelligent", "Automation."];

export function HugeHero({ visible }: HugeHeroProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden text-white">
      {/* Background video */}
      <video
        src="/video/ai.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Overlays */}
      <div aria-hidden className="absolute inset-0 z-[1] bg-black/55" />
      <div
        aria-hidden
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.9) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-[2] opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Hero content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/70 mb-6"
        >
          <span className="w-8 h-px bg-white/70" />
          Software House · Est. 2018
        </motion.span>

        <h1
          aria-label={HEADING}
          className={`hero-heading text-[10vw] lg:text-[6vw] leading-[1.34] font-semibold tracking-tighter max-w-[1100px]${visible ? " is-in" : ""}`}
        >
          {words.map((word, index) => (
            <span key={word}>
              <span className="hero-word">
                <span
                  className={index >= 4 ? "hero-word-inner hero-word-gradient" : "hero-word-inner"}
                  style={{ animationDelay: `${0.25 + index * 0.12}s` }}
                >
                  {word}
                </span>
              </span>
              {index < words.length - 1 ? " " : null}
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-4xl"
        >
          <p className="max-w-5xl text-base md:text-xl font-semibold text-justify text-white/80">
            ClickMasters Artificial Intelligence Company designs and builds AI products, web platforms, and mobile software for teams that need the system in production. Strategy, design, and engineering stay on one New York team.
          </p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-xs uppercase tracking-widest text-white/70"
      >
        <span>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-10 bg-white/40"
        />
      </motion.div>
    </section>
  );
}