// src/app/layout.tsx

import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/landingPage/Navbar";
import { GlobalLeadForm } from "@/components/landingPage/GlobalLeadForm";
import { HugeFooter } from "@/components/landingPage/HugeFooter";
import ErpPageEdits from "@/components/cms/ErpPageEdits";
import { getCmsSiteConfig } from "@/lib/cms/cms";
import { generateSiteJsonLd } from "@/lib/schema";
import {
  fallbackSiteUrl,
  pageAlternates,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from "@/lib/site";

const inter = Inter({ subsets: ["latin"] });
const siteUrl = fallbackSiteUrl();

export async function generateMetadata(): Promise<Metadata> {
  const config = await getCmsSiteConfig();
  return {
    metadataBase: new URL(siteUrl),
    // Code-owned: the CMS website name is an admin label, not the brand title.
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    alternates: pageAlternates("/"),
    icons: {
      icon: config?.website.favicon || "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getCmsSiteConfig();
  const theme: CSSProperties = {
    ...(config?.colors.primary
      ? {
          "--primary": config.colors.primary,
          "--ring": config.colors.primary,
          "--violet": config.colors.primary,
          "--violet-soft": config.colors.primary,
          "--brand": config.colors.primary,
        }
      : {}),
    ...(config?.colors.secondary
      ? { "--secondary": config.colors.secondary }
      : {}),
  } as CSSProperties;

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`} style={theme}>
        {/* Google Tag Manager */}
        <Script id="gtm-datalayer" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());`}
        </Script>
        <Script
          id="gtm-script"
          src="https://www.googletagmanager.com/gtm.js?id=GTM-WGVQJ7VS"
          strategy="afterInteractive"
        />
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
        <Navbar
          cmsNavigation={config?.navigation.header}
          logo={config?.website.logo}
        />

        <ErpPageEdits />
        {/* Main content - Grows to fill space */}
        <main className="flex-grow pt-20">
          {children}
        </main>

        {/* Global lead form - Appears before footer on every page */}
        <GlobalLeadForm />

        {/* Footer - Always at bottom */}
        <HugeFooter cmsNavigation={config?.navigation.footer} />
      </body>
    </html>
  );
}
