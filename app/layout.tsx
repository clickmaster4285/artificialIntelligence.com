// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/landingPage/Navbar";
import { GlobalLeadForm } from "@/components/landingPage/GlobalLeadForm";
import { HugeFooter } from "@/components/landingPage/HugeFooter";
import { generateSiteJsonLd } from "@/lib/schema";
import {
  AI_UK_ORIGIN,
  getRequestSiteUrl,
  pageAlternates,
} from "@/lib/site";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = await getRequestSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: "ClickMasters - AI Development Company",
    description:
      "Custom AI development services from $30K. Chatbots, RAG systems, ML models & enterprise AI platforms.",
    alternates: pageAlternates("/"),
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = await getRequestSiteUrl();

  return (
    <html lang={siteUrl === AI_UK_ORIGIN ? "en-GB" : "en-US"}>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateSiteJsonLd(siteUrl)).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
        {/* Navbar - Fixed at top */}
        <Navbar />

        {/* Main content - Grows to fill space */}
        <main className="flex-grow pt-20">
          {children}
        </main>

        {/* Global lead form - Appears before footer on every page */}
        <GlobalLeadForm />

        {/* Footer - Always at bottom */}
        <HugeFooter />
      </body>
    </html>
  );
}
