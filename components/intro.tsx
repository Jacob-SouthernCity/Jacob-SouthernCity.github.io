"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HiDownload } from "react-icons/hi";
import { BsLinkedin } from "react-icons/bs";
import { FaGithubSquare } from "react-icons/fa";
import { useSectionInView } from "@/lib/hooks";
import { contactLinks } from "@/lib/data";
import TypewriterText from "./TypewriterText";

const personalTitles = ["Software Engineer", "Game Developer", "Traveler"];

const nameVersions = [
  { label: "Legal", name: "Jingze Ma", icon: "EN", lang: "en" },
  { label: "English", name: "Jacob Ma", icon: "EN", lang: "en" },
  { label: "Chinese", name: "马璟泽", icon: "中", lang: "zh-Hans" },
  { label: "Japanese", name: "小島蓮や", icon: "あ", lang: "ja" },
];

const socialLinkClassName =
  "bg-white p-4 text-slate-700 flex items-center gap-2 rounded-full border border-slate-200 shadow-md transition hover:scale-[1.15] hover:text-indigo-600 focus-visible:scale-[1.15] active:scale-105 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:text-indigo-400";

export default function Intro() {
  const { ref } = useSectionInView("Home");
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  const currentName = nameVersions[currentNameIndex];

  const cycleNameVersion = () => {
    setCurrentNameIndex((prevIndex) => (prevIndex + 1) % nameVersions.length);
  };

  return (
    <section
      ref={ref}
      id="home"
      className="mb-24 max-w-200 text-center sm:mb-0 scroll-mt-[100rem]"
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
              src="/jingzema.jpg"
              alt="Jingze Ma portrait"
              width={240}
              height={240}
              quality={95}
              preload
              className="h-44 w-44 rounded-full object-cover border-[0.35rem] border-white shadow-xl"
            />
          </motion.div>

          <motion.span
            className="absolute bottom-0 right-0 text-5xl"
            aria-hidden
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 125,
              delay: 0.1,
              duration: 0.7,
            }}
          >
            <span className="inline-block origin-[70%_80%] motion-safe:animate-wave motion-safe:hover:animate-wave-once">
              👋
            </span>
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
              type="button"
              onClick={cycleNameVersion}
              className="bg-indigo-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 p-1.5 rounded-full hover:bg-indigo-200 dark:hover:bg-slate-600 transition-colors duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 w-8 h-8 pointer-coarse:size-10 flex items-center justify-center text-sm font-medium"
              title={`Currently: ${currentName.label}`}
              aria-label={`Show my name in another language (currently ${currentName.label})`}
            >
              {currentName.icon}
            </button>
          </div>
          
          <h1 className="text-4xl font-bold leading-tight sm:text-6xl flex flex-col items-center min-h-[2.4em] sm:min-h-[2em]">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentNameIndex}
                lang={currentName.lang}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="block mb-1"
              >
                {currentName.name}
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
        
        <div className="mt-4 max-w-2xl">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
            Software Engineer at <span className="font-medium">Smule</span>, building
            across web, mobile, and platform. I hold a Master's in{" "}
            <span className="font-medium">Computer Science from Yale</span> and a
            background in <span className="font-medium">Game Development and Mathematics</span>{" "}
            from USC. I enjoy shipping products people actually use, with a focus on
            user experience and performance.
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
          className="group bg-gradient-teal text-white px-7 py-3 flex items-center gap-2 rounded-full focus-visible:scale-110 hover:scale-110 active:scale-105 transition w-full sm:w-auto justify-center"
          href="/CV.pdf"
          download="Jingze_Ma_Resume.pdf"
        >
          Download Resume{" "}
          <HiDownload className="opacity-70 group-hover:translate-y-1 transition" />
        </a>

        <a
          className={socialLinkClassName}
          href={contactLinks.linkedIn}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile"
        >
          <BsLinkedin className="text-xl" />
        </a>

        <a
          className={socialLinkClassName}
          href={contactLinks.gitHub}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile"
        >
          <FaGithubSquare className="text-xl" />
        </a>
      </motion.div>
    </section>
  );
}
