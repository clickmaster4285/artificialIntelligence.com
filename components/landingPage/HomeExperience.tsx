"use client";

import { useEffect, useState } from "react";

import { HugePreloader } from "@/components/landingPage/HugePreloader";
import { HugeHero } from "@/components/landingPage/HugeHero";
import { HugeAbout } from "@/components/landingPage/HugeAbout";
import { HugeProcess } from "@/components/landingPage/HugeProcess";
import { HugeLogos } from "@/components/landingPage/HugeLogos";
import { HugeScrollSection } from "@/components/landingPage/HugeScrollSection";
import { StatCardSection } from "@/components/landingPage/StatCard";
import { ScrollVideoSection } from "@/components/landingPage/ScrollVideoSection";
import AiTagSliderSection from "@/components/landingPage/AiTagSliderSection";

export function HomeExperience() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [loaded]);

  return (
    <div className="bg-background">
      <HugePreloader onComplete={() => setLoaded(true)} />
      <HugeHero visible={loaded} />
      <HugeAbout />
      <HugeLogos />
      <HugeProcess />
      <StatCardSection />
      <ScrollVideoSection />
      <HugeScrollSection />
      <AiTagSliderSection />
    </div>
  );
}
