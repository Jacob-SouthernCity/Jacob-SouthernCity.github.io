"use client";

import SectionHeading from "./section-heading";
import { motion } from "motion/react";
import { useSectionInView } from "@/lib/hooks";
import { contactLinks } from "@/lib/data";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

const secondaryLinkClassName =
  "flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 shadow-md transition hover:scale-105 hover:text-indigo-600 focus-visible:scale-105 active:scale-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:text-indigo-400";

export default function Contact() {
  const { ref } = useSectionInView("Contact");

  return (
    <motion.section
      id="contact"
      ref={ref}
      className="mb-20 w-[min(100%,38rem)] scroll-mt-28 text-center sm:mb-28"
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
      }}
      transition={{
        duration: 1,
      }}
      viewport={{
        once: true,
      }}
    >
      <SectionHeading>Get in touch</SectionHeading>

      <p className="mt-6 mb-8 text-lg text-slate-600 dark:text-slate-300">
        Whether it's a role, a project, or just to say hi, email is the best way
        to reach me.
      </p>

      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          className="bg-gradient-teal flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-medium text-white shadow-md transition hover:scale-105 focus-visible:scale-105 active:scale-100 sm:w-auto"
          href={`mailto:${contactLinks.email}`}
        >
          <FaEnvelope aria-hidden />
          {contactLinks.email}
        </a>
        <div className="flex gap-4">
          <a
            className={secondaryLinkClassName}
            href={contactLinks.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin aria-hidden />
            LinkedIn
          </a>
          <a
            className={secondaryLinkClassName}
            href={contactLinks.gitHub}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub aria-hidden />
            GitHub
          </a>
        </div>
      </div>
    </motion.section>
  );
}
