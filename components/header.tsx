"use client";

import React from "react";
import { motion } from "framer-motion";
import { links } from "@/lib/data";
import Link from "next/link";
import clsx from "clsx";
import { useActiveSectionContext } from "@/context/active-section-context";
import { FaHome, FaCode, FaTools, FaBriefcase, FaEnvelope } from "react-icons/fa";

// Map of section names to their corresponding icons
const sectionIcons: { [key: string]: React.ReactNode } = {
  Home: <FaHome className="text-3xl" />,
  Projects: <FaCode className="text-3xl" />,
  Skills: <FaTools className="text-3xl" />,
  Experience: <FaBriefcase className="text-3xl" />,
  Contact: <FaEnvelope className="text-3xl" />,
};

export default function Header() {
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();

  return (
    <header className="z-[999] relative">
      <motion.div
        className="fixed top-0 left-1/2 h-[5.5rem] w-full rounded-none border border-white border-opacity-40 bg-gradient-to-r from-indigo-50 to-white bg-opacity-80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] sm:top-6 sm:h-[4.5rem] sm:w-[28rem] sm:rounded-full dark:from-gray-950 dark:to-indigo-950/70 dark:border-black/40 dark:bg-opacity-75"
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
      ></motion.div>

      <nav className="flex fixed top-[0.75rem] left-1/2 h-16 -translate-x-1/2 py-2 sm:top-[1.7rem] sm:h-[initial] sm:py-0">
        <ul className="flex w-[26rem] flex-wrap items-center justify-center gap-x-5 text-[0.9rem] font-medium text-gray-500 sm:w-[initial] sm:flex-nowrap sm:gap-8">
          {links.map((link) => (
            <motion.li
              className="h-3/4 flex items-center justify-center relative"
              key={link.hash}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <Link
                className={clsx(
                  "flex w-full items-center justify-center p-4 hover:text-indigo-600 transition dark:text-gray-500 dark:hover:text-indigo-400",
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
