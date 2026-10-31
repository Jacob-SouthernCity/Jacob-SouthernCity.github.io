"use client";

import { useEffect, useState } from "react";
import SectionHeading from "../section-heading";
import FilterTabs, { type FilterOption } from "../filter-tabs";
import ExperienceChart from "./experience-chart";
import ExperienceList, { experienceElementId } from "./experience-list";
import { experienceKindStyles } from "./experience-kind";
import { toMonthIndex } from "@/lib/dates";
import { useSectionInView } from "@/lib/hooks";
import { prefersReducedMotion } from "@/lib/motion";
import type { Experience as ExperienceItem, ExperienceKind } from "@/lib/content/schema";

type ExperienceFilter = "all" | ExperienceKind;

const filterOptions: readonly FilterOption<ExperienceFilter>[] = [
  { value: "all", label: "All" },
  ...(["work", "education"] as const).map((kind) => ({
    value: kind,
    label: experienceKindStyles[kind].label,
    dotClassName: experienceKindStyles[kind].dot,
  })),
];

const HIGHLIGHT_DURATION_MS = 1600;

type ExperienceProps = {
  experiences: readonly ExperienceItem[];
};

export default function Experience({ experiences }: ExperienceProps) {
  const { ref } = useSectionInView("Experience");
  const [filter, setFilter] = useState<ExperienceFilter>("all");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const sortedExperiences = [...experiences].sort(
    (a, b) => toMonthIndex(b.start) - toMonthIndex(a.start)
  );
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
    document.getElementById(experienceElementId(id))?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "center",
    });
    setHighlightedId(id);
  };

  return (
    <section
      id="experience"
      ref={ref}
      className="mb-24 w-full max-w-3xl scroll-mt-28 sm:mb-32"
    >
      <SectionHeading>Experience</SectionHeading>

      <div className="mb-6">
        <FilterTabs
          label="Filter experience"
          layoutId="experience-filter"
          options={filterOptions}
          value={filter}
          onChange={setFilter}
        />
      </div>

      <ExperienceChart items={visibleItems} onSelect={selectExperience} />
      <ExperienceList items={visibleItems} highlightedId={highlightedId} />
    </section>
  );
}
