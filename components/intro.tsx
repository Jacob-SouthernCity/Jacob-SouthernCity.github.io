"use client";

import Image from "next/image";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { HiDownload } from "react-icons/hi";
import { BsLinkedin } from "react-icons/bs";
import { FaGithubSquare } from "react-icons/fa";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/active-section-context";
import TypewriterText from "../src/components/ui/TypewriterText";
import { FiRefreshCw } from "react-icons/fi";

export default function Intro() {
  const { ref } = useSectionInView("Home", 0.5);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();

  // Define the different name versions
  const nameVersions = [
    { label: "Legal", name: "Jingze Ma", icon: "EN" },
    { label: "English", name: "Jacob Ma", icon: "EN" },
    { label: "Chinese", name: "马璟泽", icon: "中" },
    { label: "Japanese", name: "小島蓮や", icon: "あ" }
  ];
  
  // State to track the current name version
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  
  // Function to cycle through name versions
  const cycleNameVersion = () => {
    setCurrentNameIndex((prevIndex) => (prevIndex + 1) % nameVersions.length);
  };

  // Custom titles specific to this person's profile
  const personalTitles = [
    "Developer", 
    "CS Graduate Student",
    "Game Engineer",
    "AI Enthusiast",
    "Problem Solver",
    "Full-Stack Engineer",
    "Software Engineer"
  ];

  return (
    <section
      ref={ref}
      id="home"
      className="mb-24 max-w-[50rem] text-center sm:mb-0 scroll-mt-[100rem]"
    >
      <div className="flex items-center justify-center mb-4">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "tween",
              duration: 0.2,
            }}
            className="glow rounded-full"
          >
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=368&h=368&q=100"
              alt="Jingze Ma portrait"
              width="240"
              height="240"
              quality="95"
              priority={true}
              className="h-44 w-44 rounded-full object-cover border-[0.35rem] border-white shadow-xl"
            />
          </motion.div>

          <motion.span
            className="absolute bottom-0 right-0 text-5xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 125,
              delay: 0.1,
              duration: 0.7,
            }}
          >
            👋
          </motion.span>
        </div>
      </div>

      <motion.div
        className="mb-10 mt-4 flex flex-col items-center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="px-4 relative w-full">
          <div className="absolute right-4 top-2 z-10">
            <button 
              onClick={cycleNameVersion}
              className="bg-indigo-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 p-1.5 rounded-full hover:bg-indigo-200 dark:hover:bg-slate-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 w-8 h-8 flex items-center justify-center text-sm font-medium"
              title={`Currently: ${nameVersions[currentNameIndex].label}`}
            >
              {nameVersions[currentNameIndex].icon}
            </button>
          </div>
          
          <h1 className="text-4xl font-bold leading-tight sm:text-6xl flex flex-col items-center min-h-[2.4em] sm:min-h-[2em]">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentNameIndex}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="block mb-1"
              >
                {nameVersions[currentNameIndex].name}
              </motion.span>
            </AnimatePresence>
            <TypewriterText 
              words={personalTitles} 
              typingSpeed={80} 
              deletingSpeed={40} 
              className="text-gradient-teal mt-1 block"
            />
          </h1>
        </div>
        
        <div className="mt-4 max-w-[42rem]">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
            <span className="font-medium">Computer Science graduate student at Yale University</span> with a background in{" "}
            <span className="font-medium">Game Development and Mathematics</span>. I build innovative applications 
            with a focus on user experience and performance. My core skills include <span className="font-medium text-indigo-600 dark:text-indigo-400">C++, Unity, React, and AI technologies</span>.
          </p>
          <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
            Currently pursuing my MS in Computer Science at Yale with research interests in game development, distributed systems, and artificial intelligence.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 text-lg font-medium"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
        }}
      >
        <a
          className="group bg-gradient-teal text-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition w-full sm:w-auto justify-center"
          href="/CV.pdf"
          download
        >
          Download CV{" "}
          <HiDownload className="opacity-70 group-hover:translate-y-1 transition" />
        </a>

        <a
          className="bg-white p-4 text-slate-700 hover:text-indigo-600 flex items-center gap-2 rounded-full focus:scale-[1.15] hover:scale-[1.15] active:scale-105 transition cursor-pointer border border-slate-200 shadow-md dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:text-indigo-400"
          href="https://linkedin.com"
          target="_blank"
        >
          <BsLinkedin className="text-xl" />
        </a>

        <a
          className="bg-white p-4 text-slate-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-indigo-600 active:scale-105 transition cursor-pointer border border-slate-200 shadow-md dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:text-indigo-400"
          href="https://github.com"
          target="_blank"
        >
          <FaGithubSquare className="text-xl" />
        </a>
      </motion.div>
    </section>
  );
}
