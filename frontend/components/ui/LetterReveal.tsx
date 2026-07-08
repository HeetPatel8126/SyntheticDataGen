'use client';

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef } from 'react';

interface LetterRevealProps {
  text: string;
  className?: string;
  scrollOffset?: any;
}

export default function LetterReveal({ text, className = '', scrollOffset }: LetterRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: scrollOffset || ["start 0.85", "start 0.5"] 
  });

  const allChars = text.split('');

  return (
    <div ref={ref} className={className}>
      {allChars.map((char, index) => {
        if (char === '\n') {
          return <br key={index} />;
        }
        
        // Distribute the 0-1 scroll progress across all characters
        const start = index / allChars.length;
        const end = start + (1 / allChars.length);
        
        return (
          <Char 
            key={index} 
            char={char} 
            progress={scrollYProgress} 
            range={[start, end]} 
          />
        );
      })}
    </div>
  );
}

// Sub-component to handle the transform for each character
const Char = ({ 
  char, 
  progress, 
  range 
}: { 
  char: string; 
  progress: MotionValue<number>; 
  range: number[]; 
}) => {
  // As the scroll progress passes through this character's specific range, fade it from 15% to 100%
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }}>
      {char}
    </motion.span>
  );
};
