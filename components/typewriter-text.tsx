"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useInView } from "react-intersection-observer";

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
  className,
}: TypewriterTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const [position, setPosition] = useState(0);
  const [text, setText] = useState(words[0] ?? "");
  const [isDeleting, setIsDeleting] = useState(false);
  const wasOutOfView = useRef(false);
  const word = words[position % words.length] ?? "";
  const isFinished = words.length < 2 || (position === words.length && text === word);
  const canReplay = isFinished && words.length > 1 && !shouldReduceMotion;

  const replay = () => {
    if (!canReplay) return;
    setPosition(0);
    setIsDeleting(true);
  };

  const { ref } = useInView({
    initialInView: true,
    onChange: (inView) => {
      if (!inView) wasOutOfView.current = true;
      else if (wasOutOfView.current) {
        wasOutOfView.current = false;
        replay();
      }
    },
  });

  useEffect(() => {
    if (shouldReduceMotion || isFinished) return;

    let delay = isDeleting ? deletingSpeed : typingSpeed;
    let step: () => void;

    if (!isDeleting && text === word) {
      delay = delayBetweenWords;
      step = () => setIsDeleting(true);
    } else if (isDeleting && text === "") {
      step = () => {
        setIsDeleting(false);
        setPosition((current) => current + 1);
      };
    } else {
      step = () => setText(word.slice(0, text.length + (isDeleting ? -1 : 1)));
    }

    const timeout = setTimeout(step, delay);
    return () => clearTimeout(timeout);
  }, [shouldReduceMotion, isFinished, word, text, isDeleting, typingSpeed, deletingSpeed, delayBetweenWords]);

  return (
    <span
      ref={ref}
      onClick={replay}
      className={`inline-block w-full min-h-[1.5em] pb-[0.2em] text-center leading-normal ${canReplay ? "cursor-pointer" : ""}`}
    >
      <span className="sr-only">{words.join(", ")}</span>
      <span className={`${className} relative inline-block leading-[1.4]`} aria-hidden>
        {shouldReduceMotion ? words[0] : text}
        {!shouldReduceMotion && !isFinished && (
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
