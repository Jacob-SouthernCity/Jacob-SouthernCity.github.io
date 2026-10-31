"use client";

import type { ReactNode } from "react";
import { ThemeProvider, useTheme as useNextTheme } from "next-themes";

type Theme = "light" | "dark";

type ThemeContextProviderProps = {
  children: ReactNode;
};

type Point = {
  x: number;
  y: number;
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

function applyThemeClass(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

function revealFrom({ x, y }: Point) {
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${radius}px at ${x}px ${y}px)`,
      ],
    },
    {
      duration: 600,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      pseudoElement: "::view-transition-new(root)",
    }
  );
}

export function useTheme() {
  const { resolvedTheme, setTheme } = useNextTheme();

  const toggleTheme = (origin: Point) => {
    const nextTheme: Theme = resolvedTheme === "dark" ? "light" : "dark";
    const switchTheme = () => {
      applyThemeClass(nextTheme);
      setTheme(nextTheme);
    };

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!document.startViewTransition || prefersReducedMotion) {
      switchTheme();
      return;
    }

    document
      .startViewTransition(switchTheme)
      .ready.then(() => revealFrom(origin))
      .catch(() => {});
  };

  return {
    toggleTheme,
  };
}
