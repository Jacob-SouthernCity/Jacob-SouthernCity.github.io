"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { HiDownload } from "react-icons/hi";
import { BsLinkedin } from "react-icons/bs";
import { FaGithubSquare } from "react-icons/fa";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/active-section-context";

export default function Intro() {
  const { ref } = useSectionInView("Home", 0.5);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();

  return (
    <section
      ref={ref}
      id="home"
      className="mb-28 max-w-[50rem] text-center sm:mb-0 scroll-mt-[100rem]"
    >
      <div className="flex items-center justify-center mb-6">
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
              alt="Ricardo portrait"
              width="240"
              height="240"
              quality="95"
              priority={true}
              className="h-48 w-48 rounded-full object-cover border-[0.35rem] border-white shadow-xl"
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
        className="mb-10 mt-6 flex flex-col items-center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="px-4 text-4xl font-bold leading-tight sm:text-6xl">
          Ricardo <span className="text-gradient-teal">Developer</span>
        </h1>
        <h2 className="mt-2 text-xl font-medium text-slate-700 dark:text-slate-300">
          Full-Stack Developer with 8 years of experience
        </h2>
        <div className="mt-6 p-6 bg-gradient-subtle rounded-2xl shadow-lg max-w-[42rem]">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
            <span className="font-medium">React and Next.js specialist</span> with a background in{" "}
            <span className="font-medium">Accounting</span>. I build beautiful, responsive web applications 
            with a focus on user experience. My core stack includes <span className="font-medium text-indigo-600 dark:text-indigo-400">React, Next.js, Node.js, and MongoDB</span>.
          </p>
          <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
            When I'm not coding, I enjoy playing video games, watching movies, 
            and learning about <span className="font-medium text-teal-600 dark:text-teal-400">history and philosophy</span>.
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
