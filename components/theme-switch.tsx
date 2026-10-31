"use client";

import { useTheme } from "@/context/theme-context";
import { BsMoon, BsSun } from "react-icons/bs";

const iconClassName =
  "absolute text-2xl transition-[rotate,scale,opacity] duration-500 ease-out";

export default function ThemeSwitch() {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="fixed bottom-5 right-5 w-14 h-14 bg-linear-to-br from-white to-indigo-50 backdrop-blur-[0.5rem] border border-indigo-100 shadow-lg rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:from-slate-900 dark:to-indigo-950 dark:border-indigo-500/20 glow"
      onClick={(event) => {
        const { left, top, width, height } =
          event.currentTarget.getBoundingClientRect();
        toggleTheme({ x: left + width / 2, y: top + height / 2 });
      }}
      aria-label="Toggle dark mode"
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
