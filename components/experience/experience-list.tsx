"use client";

import { useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { FiChevronDown } from "react-icons/fi";
import { formatDateRange } from "@/lib/dates";
import { useIsHydrated, useMediaQuery } from "@/lib/hooks";
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
  const isHydrated = useIsHydrated();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [expanded, setExpanded] = useState<Readonly<Record<string, boolean>>>({});
  const openByDefault = isHydrated ? isDesktop : true;
  const [revealedId, setRevealedId] = useState(highlightedId);

  if (highlightedId !== revealedId) {
    setRevealedId(highlightedId);
    if (highlightedId) setExpanded((current) => ({ ...current, [highlightedId]: true }));
  }

  return (
    <ol className="relative ms-4 mt-12 space-y-6 border-s-2 border-slate-200 sm:ms-5 dark:border-white/10">
      <AnimatePresence mode="popLayout">
        {items.map((item) => {
          const style = experienceKindStyles[item.kind];
          const Icon = style.icon;
          const isOpen = expanded[item.id] ?? openByDefault;
          const detailsId = `${experienceElementId(item.id)}-details`;

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
                  "rounded-2xl border bg-white p-5 shadow-sm transition-[box-shadow,border-color] duration-500 sm:p-6 dark:bg-slate-900",
                  highlightedId === item.id
                    ? "border-indigo-400 shadow-lg shadow-indigo-500/20 dark:border-indigo-400"
                    : "border-slate-200/80 dark:border-white/10"
                )}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setExpanded((current) => ({ ...current, [item.id]: !isOpen }))}
                    aria-expanded={isOpen}
                    aria-controls={detailsId}
                    className="group -m-2 flex w-[calc(100%+1rem)] items-start gap-3 rounded-xl p-2 text-left outline-none focus-visible:outline-2 focus-visible:outline-indigo-500"
                  >
                    <span className="block min-w-0 flex-1">
                      <span className="block font-semibold">{item.title}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className={`text-sm font-medium ${style.accentText}`}>
                          {item.organization}
                          {item.location && `, ${item.location}`}
                        </span>
                        {item.gpa && (
                          <span className="rounded-full border border-slate-200 px-2 py-0.5 font-mono text-xs text-slate-600 tabular-nums dark:border-white/15 dark:text-slate-300">
                            GPA {item.gpa}
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block font-mono text-xs text-slate-500 tabular-nums sm:hidden dark:text-slate-400">
                        {formatDateRange(item.start, item.end)}
                      </span>
                    </span>
                    <span className="hidden shrink-0 rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-medium text-slate-600 tabular-nums sm:block dark:bg-white/10 dark:text-slate-300">
                      {formatDateRange(item.start, item.end)}
                    </span>
                    <FiChevronDown
                      className={`mt-1 shrink-0 text-slate-400 transition-[rotate,color] duration-300 group-hover:text-slate-700 dark:group-hover:text-slate-200 ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="details"
                      id={detailsId}
                      className={clsx("overflow-hidden", !isHydrated && "max-md:hidden")}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <p className="pt-3 leading-relaxed text-slate-700 dark:text-white/75">{item.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ol>
  );
}
