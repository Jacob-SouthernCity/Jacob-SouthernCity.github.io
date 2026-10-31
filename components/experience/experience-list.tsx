"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { formatDateRange } from "@/lib/dates";
import type { Experience } from "@/lib/content/schema";
import { experienceKindStyles } from "./experience-kind";

type ExperienceListProps = {
  items: readonly Experience[];
  highlightedId: string | null;
};

export function experienceElementId(id: string) {
  return `experience-${id}`;
}

export default function ExperienceList({ items, highlightedId }: ExperienceListProps) {
  return (
    <ol className="relative ms-4 mt-12 space-y-6 border-s-2 border-slate-200 sm:ms-5 dark:border-white/10">
      <AnimatePresence mode="popLayout">
        {items.map((item) => {
          const style = experienceKindStyles[item.kind];
          const Icon = style.icon;

          return (
            <motion.li
              key={item.id}
              id={experienceElementId(item.id)}
              layout
              className="relative scroll-mt-32 ps-8 sm:ps-10"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <span
                className={`absolute top-5 -start-[calc(1.125rem+1px)] flex size-9 items-center justify-center rounded-full bg-white text-lg shadow-sm ring-4 ring-slate-100 sm:-start-[calc(1.25rem+1px)] sm:size-10 dark:bg-slate-800 dark:ring-slate-950 ${style.accentText}`}
                aria-hidden
              >
                <Icon />
              </span>
              <article
                className={clsx(
                  "rounded-2xl border bg-white/60 p-5 shadow-sm backdrop-blur-sm transition-[box-shadow,border-color] duration-500 sm:p-6 dark:bg-white/5",
                  highlightedId === item.id
                    ? "border-indigo-400 shadow-lg shadow-indigo-500/20 dark:border-indigo-400"
                    : "border-black/5 dark:border-white/10"
                )}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <h3 className="font-semibold">
                    {item.title}
                  </h3>
                  <span className="shrink-0 self-start rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-medium tabular-nums text-slate-600 dark:bg-white/10 dark:text-slate-300">
                    {formatDateRange(item.start, item.end)}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className={`text-sm font-medium ${style.accentText}`}>
                    {item.organization}
                    {item.location && `, ${item.location}`}
                  </p>
                  {item.gpa && (
                    <span className="rounded-full border border-slate-200 px-2 py-0.5 font-mono text-xs text-slate-600 tabular-nums dark:border-white/15 dark:text-slate-300">
                      GPA {item.gpa}
                    </span>
                  )}
                </div>
                <p className="mt-2 leading-relaxed text-slate-700 dark:text-white/75">
                  {item.description}
                </p>
              </article>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ol>
  );
}
