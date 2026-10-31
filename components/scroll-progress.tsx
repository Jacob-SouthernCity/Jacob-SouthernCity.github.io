"use client";

import { motion, useScroll, useSpring } from "motion/react";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-1000 h-1 origin-left bg-linear-to-r from-teal-400 to-indigo-500"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
