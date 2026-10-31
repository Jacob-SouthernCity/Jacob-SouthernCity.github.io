"use client";

import { useTheme } from "@/context/theme-context";
import { BsMoon, BsSun } from "react-icons/bs";
import { useI18n } from "./i18n-provider";

export const floatingButtonClassName =
  "flex size-14 items-center justify-center rounded-full border border-indigo-100 bg-white/80 shadow-lg backdrop-blur-[0.5rem] transition-all hover:scale-[1.15] active:scale-105 dark:border-white/10 dark:bg-slate-900/80";

const iconClassName =
  "absolute text-2xl transition-[rotate,scale,opacity] duration-500 ease-out";

export default function ThemeSwitch() {
  const { toggleTheme } = useTheme();
  const { t } = useI18n();

  return (
    <button
      type="button"
      className={`relative ${floatingButtonClassName}`}
      onClick={(event) => {
        const { left, top, width, height } =
          event.currentTarget.getBoundingClientRect();
        toggleTheme({ x: left + width / 2, y: top + height / 2 });
      }}
      aria-label={t.theme.toggle}
    >
      <BsSun
        className={`${iconClassName} text-teal-500 dark:-rotate-90 dark:scale-0 dark:opacity-0`}
      />
      <BsMoon
        className={`${iconClassName} rotate-90 scale-0 opacity-0 text-indigo-300 dark:rotate-0 dark:scale-100 dark:opacity-100`}
      />
    </button>
  );
}
