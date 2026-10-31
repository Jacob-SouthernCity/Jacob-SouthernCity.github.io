"use client";

import SectionHeading from "./section-heading";
import { skillGroupsData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { motion } from "motion/react";

const chipListVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.15,
    },
  },
};

const chipVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
};

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 40,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * index,
    },
  }),
};

export default function Skills() {
  const { ref } = useSectionInView("Skills");

  return (
    <section
      id="skills"
      ref={ref}
      className="mb-28 w-full max-w-212 scroll-mt-28 sm:mb-40"
    >
      <SectionHeading>My skills</SectionHeading>
      <div className="grid gap-5 sm:grid-cols-2">
        {skillGroupsData.map((group, index) => (
          <motion.div
            className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
            key={group.title}
            variants={fadeInAnimationVariants}
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
            custom={index}
          >
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {group.title}
            </h3>
            <motion.ul className="flex flex-wrap gap-2" variants={chipListVariants}>
              {group.skills.map((skill) => (
                <motion.li
                  variants={chipVariants}
                  className="flex items-center gap-2 rounded-full bg-linear-to-br from-indigo-50 to-teal-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:from-indigo-100 hover:to-teal-100 dark:from-indigo-900/30 dark:to-teal-900/20 dark:text-slate-200"
                  key={skill.name}
                >
                  <span className="text-base text-indigo-600 dark:text-indigo-300" aria-hidden>
                    {skill.icon}
                  </span>
                  {skill.name}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
