"use client";

import SectionHeading from "./section-heading";
import { motion } from "motion/react";
import { useSectionInView } from "@/lib/hooks";
import type { Profile } from "@/lib/content/schema";
import { FaEnvelope } from "react-icons/fa";
import SocialLinks, { primaryButtonClassName } from "./social-links";

type ContactProps = {
  contact: Profile["contact"];
};

export default function Contact({ contact }: ContactProps) {
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

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        <a className={primaryButtonClassName} href={`mailto:${contact.email}`}>
          <FaEnvelope aria-hidden />
          {contact.email}
        </a>
        <SocialLinks linkedIn={contact.linkedIn} gitHub={contact.gitHub} />
      </div>
    </motion.section>
  );
}
