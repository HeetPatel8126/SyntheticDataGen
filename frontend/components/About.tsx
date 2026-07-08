'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import RevealHeading from './ui/RevealHeading';
import LetterReveal from './ui/LetterReveal';

const CircularGraphic = ({ percentage }: { percentage: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const dashes = Array.from({ length: 40 });
  const activeCount = Math.floor((percentage / 100) * 40);

  return (
    <div ref={ref} className="relative w-24 h-24 flex items-center justify-center mb-12">
      <div className="absolute inset-0">
        {dashes.map((_, i) => {
          const rotation = i * (360 / 40);
          const isActive = i < activeCount;
          return (
            <div
              key={i}
              className="absolute inset-0"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <motion.div
                className="absolute w-[1px] h-3 bg-black left-1/2 -ml-[0.5px]"
                style={{ top: 0, transformOrigin: 'top' }}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ 
                  opacity: isInView ? (isActive ? 1 : 0.15) : 0,
                  scaleY: isInView ? 1 : 0
                }}
                transition={{ 
                  duration: 0.3, 
                  delay: isInView ? i * 0.02 : 0,
                  ease: "easeOut"
                }}
              />
            </div>
          );
        })}
      </div>
      <motion.div 
        className="relative z-10 text-xs font-mono font-medium"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0 }}
        transition={{ duration: 0.5, delay: (activeCount * 0.02) + 0.2, ease: "backOut" }}
      >
        {percentage}%
      </motion.div>
    </div>
  );
};

export default function About() {
  return (
    <section className="bg-[#ebebeb] text-black border-t b-light">
      <div className="max-w-[1440px] mx-auto border-x b-light">
        
        {/* Top Text Block */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b b-light">
          {/* Empty left column to push text to the center-right */}
          <div className="hidden md:block md:col-span-3 border-r b-light"></div>
          
          <div className="col-span-12 md:col-span-9 p-12 md:p-16 md:py-24">
            <RevealHeading className="text-xs font-bold uppercase tracking-widest text-black mb-8 flex items-center gap-2 font-mono">
              <span className="w-4 h-[2px] bg-black"></span> OVERVIEW
            </RevealHeading>
            <div className="text-2xl md:text-3xl leading-relaxed max-w-3xl text-black font-medium">
              <LetterReveal 
                text="Our Synthetic Data Engine focuses on turning complex database schemas into highly realistic, privacy-preserving datasets. We work with AI teams that want more than limited test data. They need statistically identical, production-ready synthetic rows to train models securely at scale." 
                scrollOffset={["start 0.75", "end 0.3"]}
              />
            </div>
          </div>
        </div>

        {/* 4-Column Stat Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4">
          
          {/* Column 1 */}
          <div className="p-8 md:p-12 border-b md:border-b-0 border-r b-light flex flex-col items-start min-h-[400px]">
            <div className="text-xs font-mono text-black mb-16">//01</div>
            <CircularGraphic percentage={100} />
            <RevealHeading delay={0.4} className="text-xl font-mono font-bold tracking-tight mb-4 mt-auto">0 Data Leaks</RevealHeading>
            <RevealHeading delay={0.5} className="text-sm text-black leading-relaxed font-normal">
              Mathematically guaranteed differential privacy prevents memorization and protects PII.
            </RevealHeading>
          </div>

          {/* Column 2 */}
          <div className="p-8 md:p-12 border-b md:border-b-0 border-r b-light flex flex-col items-start min-h-[400px]">
            <div className="text-xs font-mono text-black mb-16">//02</div>
            <CircularGraphic percentage={99} />
            <RevealHeading delay={0.5} className="text-xl font-mono font-bold tracking-tight mb-4 mt-auto">Infinite Scaling</RevealHeading>
            <RevealHeading delay={0.6} className="text-sm text-black leading-relaxed font-normal">
              Generate 10M+ rows in minutes. Distributed clusters handle massive tabular synthesis.
            </RevealHeading>
          </div>

          {/* Column 3 */}
          <div className="p-8 md:p-12 border-b md:border-b-0 border-r b-light flex flex-col items-start min-h-[400px]">
            <div className="text-xs font-mono text-gray-500 mb-16">//03</div>
            <CircularGraphic percentage={100} />
            <RevealHeading delay={0.6} className="text-xl font-mono font-bold tracking-tight mb-4 mt-auto">Relational Integrity</RevealHeading>
            <RevealHeading delay={0.7} className="text-sm text-gray-600 leading-relaxed font-normal">
              Perfectly preserve complex foreign keys and constraints across dozens of tables.
            </RevealHeading>
          </div>

          {/* Column 4 */}
          <div className="p-8 md:p-12 flex flex-col items-start min-h-[400px]">
            <div className="text-xs font-mono text-gray-500 mb-16">//04</div>
            <CircularGraphic percentage={98} />
            <RevealHeading delay={0.7} className="text-xl font-mono font-bold tracking-tight mb-4 mt-auto">High Fidelity</RevealHeading>
            <RevealHeading delay={0.8} className="text-sm text-gray-600 leading-relaxed font-normal">
              Statistically identical distributions ensure your models learn the real world securely.
            </RevealHeading>
          </div>

        </div>

      </div>
    </section>
  );
}
