"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import { messages, type Messages } from "@/lib/i18n/messages";

type I18nValue = {
  locale: Locale;
  t: Messages;
};

const I18nContext = createContext<I18nValue | null>(null);

export default function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <I18nContext.Provider value={{ locale, t: messages[locale] }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
