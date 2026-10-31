"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

type SectionHeadingProps = {
  children: ReactNode;
};

export default function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <motion.h2
      className="mb-8 text-center text-4xl font-bold tracking-tight text-slate-900 dark:text-white"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.h2>
  );
}
