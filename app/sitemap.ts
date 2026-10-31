import type { MetadataRoute } from "next";
import { localeInfo, locales, type Locale } from "@/lib/i18n/config";

const SITE_URL = "https://www.majingze.com";

const urlFor = (locale: Locale) => `${SITE_URL}${localeInfo[locale].path === "/" ? "" : localeInfo[locale].path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((locale) => [localeInfo[locale].htmlLang, urlFor(locale)]));

  return locales.map((locale) => ({
    url: urlFor(locale),
    lastModified: new Date(),
    alternates: { languages },
  }));
}
