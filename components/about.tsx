"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";

export default function About() {
  const { ref } = useSectionInView("Home");

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <SectionHeading>About me</SectionHeading>
      <p className="mb-3">
        I am currently pursuing my Master's degree in{" "}
        <span className="font-medium">Computer Science at Yale University</span>, after completing my dual degrees in{" "}
        <span className="font-medium">Computer Science (Games) and Computational Mathematics at USC</span>.{" "}
        <span className="italic">My passion lies at the intersection of</span> game development, 
        artificial intelligence, and software engineering. I {" "}
        <span className="underline">thrive</span> on solving complex technical challenges 
        and designing systems that deliver engaging user experiences. My technical expertise includes{" "}
        <span className="font-medium">
          C++, Unity, C#, React, and various AI technologies
        </span>
        . I'm constantly exploring new technologies and methodologies to enhance my skills as a developer.
      </p>

      <p>
        <span className="italic">Beyond coding</span>, I enjoy playing and analyzing video games, 
        exploring new technologies, and contributing to open-source projects. I'm particularly interested in{" "}
        <span className="font-medium">game AI, procedural generation, and interactive storytelling</span>. 
        My academic background in both computer science and mathematics gives me a unique perspective 
        on problem-solving and system design.
      </p>
    </motion.section>
  );
}
