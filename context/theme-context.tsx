"use client";

import React, { useSyncExternalStore } from "react";
import { ThemeProvider, useTheme as useNextTheme } from "next-themes";

type Theme = "light" | "dark";

type ThemeContextProviderProps = {
  children: React.ReactNode;
};

export default function ThemeContextProvider({
  children,
}: ThemeContextProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}

const subscribeNoop = () => () => {};

export function useTheme() {
  const { resolvedTheme, setTheme } = useNextTheme();
  const isMounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
  const theme: Theme = isMounted && resolvedTheme === "dark" ? "dark" : "light";

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return {
    theme,
    toggleTheme,
  };
}
