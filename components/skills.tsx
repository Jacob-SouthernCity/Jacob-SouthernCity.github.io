"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { skillsData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { motion } from "framer-motion";

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * index,
    },
  }),
};

export default function Skills() {
  const { ref } = useSectionInView("Skills");

  return (
    <section
      id="skills"
      ref={ref}
      className="mb-28 max-w-[53rem] scroll-mt-28 text-center sm:mb-40"
    >
      <SectionHeading>My skills</SectionHeading>
      <ul className="flex flex-wrap justify-center gap-5 text-lg text-gray-800">
        {skillsData.map((skill, index) => (
          <motion.li
            className="flex flex-col items-center"
            key={index}
            variants={fadeInAnimationVariants}
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
            custom={index}
          >
            <div className="flex items-center justify-center w-20 h-20 mb-3 rounded-full bg-gradient-to-br from-indigo-100 to-teal-50 text-indigo-600 text-3xl shadow-lg hover:glow transition-all duration-300 hover:scale-110 dark:from-indigo-900/30 dark:to-teal-900/20 dark:text-indigo-300">
              {skill.icon}
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{skill.name}</span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
