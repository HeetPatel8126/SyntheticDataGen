import React from 'react';
import RevealHeading from './ui/RevealHeading';
import LetterReveal from './ui/LetterReveal';

export default function Features() {
  return (
    <section className="bg-black text-white border-t border-black bg-grid-dark relative">
      <div className="max-w-[1440px] mx-auto border-x b-dark relative z-10">
        
        {/* Massive Headline Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b b-dark">
          <div className="col-span-12 md:col-span-8 p-12 md:p-16 md:py-32 border-r b-dark">
            <LetterReveal 
              text="Generate statistically identical datasets without exposing sensitive information. Seamlessly integrate differential privacy and scale your training pipelines with unmatched precision. Build models that don't just memorize, they generalize." 
              className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight max-w-4xl" 
              scrollOffset={["start 0.8", "start 0.4"]}
            />
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
              Unlock the full potential of synthetic data workflows. Our infrastructure ensures perfect relational integrity and high-fidelity output for every table.
            </p>
          </div>
          <div className="hidden md:block col-span-4 p-12 flex flex-col justify-end text-right">
             <div className="text-xs font-mono text-gray-500 mb-4">// DATABASE COMPATIBILITY</div>
             <div className="flex gap-4 justify-end opacity-50">
               <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-xs font-mono">PG</div>
               <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-xs font-mono">BQ</div>
               <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-xs font-mono">SF</div>
             </div>
          </div>
        </div>

        {/* 4-Column Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4">
          
          {/* Feature 1 */}
          <div className="p-8 md:p-12 border-b md:border-b-0 border-r b-dark hover:bg-white/5 transition flex flex-col items-start min-h-[400px]">
            <div className="mb-12">
              {/* Dummy Icon representing Secure Guard */}
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-400">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-4 mt-auto">Differential Privacy</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              We mathematically guarantee the privacy of your source data. Prevent memorization and data leaks by default.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 md:p-12 border-b md:border-b-0 border-r b-dark hover:bg-white/5 transition flex flex-col items-start min-h-[400px]">
            <div className="mb-12">
               {/* Dummy Icon representing Agent Build */}
               <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-400">
                 <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
               </svg>
            </div>
            <h3 className="text-xl font-medium mb-4 mt-auto">Relational Integrity</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Maintain complex foreign keys and constraints across dozens of tables perfectly in the synthetic output.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 md:p-12 border-b md:border-b-0 border-r b-dark hover:bg-white/5 transition flex flex-col items-start min-h-[400px]">
             <div className="mb-12">
               {/* Dummy Icon representing Cloud Scale */}
               <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-400">
                 <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
               </svg>
            </div>
            <h3 className="text-xl font-medium mb-4 mt-auto">Infinite Scale</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Generate billions of rows across distributed clusters in minutes. We ensure your data pipelines never bottleneck.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-8 md:p-12 hover:bg-white/5 transition flex flex-col items-start min-h-[400px]">
            <div className="mb-12">
               {/* Dummy Icon representing Data Pipeline */}
               <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-400">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
               </svg>
            </div>
            <h3 className="text-xl font-medium mb-4 mt-auto">Edge-Case Simulation</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Boost rare events and anomalies in your datasets to train models that handle the real world gracefully.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
