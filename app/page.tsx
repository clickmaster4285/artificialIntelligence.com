import type { Metadata } from "next";

import { HomeExperience } from "@/components/landingPage/HomeExperience";
import { pageAlternates } from "@/lib/site";
import { withEditedPageSeo } from "@/lib/cms/erp-edits";

const pageMetadata: Metadata = {
  alternates: pageAlternates("/"),
};

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return withEditedPageSeo("/", pageMetadata);
}

export default function HomePage() {
  return <HomeExperience />;
}
