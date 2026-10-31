"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

type SectionHeadingProps = {
  children: ReactNode;
};

export default function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h2 className="text-4xl font-bold capitalize mb-10 text-center relative">
      <span className="text-gradient-teal">{children}</span>
      <motion.span
        className="absolute -bottom-4 left-1/2 -ml-10 w-20 h-1 bg-linear-to-r from-teal-400 to-indigo-600 rounded-full origin-center"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        aria-hidden
      />
    </h2>
  );
}
