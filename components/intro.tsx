"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HiDownload } from "react-icons/hi";
import { LuLanguages } from "react-icons/lu";
import { useSectionInView } from "@/lib/hooks";
import { localeInfo } from "@/lib/i18n/config";
import { useI18n } from "./i18n-provider";
import type { ReactNode } from "react";
import type { Profile } from "@/lib/content/schema";
import SocialLinks, { primaryButtonClassName } from "./social-links";
import TypewriterText from "./typewriter-text";

function renderBold(text: string): ReactNode[] {
  return text
    .split(/\*\*(.+?)\*\*/g)
    .map((part, index) =>
      index % 2 === 1 ? (
        <span key={index} className="font-medium">
          {part}
        </span>
      ) : (
        part
      )
    );
}

type IntroProps = {
  profile: Profile;
};

export default function Intro({ profile }: IntroProps) {
  const { ref } = useSectionInView("Home");
  const { nameVersions, contact, resume } = profile;
  const { locale, t } = useI18n();
  const [currentNameIndex, setCurrentNameIndex] = useState(() =>
    Math.max(0, nameVersions.findIndex((version) => version.lang === localeInfo[locale].htmlLang))
  );
  const currentName = nameVersions[currentNameIndex];
  const nextName = nameVersions[(currentNameIndex + 1) % nameVersions.length];

  const cycleNameVersion = () => {
    setCurrentNameIndex((prevIndex) => (prevIndex + 1) % nameVersions.length);
  };

  return (
    <section
      ref={ref}
      id="home"
      className="mb-24 max-w-200 scroll-mt-[100rem] text-center sm:mb-32"
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
              alt={t.intro.portraitAlt(profile.name)}
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
        <div className="flex w-full flex-col items-center px-4">
          <div className="relative">
            <h1 className="text-4xl leading-tight font-bold sm:text-6xl">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={currentNameIndex}
                  lang={currentName.lang}
                  initial={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  transition={{ duration: 0.25 }}
                  className="block"
                >
                  {currentName.name}
                </motion.span>
              </AnimatePresence>
            </h1>
            <button
              type="button"
              onClick={cycleNameVersion}
              className="absolute top-1/2 left-full ml-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-600 shadow-sm transition hover:text-indigo-600 hover:shadow-md focus-visible:outline-2 focus-visible:outline-indigo-500 active:scale-95 pointer-coarse:size-10 sm:ml-4 sm:size-11 sm:text-xl dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-indigo-300"
              title={t.intro.showName(nextName.label)}
              aria-label={t.intro.showName(nextName.label)}
            >
              <LuLanguages aria-hidden />
            </button>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={currentNameIndex}
              className="mt-1 text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {currentName.label}
            </motion.p>
          </AnimatePresence>
          <p className="mt-2 text-4xl font-bold sm:text-6xl">
            <TypewriterText
              words={profile.titles}
              typingSpeed={80}
              deletingSpeed={40}
              delayBetweenWords={2500}
              className="block text-indigo-600 dark:text-indigo-400"
            />
          </p>
        </div>

        <div className="mt-4 max-w-2xl">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
            {renderBold(profile.bio)}
          </p>
        </div>
      </motion.div>

      <motion.div
        className="flex flex-col items-center justify-center gap-3 px-4 sm:flex-row sm:gap-4"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
        }}
      >
        <a className={primaryButtonClassName} href={resume.file} download={resume.downloadName}>
          {t.intro.downloadResume}
          <HiDownload className="opacity-70 transition group-hover:translate-y-0.5" aria-hidden />
        </a>
        <SocialLinks linkedIn={contact.linkedIn} gitHub={contact.gitHub} />
      </motion.div>
    </section>
  );
}
