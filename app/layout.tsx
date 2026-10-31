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
import { loadContent } from "@/lib/content/load";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export async function generateMetadata(): Promise<Metadata> {
  const { profile, experiences } = await loadContent();
  const currentRole = experiences.find((item) => item.kind === "work" && item.end === null);
  const headline = currentRole?.title ?? profile.titles[0];
  const title = `${profile.name} | ${headline}`;
  const description = currentRole
    ? `${profile.name} is a ${currentRole.title.toLowerCase()} at ${currentRole.organization}, building across web, mobile, and platform.`
    : `${profile.name}, ${headline}.`;

  return {
    metadataBase: new URL("https://www.majingze.com"),
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: { title, description, url: "/", siteName: profile.name, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

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
