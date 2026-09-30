// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/landingPage/Navbar";
import { GlobalLeadForm } from "@/components/landingPage/GlobalLeadForm";
import { HugeFooter } from "@/components/landingPage/HugeFooter";
import { SITE_URL } from "@/lib/site";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ClickMasters - AI Development Company",
  description: "Custom AI development services from $30K. Chatbots, RAG systems, ML models & enterprise AI platforms.",
  alternates: {
    canonical: "/",
  },
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
