"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

type TypewriterTextProps = {
  words: readonly string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
  className?: string;
};

export default function TypewriterText({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenWords = 1500,
  className = "text-gradient-teal",
}: TypewriterTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const word = words[wordIndex];
    let delay = isDeleting ? deletingSpeed : typingSpeed;
    let step: () => void;

    if (!isDeleting && text === word) {
      delay = delayBetweenWords;
      step = () => setIsDeleting(true);
    } else if (isDeleting && text === "") {
      step = () => {
        setIsDeleting(false);
        setWordIndex((index) => (index + 1) % words.length);
      };
    } else {
      step = () =>
        setText(word.slice(0, text.length + (isDeleting ? -1 : 1)));
    }

    const timeout = setTimeout(step, delay);
    return () => clearTimeout(timeout);
  }, [
    shouldReduceMotion,
    words,
    wordIndex,
    text,
    isDeleting,
    typingSpeed,
    deletingSpeed,
    delayBetweenWords,
  ]);

  return (
    <span className="inline-block w-full min-h-[1.5em] pb-[0.2em] text-center leading-normal">
      <span className="sr-only">{words.join(", ")}</span>
      <span
        className={`${className} relative inline-block leading-[1.4]`}
        aria-hidden
      >
        {shouldReduceMotion ? words[0] : text}
        {!shouldReduceMotion && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="ml-0.5 font-bold"
          >
            |
          </motion.span>
        )}
      </span>
    </span>
  );
}
