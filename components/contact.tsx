"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";
import toast from "react-hot-toast";

export default function Contact() {
  const { ref } = useSectionInView("Contact");

  return (
    <motion.section
      id="contact"
      ref={ref}
      className="mb-20 sm:mb-28 w-[min(100%,38rem)] text-center"
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
      <SectionHeading>Contact me</SectionHeading>

      <p className="text-slate-600 mt-6 mb-8 dark:text-slate-300 text-lg">
        Please contact me directly at{" "}
        <a className="text-indigo-600 font-medium hover:underline dark:text-indigo-400" href="mailto:jingzema2001@gmail.com">
          jingzema2001@gmail.com
        </a>{" "}
        . The contact form is currently disabled.
      </p>

      <div className="bg-gradient-subtle p-6 rounded-2xl shadow-lg">
        <form
          className="flex flex-col dark:text-black"
          onSubmit={(e) => {
            e.preventDefault();
            toast("The contact form is temporarily disabled. Please email me directly.");
          }}
        >
          <input
            className="h-14 px-4 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-white dark:bg-opacity-90 dark:focus:bg-opacity-100 focus:border-indigo-500 outline-none transition-all shadow-sm"
            name="senderEmail"
            type="email"
            required
            maxLength={500}
            placeholder="Your email"
            disabled
          />
          <textarea
            className="h-52 my-4 rounded-lg border border-slate-200 dark:border-slate-700 p-4 dark:bg-white dark:bg-opacity-90 dark:focus:bg-opacity-100 focus:border-indigo-500 outline-none transition-all shadow-sm"
            name="message"
            placeholder="Your message"
            required
            maxLength={5000}
            disabled
          />
          <div className="flex justify-center">
            <button
              type="submit"
              disabled
              className="opacity-60 cursor-not-allowed bg-gray-300 text-gray-700 px-6 py-3 rounded-full dark:bg-gray-700 dark:text-gray-300"
            >
              Contact form disabled
            </button>
          </div>
        </form>
      </div>
    </motion.section>
  );
}
