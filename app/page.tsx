import type { Metadata } from "next";

import { HomeExperience } from "@/components/landingPage/HomeExperience";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  alternates: pageAlternates("/"),
};

export default function HomePage() {
  return <HomeExperience />;
}
