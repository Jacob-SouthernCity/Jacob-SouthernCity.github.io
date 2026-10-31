"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { IoMdClose } from "react-icons/io";
import type { Project as ProjectData } from "@/lib/content/schema";
import { icons } from "@/lib/icons";

type ProjectVideo = NonNullable<ProjectData["video"]>;

const desktopMediaClassName =
  "absolute hidden md:block top-8 -right-40 w-113 rounded-t-lg shadow-2xl transition group-hover:scale-[1.04] group-hover:-translate-x-3 group-hover:translate-y-3 group-hover:-rotate-2 group-hover:group-even:translate-x-3 group-hover:group-even:translate-y-3 group-hover:group-even:rotate-2 group-even:right-[initial] group-even:-left-40";

function ProjectTrailer({
  title,
  video,
  className,
}: {
  title: string;
  video: ProjectVideo;
  className: string;
}) {
  return (
    <video
      controls
      playsInline
      preload="none"
      poster={video.poster}
      aria-label={`${title} trailer`}
      className={`aspect-video w-full bg-black object-cover ${className}`}
    >
      {video.sources.map(({ src, type }) => (
        <source key={src} src={src} type={type} />
      ))}
      Your browser does not support HTML5 video.
    </video>
  );
}

export default function Project({
  title,
  description,
  tags,
  image,
  video,
  links,
}: ProjectData) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalTriggerRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openModal = (event: MouseEvent<HTMLElement>) => {
    modalTriggerRef.current = event.currentTarget;
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsModalOpen(false);
      if (event.key === "Tab") {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    const modalTrigger = modalTriggerRef.current;

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      modalTrigger?.focus();
    };
  }, [isModalOpen]);

  const screenshotAlt = `${title} project screenshot`;

  return (
    <>
      <motion.div
        ref={ref}
        style={{
          scale: scaleProgress,
          opacity: opacityProgress,
        }}
        className="group mb-3 md:mb-8 last:mb-0"
      >
        <section className="max-w-2xl rounded-2xl border border-black/5 bg-white/60 shadow-sm backdrop-blur-sm overflow-hidden md:pr-8 relative md:min-h-80 transition-colors hover:bg-white/90 md:group-even:pl-8 dark:text-white dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10">
          <div className="pt-4 pb-7 px-5 md:pl-10 md:pr-2 md:pt-10 md:max-w-[50%] flex flex-col h-full md:group-even:ml-72">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-2xl font-semibold">{title}</h3>
              {links.map(({ icon, url, label }) => {
                const LinkIcon = icons[icon];
                return (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full p-1 pointer-coarse:p-2.5 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                  title={label}
                  aria-label={`${title}: ${label}`}
                >
                  <LinkIcon className="text-xl" />
                </a>
                );
              })}
            </div>

            <p className="mt-2 leading-relaxed text-slate-700 dark:text-white/70">
              {description}
            </p>

            {video && (
              <ProjectTrailer
                title={title}
                video={video}
                className="my-3 rounded-md shadow-md md:hidden"
              />
            )}

            {!video && image && (
              <button
                type="button"
                className="my-3 md:hidden"
                onClick={openModal}
                aria-label={`Enlarge ${title} screenshot`}
              >
                <Image
                  src={image}
                  alt={screenshotAlt}
                  quality={95}
                  className="w-full h-auto rounded-md shadow-md"
                />
              </button>
            )}

            <ul className="flex flex-wrap mt-4 gap-2 md:mt-auto">
              {tags.map((tag) => (
                <li
                  className="rounded-full bg-slate-900/80 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-white dark:bg-white/10 dark:text-slate-200"
                  key={tag}
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          {video ? (
            <div className={desktopMediaClassName}>
              <ProjectTrailer title={title} video={video} className="rounded-lg" />
            </div>
          ) : (
            image && (
              <button
                type="button"
                className={`${desktopMediaClassName} cursor-zoom-in`}
                onClick={openModal}
                aria-label={`Enlarge ${title} screenshot`}
              >
                <Image
                  src={image}
                  alt={screenshotAlt}
                  quality={95}
                  className="w-full h-auto rounded-lg"
                />
              </button>
            )
          )}
        </section>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-1001 flex items-center justify-center bg-black/80 p-4"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-label={screenshotAlt}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-7xl max-h-[90dvh] overflow-auto bg-white dark:bg-slate-800 rounded-lg shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="absolute top-4 right-4 z-10 p-2 bg-black/40 backdrop-blur-xs rounded-full text-white hover:bg-black/60 transition-colors"
                ref={closeButtonRef}
                onClick={closeModal}
                aria-label="Close screenshot"
                autoFocus
              >
                <IoMdClose className="text-2xl" />
              </button>
              <Image
                src={image}
                alt={screenshotAlt}
                quality={100}
                className="w-full h-auto max-h-[90dvh] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
