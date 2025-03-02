"use client";

import React from "react";
import { motion } from "framer-motion";

export default function SectionDivider() {
  return (
    <motion.div
      className="my-24 h-16 w-1 rounded-full hidden sm:block bg-gradient-to-b from-teal-400 via-indigo-500 to-indigo-700 dark:opacity-50"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.125 }}
    ></motion.div>
  );
}
