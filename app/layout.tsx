import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import Header from "@/components/header";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import ActiveSectionContextProvider from "@/context/active-section-context";
import Footer from "@/components/footer";
import ThemeSwitch from "@/components/theme-switch";
import ThemeContextProvider from "@/context/theme-context";
import MotionProvider from "@/components/motion-provider";
import ScrollProgress from "@/components/scroll-progress";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

const siteDescription =
  "Jingze (Jacob) Ma is a software engineer at Smule working across web, mobile, and platform, with a background in game development.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.majingze.com"),
  title: "Jingze Ma | Software Engineer",
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Jingze Ma | Software Engineer",
    description: siteDescription,
    url: "/",
    siteName: "Jingze Ma",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jingze Ma | Software Engineer",
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth! motion-reduce:scroll-auto!`}
      suppressHydrationWarning
    >
      <body
        className="relative pt-28 font-sans text-slate-950 antialiased sm:pt-36 dark:text-slate-50/90"
      >
        <div className="absolute -top-24 right-44 -z-10 h-125 w-125 rounded-full bg-indigo-200/70 blur-[10rem] sm:w-275 dark:bg-indigo-800/40 motion-safe:animate-drift" aria-hidden></div>
        <div className="absolute -top-4 -left-140 -z-10 h-125 w-200 rounded-full bg-teal-100/80 blur-[10rem] sm:w-275 md:-left-132 lg:-left-112 xl:-left-60 2xl:-left-20 dark:bg-teal-900/30 motion-safe:animate-drift-slow" aria-hidden></div>

        <ThemeContextProvider>
          <MotionProvider>
            <ActiveSectionContextProvider>
              <ScrollProgress />
              <Header />
              {children}
              <Footer />

              <ThemeSwitch />
            </ActiveSectionContextProvider>
          </MotionProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
