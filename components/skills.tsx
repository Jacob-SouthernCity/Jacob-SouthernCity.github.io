"use client";

import SectionHeading from "./section-heading";
import type { SkillGroup } from "@/lib/content/schema";
import { icons } from "@/lib/icons";
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

type SkillsProps = {
  skillGroups: readonly SkillGroup[];
};

export default function Skills({ skillGroups }: SkillsProps) {
  const { ref } = useSectionInView("Skills");

  return (
    <section
      id="skills"
      ref={ref}
      className="mb-24 w-full max-w-212 scroll-mt-28 sm:mb-32"
    >
      <SectionHeading>Skills</SectionHeading>
      <div className="grid gap-5 sm:grid-cols-2">
        {skillGroups.map((group, index) => (
          <motion.div
            className="surface rounded-2xl p-6"
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
              {group.skills.map((skill) => {
                const SkillIcon = icons[skill.icon];
                return (
                <motion.li
                  variants={chipVariants}
                  className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                  key={skill.name}
                >
                  <span className="text-base text-indigo-600 dark:text-indigo-300" aria-hidden>
                    <SkillIcon />
                  </span>
                  {skill.name}
                </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
