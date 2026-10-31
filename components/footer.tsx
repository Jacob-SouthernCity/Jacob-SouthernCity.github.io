"use client";

import { useI18n } from "./i18n-provider";

export default function Footer({ name }: { name: string }) {
  const { t } = useI18n();

  return (
    <footer className="mb-24 px-4 text-center text-slate-500 sm:mb-10 dark:text-slate-400">
      <small className="mb-2 block text-xs">{t.footer.rights(new Date().getFullYear(), name)}</small>
      <p className="text-xs">
        <span className="font-semibold">{t.footer.aboutLabel}</span> {t.footer.about}
      </p>
    </footer>
  );
}
