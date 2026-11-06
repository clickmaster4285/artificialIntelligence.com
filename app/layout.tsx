// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/landingPage/Navbar";
import { GlobalLeadForm } from "@/components/landingPage/GlobalLeadForm";
import { HugeFooter } from "@/components/landingPage/HugeFooter";
import { generateSiteJsonLd } from "@/lib/schema";
import { fallbackSiteUrl, pageAlternates } from "@/lib/site";

const inter = Inter({ subsets: ["latin"] });
const siteUrl = fallbackSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ClickMasters - AI Development Company",
  description:
    "ClickMasters designs and builds AI products, web platforms, and mobile software for production teams.",
  alternates: pageAlternates("/"),
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
