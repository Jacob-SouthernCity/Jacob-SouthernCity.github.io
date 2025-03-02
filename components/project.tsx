"use client";

import { useRef, useState } from "react";
import { projectsData } from "@/lib/data";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { FaSteam, FaGithub, FaLink, FaYoutube } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

// Map of icon names to their components
const iconMap: Record<string, React.ElementType> = {
  FaSteam,
  FaGithub,
  FaLink,
  FaYoutube
};

// Update type to include the modular links property
type ProjectProps = {
  title: string;
  description: string;
  tags: readonly string[];
  imageUrl: any;
  videoUrl?: string;
  links?: readonly {
    icon: string;
    url: string;
    label: string;
  }[];
};

export default function Project({
  title,
  description,
  tags,
  imageUrl,
  videoUrl,
  links = [],
}: ProjectProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });
  const scaleProgess = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgess = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
  
  // State for the fullscreen modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        ref={ref}
        style={{
          scale: scaleProgess,
          opacity: opacityProgess,
        }}
        className="group mb-3 sm:mb-8 last:mb-0"
      >
        <section className="bg-gray-100 max-w-[42rem] border border-black/5 rounded-lg overflow-hidden sm:pr-8 relative sm:min-h-[20rem] hover:bg-gray-200 transition sm:group-even:pl-8 dark:text-white dark:bg-white/10 dark:hover:bg-white/20">
          <div className="pt-4 pb-7 px-5 sm:pl-10 sm:pr-2 sm:pt-10 sm:max-w-[50%] flex flex-col h-full sm:group-even:ml-[18rem]">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-2xl font-semibold">{title}</h3>
              {links.map((link, index) => {
                const IconComponent = iconMap[link.icon] || FaLink;
                return (
                  <a 
                    key={index}
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    title={link.label}
                  >
                    <IconComponent className="text-xl" />
                  </a>
                );
              })}
            </div>
            
            <p className="mt-2 leading-relaxed text-gray-700 dark:text-white/70">
              {description}
            </p>
            
            {videoUrl && (
              <div className="my-3 sm:hidden">
                <video 
                  src={videoUrl} 
                  controls 
                  className="w-full h-auto rounded-md shadow-md cursor-pointer"
                  preload="metadata"
                  onClick={() => setIsModalOpen(true)}
                >
                  Your browser does not support HTML5 video.
                </video>
              </div>
            )}
            
            <ul className="flex flex-wrap mt-4 gap-2 sm:mt-auto">
              {tags.map((tag, index) => (
                <li
                  className="bg-black/[0.7] px-3 py-1 text-[0.7rem] uppercase tracking-wider text-white rounded-full dark:text-white/70"
                  key={index}
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          {videoUrl ? (
            <div 
              className="absolute hidden sm:block top-8 -right-40 w-[28.25rem] rounded-t-lg shadow-2xl
                transition 
                group-hover:scale-[1.04]
                group-hover:-translate-x-3
                group-hover:translate-y-3
                group-hover:-rotate-2
                group-even:group-hover:translate-x-3
                group-even:group-hover:translate-y-3
                group-even:group-hover:rotate-2
                group-even:right-[initial] group-even:-left-40"
            >
              <video 
                src={videoUrl} 
                controls 
                className="w-full h-auto rounded-lg cursor-pointer"
                preload="metadata"
                onClick={() => setIsModalOpen(true)}
              >
                Your browser does not support HTML5 video.
              </video>
            </div>
          ) : (
            <div 
              className="absolute hidden sm:block top-8 -right-40 w-[28.25rem] rounded-t-lg shadow-2xl
                transition 
                group-hover:scale-[1.04]
                group-hover:-translate-x-3
                group-hover:translate-y-3
                group-hover:-rotate-2
                group-even:group-hover:translate-x-3
                group-even:group-hover:translate-y-3
                group-even:group-hover:rotate-2
                group-even:right-[initial] group-even:-left-40
                cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <Image
                src={imageUrl}
                alt={`${title} project screenshot`}
                quality={95}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
        </section>
      </motion.div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-7xl max-h-[90vh] overflow-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-10 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                <IoMdClose className="text-2xl" />
              </button>
              
              {videoUrl ? (
                <video 
                  src={videoUrl} 
                  controls 
                  autoPlay
                  className="w-full h-auto max-h-[90vh]"
                  preload="auto"
                >
                  Your browser does not support HTML5 video.
                </video>
              ) : (
                <div className="relative w-full max-h-[90vh]">
                  <Image
                    src={imageUrl}
                    alt={`${title} project screenshot`}
                    quality={100}
                    className="w-full h-auto object-contain"
                    width={1200}
                    height={800}
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
