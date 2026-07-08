'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface RevealHeadingProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function RevealHeading({ children, className = '', delay = 0 }: RevealHeadingProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      // Start hidden with a clip-path that hides everything to the right
      initial={{ clipPath: 'inset(0% 100% 0% 0%)', opacity: 0, y: 20 }}
      animate={{ 
        // Wipe the clip-path to reveal the text from left to right
        clipPath: isInView ? 'inset(0% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)',
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 20
      }}
      transition={{ 
        duration: 1.2, 
        ease: [0.16, 1, 0.3, 1], 
        delay 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
