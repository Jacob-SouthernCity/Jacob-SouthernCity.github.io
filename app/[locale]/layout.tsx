import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/header";
import ActiveSectionContextProvider from "@/context/active-section-context";
import Footer from "@/components/footer";
import ThemeSwitch from "@/components/theme-switch";
import LanguageSwitch from "@/components/language-switch";
import ThemeContextProvider from "@/context/theme-context";
import MotionProvider from "@/components/motion-provider";
import I18nProvider from "@/components/i18n-provider";
import ScrollProgress from "@/components/scroll-progress";
import { loadContent } from "@/lib/content/load";
import { isLocale, localeInfo, locales } from "@/lib/i18n/config";
import { messages } from "@/lib/i18n/messages";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<LocaleLayoutProps, "children">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { profile, experiences, displayName } = await loadContent(locale);
  const currentRole = experiences.find((item) => item.kind === "work" && item.end === null);
  const headline = currentRole?.title ?? profile.titles[0];
  const name = displayName === profile.name ? profile.name : `${displayName} (${profile.name})`;
  const title = `${name} | ${headline}`;
  const description = currentRole
    ? messages[locale].meta.description(name, currentRole.title, currentRole.organization)
    : `${name}, ${headline}.`;
  const path = localeInfo[locale].path;

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        ...Object.fromEntries(locales.map((item) => [localeInfo[item].htmlLang, localeInfo[item].path])),
        "x-default": "/",
      },
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: profile.name,
      type: "website",
      locale: localeInfo[locale].ogLocale,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { profile } = await loadContent(locale);

  return (
    <html
      lang={localeInfo[locale].htmlLang}
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth! motion-reduce:scroll-auto!`}
      suppressHydrationWarning
    >
      <body className="relative pt-28 font-sans text-slate-950 antialiased sm:pt-36 dark:text-slate-50/90">
        <div className="absolute -top-24 right-44 -z-10 h-125 w-125 rounded-full bg-indigo-200/70 blur-[10rem] sm:w-275 dark:bg-indigo-800/40 motion-safe:animate-drift" aria-hidden></div>
        <div className="absolute -top-4 -left-140 -z-10 h-125 w-200 rounded-full bg-teal-100/80 blur-[10rem] sm:w-275 md:-left-132 lg:-left-112 xl:-left-60 2xl:-left-20 dark:bg-teal-900/30 motion-safe:animate-drift-slow" aria-hidden></div>

        <I18nProvider locale={locale}>
          <ThemeContextProvider>
            <MotionProvider>
              <ActiveSectionContextProvider>
                <ScrollProgress />
                <Header />
                {children}
                <Footer name={profile.name} />

                <div className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3">
                  <LanguageSwitch />
                  <ThemeSwitch />
                </div>
              </ActiveSectionContextProvider>
            </MotionProvider>
          </ThemeContextProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
