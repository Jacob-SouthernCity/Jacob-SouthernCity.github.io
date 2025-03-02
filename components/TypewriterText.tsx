"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Default professional titles
const DEFAULT_TITLES = [
  "Developer",
  "Engineer", 
  "Designer",
  "Architect",
  "Creator"
];

interface TypewriterTextProps {
  words?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
  className?: string;
  showCursor?: boolean;
  cursorCharacter?: string;
}

/**
 * TypewriterText - A component that cycles through different text phrases with a typewriter effect
 * 
 * @param words - Array of words/phrases to type
 * @param typingSpeed - Speed of typing in milliseconds
 * @param deletingSpeed - Speed of deleting in milliseconds
 * @param delayBetweenWords - Delay between words in milliseconds
 * @param className - CSS class for the text
 * @param showCursor - Whether to show the blinking cursor
 * @param cursorCharacter - The character to use for the cursor
 */
const TypewriterText: React.FC<TypewriterTextProps> = ({
  words = DEFAULT_TITLES,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenWords = 1500,
  className = "text-gradient-teal",
  showCursor = true,
  cursorCharacter = "|"
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Effect to handle the typewriter animation
  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let timeout: NodeJS.Timeout;
    
    // Typing
    if (!isDeleting && currentText.length < currentWord.length) {
      timeout = setTimeout(() => {
        setCurrentText(currentWord.substring(0, currentText.length + 1));
      }, typingSpeed);
    } 
    // Pause before deleting
    else if (!isDeleting && currentText.length === currentWord.length && !isPaused) {
      timeout = setTimeout(() => {
        setIsPaused(true);
        
        setTimeout(() => {
          setIsDeleting(true);
          setIsPaused(false);
        }, delayBetweenWords);
      }, 100);
    } 
    // Deleting
    else if (isDeleting && currentText.length > 0) {
      timeout = setTimeout(() => {
        setCurrentText(currentWord.substring(0, currentText.length - 1));
      }, deletingSpeed);
    } 
    // Move to next word
    else if (isDeleting && currentText.length === 0) {
      setIsDeleting(false);
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }
    
    return () => clearTimeout(timeout);
  }, [currentText, currentWordIndex, isDeleting, isPaused, words, typingSpeed, deletingSpeed, delayBetweenWords]);
  
  return (
    <span className="inline-block text-center min-h-[1.5em] leading-normal" style={{ minWidth: '100%', paddingBottom: '0.2em' }}>
      <span className={`${className} inline-block relative leading-relaxed`} style={{ lineHeight: '1.4' }}>
        {currentText}
        {showCursor && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="ml-0.5 font-bold"
          >
            {cursorCharacter}
          </motion.span>
        )}
      </span>
    </span>
  );
};

export default TypewriterText; 