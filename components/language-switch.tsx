"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FiCheck } from "react-icons/fi";
import { localeInfo, locales } from "@/lib/i18n/config";
import { useI18n } from "./i18n-provider";
import { floatingButtonClassName } from "./theme-switch";

export default function LanguageSwitch() {
  const { locale, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const close = (event: PointerEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`${t.language.label}: ${localeInfo[locale].label}`}
        className={`${floatingButtonClassName} text-sm font-semibold text-slate-700 dark:text-slate-200`}
      >
        {localeInfo[locale].short}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="surface absolute right-full bottom-0 mr-3 w-36 rounded-2xl p-1.5 shadow-lg"
            initial={{ opacity: 0, x: 8, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
          >
            {locales.map((item) => (
              <li key={item}>
                <a
                  href={localeInfo[item].path}
                  hrefLang={localeInfo[item].htmlLang}
                  lang={localeInfo[item].htmlLang}
                  aria-current={item === locale ? "page" : undefined}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-900/5 aria-[current=page]:text-indigo-600 dark:text-slate-200 dark:hover:bg-white/10 dark:aria-[current=page]:text-indigo-300"
                >
                  {localeInfo[item].label}
                  {item === locale && <FiCheck aria-hidden />}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
