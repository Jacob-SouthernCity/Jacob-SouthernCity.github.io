export const locales = ["en", "zh", "ja"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeInfo: Record<Locale, { label: string; short: string; htmlLang: string; ogLocale: string; path: string }> = {
  en: { label: "English", short: "EN", htmlLang: "en", ogLocale: "en_US", path: "/" },
  zh: { label: "中文", short: "中", htmlLang: "zh-Hans", ogLocale: "zh_CN", path: "/zh" },
  ja: { label: "日本語", short: "日", htmlLang: "ja", ogLocale: "ja_JP", path: "/ja" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
