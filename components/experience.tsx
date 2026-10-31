"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import SectionHeading from "./section-heading";
import ExperienceChart from "./experience-chart";
import ExperienceList, { experienceElementId } from "./experience-list";
import { experienceKindStyles } from "./experience-kind";
import { experiencesData } from "@/lib/data";
import { toMonthIndex } from "@/lib/dates";
import { useSectionInView } from "@/lib/hooks";
import type { ExperienceKind } from "@/lib/types";

type ExperienceFilter = "all" | ExperienceKind;

const filters: readonly { value: ExperienceFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "work", label: experienceKindStyles.work.label },
  { value: "education", label: experienceKindStyles.education.label },
];

const HIGHLIGHT_DURATION_MS = 1600;

const sortedExperiences = [...experiencesData].sort(
  (a, b) => toMonthIndex(b.start) - toMonthIndex(a.start)
);

export default function Experience() {
  const { ref } = useSectionInView("Experience");
  const [filter, setFilter] = useState<ExperienceFilter>("all");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const visibleItems =
    filter === "all"
      ? sortedExperiences
      : sortedExperiences.filter((item) => item.kind === filter);

  useEffect(() => {
    if (!highlightedId) return;
    const timeout = setTimeout(() => setHighlightedId(null), HIGHLIGHT_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [highlightedId]);

  const selectExperience = (id: string) => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    document.getElementById(experienceElementId(id))?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "center",
    });
    setHighlightedId(id);
  };

  return (
    <section
      id="experience"
      ref={ref}
      className="mb-28 w-full max-w-3xl scroll-mt-28 sm:mb-40"
    >
      <SectionHeading>My experience</SectionHeading>

      <div
        className="mx-auto mb-6 flex w-fit gap-1 rounded-full border border-black/5 bg-white/60 p-1 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
        role="group"
        aria-label="Filter experience"
      >
        {filters.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
            className="relative rounded-full px-4 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 aria-pressed:text-slate-900 dark:text-slate-300 dark:hover:text-white dark:aria-pressed:text-white"
          >
            {filter === value && (
              <motion.span
                layoutId="experience-filter"
                className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-white/15"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              {value !== "all" && (
                <span
                  className={`size-2 rounded-full ${experienceKindStyles[value].dot}`}
                  aria-hidden
                />
              )}
              {label}
            </span>
          </button>
        ))}
      </div>

      <ExperienceChart items={visibleItems} onSelect={selectExperience} />
      <ExperienceList items={visibleItems} highlightedId={highlightedId} />
    </section>
  );
}
