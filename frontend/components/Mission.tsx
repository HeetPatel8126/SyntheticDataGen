import React from 'react';
import RevealHeading from './ui/RevealHeading';
import LetterReveal from './ui/LetterReveal';

export default function Mission() {
  return (
    <section className="bg-[#f5f5f5] text-black">
      <div className="max-w-[1440px] mx-auto border-x b-light">
        
        {/* Top Header Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b b-light">
          <div className="p-12 md:p-16 border-r b-light">
            <RevealHeading className="text-xs font-bold uppercase tracking-widest text-black mb-8 flex items-center gap-2">
              <span className="w-4 h-[2px] bg-black"></span> OUR MISSION
            </RevealHeading>
            <LetterReveal 
              text={"Building on\nsynthetic\nreality"} 
              className="text-5xl font-light tracking-tight leading-[1.1] mb-8" 
            />
            <p className="text-black leading-relaxed max-w-md text-lg">
              We partner with AI teams to design, generate, and scale privacy-preserving datasets that train production-ready models from day one.
            </p>
          </div>
          <div className="hidden md:block p-12"></div>
        </div>

        {/* Content Grid Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b b-light">
          
          {/* Left Column (Stats) */}
          <div className="grid grid-cols-2 border-r b-light">
            {/* Top Left */}
            <div className="p-12 border-b border-r b-light flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-8">
                 <div className="flex -space-x-3">
                   <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                   <div className="w-8 h-8 rounded-full bg-black border-2 border-white"></div>
                   <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-white"></div>
                 </div>
                 <span className="text-xs font-mono text-black">Global Clients</span>
              </div>
              <p className="font-medium text-lg max-w-[200px] leading-tight">
                Trusted by startups and enterprises across four continents.
              </p>
            </div>
            {/* Top Right */}
            <div className="p-12 border-b b-light flex flex-col justify-center">
               <h3 className="text-6xl font-medium mb-4">10B+</h3>
               <p className="text-gray-600 text-sm leading-relaxed">
                 Rows of synthetic data generated for enterprise models, cutting time-to-value drastically.
               </p>
            </div>
            {/* Bottom Left */}
            <div className="p-12 border-r b-light flex flex-col justify-center col-span-2 md:col-span-1">
               <h3 className="text-6xl font-medium mb-4">0</h3>
               <p className="text-gray-600 text-sm leading-relaxed max-w-[200px]">
                 Data leaks or PII exposures thanks to mathematical differential privacy.
               </p>
            </div>
            {/* Bottom Right */}
             <div className="p-12 flex flex-col justify-end items-end col-span-2 md:col-span-1">
               <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-gray-200 px-4 py-2 rounded">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                 12 Database Connectors
               </div>
            </div>
          </div>

          {/* Right Column (Dark Box) */}
          <div className="p-12 md:p-16 flex items-center justify-center relative overflow-hidden bg-black text-white">
             {/* Space Image Placeholder */}
             <img 
                src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=1000" 
                alt="Planet" 
                className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
             
             <div className="relative z-10 w-full flex flex-col items-start mt-[100px]">
                <h3 className="text-2xl font-medium mb-8 max-w-sm">Generate your first production-ready dataset in under an hour.</h3>
                <button className="flex items-center bg-white text-black font-medium text-sm hover:bg-gray-200 transition">
                  <div className="bg-gray-100 p-3 border-r border-black/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2"><circle cx="12" cy="12" r="3" /></svg>
                  </div>
                  <span className="px-8 py-3">Get started</span>
                </button>
             </div>
          </div>
        </div>

        {/* Bottom Text and Badges */}
        <div className="p-12 md:p-16 grid grid-cols-1 md:grid-cols-2">
           <div className="max-w-2xl text-gray-600 leading-relaxed text-sm mb-12 md:mb-0">
             We've spent years at the frontier of applied data synthesis — building relational engines, intelligent anomalies, and edge-case generators for clients across fintech, health, and logistics. Our approach is rigorous and privacy-first: no data leaks, no memorization, just datasets that perform. Every engagement starts with a deep audit of your schemas, so we build exactly what your models need.
           </div>
           <div className="flex flex-wrap gap-4 items-end md:justify-end">
              <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold">iRap</div>
              <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold text-center">ISO<br/>27001</div>
              <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold text-center">ISO<br/>42001</div>
              <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold text-center border border-gray-600">SOC2<br/>TYPE 2</div>
           </div>
        </div>
      </div>
    </section>
  );
}
