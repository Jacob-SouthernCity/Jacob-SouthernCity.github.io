"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { links } from "@/lib/data";
import Link from "next/link";
import clsx from "clsx";
import { useActiveSectionContext } from "@/context/active-section-context";
import { FaHome, FaCode, FaTools, FaBriefcase, FaGlobeAmericas, FaEnvelope } from "react-icons/fa";
import type { SectionName } from "@/lib/types";

const iconClassName =
  "text-3xl transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110";

const sectionIcons: Record<SectionName, ReactNode> = {
  Home: <FaHome className={iconClassName} />,
  Projects: <FaCode className={iconClassName} />,
  Skills: <FaTools className={iconClassName} />,
  Experience: <FaBriefcase className={iconClassName} />,
  Places: <FaGlobeAmericas className={iconClassName} />,
  Contact: <FaEnvelope className={iconClassName} />,
};

export default function Header() {
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();

  return (
    <header className="z-999 relative">
      <motion.div
        className="fixed top-0 left-1/2 h-22 w-full rounded-none border border-white/40 bg-white/80 shadow-lg shadow-black/3 backdrop-blur-[0.5rem] sm:top-6 sm:h-18 sm:w-[30rem] sm:rounded-full dark:bg-slate-950/75 dark:border-black/40"
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
        aria-hidden
      />

      <nav aria-label="Sections" className="flex fixed top-3 left-1/2 h-16 -translate-x-1/2 py-2 sm:top-[1.7rem] sm:h-[initial] sm:py-0">
        <ul className="flex w-screen max-w-104 flex-wrap items-center justify-center gap-x-1 text-[0.9rem] font-medium text-slate-500 sm:w-[initial] sm:flex-nowrap sm:gap-4">
          {links.map((link) => (
            <motion.li
              className="h-3/4 flex items-center justify-center relative"
              key={link.hash}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <Link
                className={clsx(
                  "group flex w-full items-center justify-center p-2 min-[380px]:p-3 sm:p-4 hover:text-indigo-600 transition dark:text-slate-400 dark:hover:text-indigo-400",
                  {
                    "text-indigo-600 dark:text-indigo-400":
                      activeSection === link.name,
                  }
                )}
                href={link.hash}
                onClick={() => {
                  setActiveSection(link.name);
                  setTimeOfLastClick(Date.now());
                }}
                title={link.name}
                aria-label={link.name}
                aria-current={activeSection === link.name ? "location" : undefined}
              >
                {sectionIcons[link.name]}

                {link.name === activeSection && (
                  <motion.span
                    className="bg-indigo-100 rounded-full absolute inset-0 -z-10 dark:bg-indigo-900/20"
                    layoutId="activeSection"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  ></motion.span>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
