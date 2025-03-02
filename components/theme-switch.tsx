"use client";

import { useTheme } from "@/context/theme-context";
import React from "react";
import { BsMoon, BsSun } from "react-icons/bs";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="fixed bottom-5 right-5 w-[3.5rem] h-[3.5rem] bg-gradient-to-br from-white to-indigo-50 backdrop-blur-[0.5rem] border border-indigo-100 shadow-lg rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:from-slate-900 dark:to-indigo-950 dark:border-indigo-500/20 glow"
      onClick={toggleTheme}
    >
      {theme === "light" ? <BsSun className="text-2xl text-teal-500" /> : <BsMoon className="text-2xl text-indigo-300" />}
    </button>
  );
}
