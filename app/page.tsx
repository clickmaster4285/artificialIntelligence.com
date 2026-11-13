import type { Metadata } from "next";

import { HomeExperience } from "@/components/landingPage/HomeExperience";
import { pageAlternates, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site";
import { withEditedPageSeo } from "@/lib/cms/erp-edits";

const pageMetadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: pageAlternates("/"),
};

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return withEditedPageSeo("/", pageMetadata);
}

export default function HomePage() {
  return <HomeExperience />;
}
