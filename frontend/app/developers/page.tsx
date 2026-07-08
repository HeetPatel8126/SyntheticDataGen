'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function DevelopersPage() {
  return (
    <div className="antialiased min-h-screen bg-[#ebebeb] text-black selection:bg-black selection:text-white">
      <div className="bg-black text-white">
        <Navbar />
      </div>

      <main className="max-w-[1440px] mx-auto border-x border-black/10">
        
        {/* ROW 1: EDITORIAL HERO */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black/10">
          
          {/* Left Label */}
          <div className="hidden md:block col-span-3 border-r border-black/10 p-8">
             <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black/50 font-mono">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 17l6-6-6-6M12 19h8"/></svg>
               THE SDK
             </div>
          </div>
          
          {/* Main Title */}
          <div className="col-span-12 md:col-span-6 border-r border-black/10 p-12 md:p-16 py-24 md:py-32">
            <h1 className="text-6xl md:text-7xl font-medium tracking-tight leading-[1.05] mb-8">
              Building on synthetic intelligence.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg mb-12">
              We partner with bold data teams to design, deploy, and scale synthetic generation systems that create real business value from day one.
            </p>
            <div className="flex gap-4 items-center">
              <div className="flex -space-x-2">
                 <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-[#ebebeb]"></div>
                 <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-[#ebebeb]"></div>
                 <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-[#ebebeb]"></div>
              </div>
              <span className="text-xs font-mono font-medium text-gray-500 uppercase tracking-widest">Global Clients</span>
            </div>
          </div>

          {/* Right Black Anchor */}
          <div className="col-span-12 md:col-span-3 bg-[#0a0a0a] text-white flex flex-col justify-end p-8 relative overflow-hidden min-h-[400px]">
            {/* Minimal graphic in the background */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
              <div className="w-full h-32 border-b border-white/20 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.2)_0%,transparent_70%)]"></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-medium mb-8 leading-snug">
                Deploy your first generation pipeline in under thirty minutes.
              </h3>
              <button className="flex items-center gap-4 bg-white text-black px-6 py-3 font-medium text-sm hover:bg-gray-200 transition group w-fit">
                <span className="bg-black w-6 h-6 flex items-center justify-center rounded-sm">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </span>
                Get started
              </button>
            </div>
          </div>

        </div>

        {/* ROW 2: STATS */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black/10">
          <div className="col-span-12 md:col-span-3 border-r border-black/10 p-8 md:p-12">
            <h4 className="text-xl font-medium mb-4">Trusted by startups and enterprises across four continents.</h4>
          </div>
          <div className="col-span-12 md:col-span-3 border-r border-black/10 p-8 md:p-12 flex flex-col justify-center">
            <div className="text-5xl font-medium tracking-tight mb-4">3x</div>
            <p className="text-sm text-gray-500 leading-relaxed">Average ROI delivered within the first year of deployment.</p>
          </div>
          <div className="col-span-12 md:col-span-6 p-8 md:p-12 flex flex-col justify-center">
            <div className="text-5xl font-medium tracking-tight mb-4">10B+</div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">Records generated daily, saving countless hours of manual data engineering and masking.</p>
          </div>
        </div>

        {/* ROW 3: FEATURES & GRAPHICS (Image 2 style) */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black/10">
          
          {/* Left Block: Floating Card */}
          <div className="col-span-12 md:col-span-5 border-r border-black/10 p-12 md:p-16 flex flex-col items-center justify-between bg-white/50">
             
             <div className="w-full text-left mb-16">
               <span className="text-xs font-mono text-black/50 uppercase tracking-widest">// CORE PIPELINE</span>
             </div>

             {/* Recreated Floating White Card */}
             <div className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] p-6 w-full max-w-sm mb-16 relative border border-gray-100">
               {/* Right edge connector node */}
               <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-full border-4 border-[#ebebeb] flex items-center justify-center z-10 shadow-lg">
                 <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white border-b-[4px] border-b-transparent ml-1"></div>
               </div>
               
               <div className="flex justify-between items-center py-4 border-b border-gray-100">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   <span className="text-xs font-bold uppercase tracking-wider text-gray-800">Define Schema</span>
                 </div>
                 <span className="text-xs text-gray-400 font-mono">1.2ms</span>
               </div>
               
               <div className="flex justify-between items-center py-4 border-b border-gray-100">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                   <span className="text-xs font-bold uppercase tracking-wider text-gray-800">Generate Data</span>
                 </div>
                 <span className="text-xs text-gray-400 font-mono">0.8ms</span>
               </div>

               <div className="flex justify-between items-center py-4">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                   <span className="text-xs font-bold uppercase tracking-wider text-gray-800">Stream To Sink</span>
                 </div>
                 <span className="text-xs text-gray-400 font-mono">3.4ms</span>
               </div>
             </div>

             <div className="w-full text-left mt-16">
               <h3 className="text-2xl font-medium mb-4">Pipeline Architecture</h3>
               <p className="text-gray-500 leading-relaxed text-sm max-w-sm">
                 Transitioning from manual CSV generation to robust, API-driven workflows with automated routing and referential integrity.
               </p>
             </div>
          </div>

          {/* Middle Block: Vector / Branching SVG */}
          <div className="col-span-12 md:col-span-4 border-r border-black/10 p-12 md:p-16 flex flex-col justify-start">
             
             {/* Sub-feature 1 */}
             <div className="mb-16">
               <div className="h-16 flex items-center mb-8 opacity-70">
                 <svg width="100%" height="20" viewBox="0 0 200 20" preserveAspectRatio="none">
                   <path d="M0 10 L 50 10 L 50 5 L 120 5 L 120 15 L 200 15" fill="none" stroke="#3b82f6" strokeWidth="2" />
                   <path d="M0 15 L 40 15 L 40 10 L 100 10 L 100 20 L 200 20" fill="none" stroke="#eab308" strokeWidth="2" />
                   <path d="M0 5 L 60 5 L 60 15 L 140 15 L 140 10 L 200 10" fill="none" stroke="#ef4444" strokeWidth="2" />
                 </svg>
               </div>
               <h3 className="text-xl font-medium mb-2">Relational Mapping</h3>
               <p className="text-gray-500 text-sm leading-relaxed">
                 Automatically map complex foreign keys and constraints as data flows through the pipeline.
               </p>
             </div>

             {/* Sub-feature 2 (Branching SVG) */}
             <div>
               <div className="h-24 flex items-center justify-center mb-8">
                 <svg width="160" height="80" viewBox="0 0 160 80" className="overflow-visible">
                   <path d="M 40 40 C 80 40, 80 15, 120 15" fill="none" stroke="#d946ef" strokeWidth="1.5" />
                   <path d="M 40 40 C 80 40, 80 65, 120 65" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
                   
                   <circle cx="40" cy="40" r="16" fill="black" />
                   <polygon points="36,34 46,40 36,46" fill="white" />
                   
                   {/* Top Node */}
                   <rect x="110" y="5" width="20" height="20" rx="4" fill="white" stroke="#d946ef" strokeWidth="1.5" />
                   <path d="M120 10 L120 20 M115 15 L125 15" stroke="#d946ef" strokeWidth="1.5" />
                   
                   {/* Bottom Node */}
                   <rect x="110" y="55" width="20" height="20" rx="4" fill="white" stroke="#f43f5e" strokeWidth="1.5" />
                   <circle cx="120" cy="65" r="4" stroke="#f43f5e" strokeWidth="1.5" fill="none" />
                 </svg>
               </div>
               <h3 className="text-xl font-medium mb-2">Sink Management</h3>
               <p className="text-gray-500 text-sm leading-relaxed">
                 Stream directly to multiple databases simultaneously with zero memory leaks.
               </p>
             </div>

          </div>

          {/* Right Block: Sidebar Links */}
          <div className="col-span-12 md:col-span-3 p-12 flex flex-col gap-12 bg-white/30">
            
            <div>
              <h3 className="text-lg font-medium text-gray-500 mb-2 hover:text-black transition cursor-pointer">
                Why Your Async Pipelines Feel Inconsistent
              </h3>
              <div className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                System Architecture <br/> <span className="text-gray-300">3 Min Read</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-black mb-2 hover:underline cursor-pointer border-b border-black inline-block pb-1">
                From Scripting to Systems: The Storage Shift
              </h3>
              <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mt-2">
                Auto Cleanup <br/> <span className="text-gray-300">2 Min Read</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-500 mb-2 hover:text-black transition cursor-pointer">
                Deploying the Next.js Unified Dashboard
              </h3>
              <div className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                UX / UI <br/> <span className="text-gray-300">5 Min Read</span>
              </div>
            </div>

          </div>

        </div>

        {/* ROW 4: SDK EXPLORER */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black/10">
           
           {/* Vertical Menu */}
           <div className="col-span-12 md:col-span-4 border-r border-black/10 flex flex-col bg-[#ebebeb]">
             <div className="p-8 border-b border-black/10 bg-white shadow-[inset_4px_0_0_black] cursor-pointer flex items-center justify-between group">
               <span className="font-medium text-black">Node.js (TypeScript)</span>
               <span className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-xs">&rarr;</span>
             </div>
             <div className="p-8 border-b border-black/10 hover:bg-white/50 cursor-pointer flex items-center justify-between transition group text-gray-500">
               <span className="font-medium group-hover:text-black">Python</span>
               <span className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-xs">&rarr;</span>
             </div>
             <div className="p-8 border-b border-black/10 hover:bg-white/50 cursor-pointer flex items-center justify-between transition group text-gray-500">
               <span className="font-medium group-hover:text-black">REST API</span>
               <span className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-xs">&rarr;</span>
             </div>
             <div className="p-8 hover:bg-white/50 cursor-pointer flex items-center justify-between transition group text-gray-500">
               <span className="font-medium group-hover:text-black">CLI Integration</span>
               <span className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-xs">&rarr;</span>
             </div>
           </div>

           {/* Light Code Editor */}
           <div className="col-span-12 md:col-span-8 p-12 md:p-16 bg-[#fafafa] flex flex-col justify-center overflow-hidden relative">
             <div className="text-xs font-mono text-black/50 uppercase tracking-widest mb-12">// INTEGRATION</div>

             {/* Fake editor chrome */}
             <div className="absolute top-0 left-0 w-full h-12 border-b border-gray-200 flex items-center px-6 gap-2 bg-white">
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                <div className="ml-4 text-xs font-mono text-gray-400">index.ts</div>
             </div>
             
             <pre className="font-mono text-sm md:text-base text-gray-800 leading-relaxed overflow-x-auto mt-8">
               <code>
                 <span className="text-purple-600">import</span> {'{'} SynthData {'}'} <span className="text-purple-600">from</span> <span className="text-green-600">'@synthdata/sdk'</span>;<br/><br/>
                 <span className="text-gray-400">// Initialize the client globally</span><br/>
                 <span className="text-purple-600">const</span> synth = <span className="text-purple-600">new</span> SynthData({'{'} <br/>
                 &nbsp;&nbsp;apiKey: process.env.SYNTH_KEY,<br/>
                 &nbsp;&nbsp;environment: <span className="text-green-600">'production'</span><br/>
                 {'}'});<br/><br/>
                 <span className="text-gray-400">// Trigger an async generation pipeline</span><br/>
                 <span className="text-purple-600">await</span> synth.generate({'{'}<br/>
                 &nbsp;&nbsp;schema: <span className="text-green-600">'ecommerce_v2'</span>,<br/>
                 &nbsp;&nbsp;records: <span className="text-blue-600">100000</span>,<br/>
                 &nbsp;&nbsp;preserveRelations: <span className="text-purple-600">true</span>,<br/>
                 &nbsp;&nbsp;destination: {'{'} type: <span className="text-green-600">'postgres'</span> {'}'}<br/>
                 {'}'});
               </code>
             </pre>
           </div>
        </div>

        {/* ROW 5: PERFORMANCE BENCHMARKS */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black/10 bg-white/50">
           
           <div className="col-span-12 md:col-span-4 border-r border-black/10 p-12 md:p-16 flex flex-col justify-start min-h-[350px]">
              <div className="text-xs font-mono text-black/50 uppercase tracking-widest mb-16">// SCALE & PERFORMANCE</div>
              <div className="mt-auto">
                <h3 className="text-6xl font-medium tracking-tight mb-2">1.2ms</h3>
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">P99 API Latency</div>
              </div>
              <div className="w-full mt-12 opacity-80">
                 <svg width="100%" height="60" viewBox="0 0 200 60" preserveAspectRatio="none">
                    <path d="M0 50 L 30 50 L 30 40 L 60 40 L 60 45 L 90 45 L 90 35 L 120 35 L 120 20 L 150 20 L 150 15 L 200 15" fill="none" stroke="#10b981" strokeWidth="2" />
                    <circle cx="200" cy="15" r="4" fill="#10b981" />
                 </svg>
              </div>
           </div>

           <div className="col-span-12 md:col-span-4 border-r border-black/10 p-12 md:p-16 flex flex-col justify-start min-h-[350px]">
              <div className="mt-auto">
                <h3 className="text-6xl font-medium tracking-tight mb-2">10B+</h3>
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Rows Daily</div>
              </div>
              <div className="w-full mt-12 opacity-80">
                 <svg width="100%" height="60" viewBox="0 0 200 60" preserveAspectRatio="none">
                    <rect x="0" y="40" width="20" height="20" fill="#3b82f6" opacity="0.3" />
                    <rect x="25" y="30" width="20" height="30" fill="#3b82f6" opacity="0.5" />
                    <rect x="50" y="35" width="20" height="25" fill="#3b82f6" opacity="0.7" />
                    <rect x="75" y="15" width="20" height="45" fill="#3b82f6" opacity="0.9" />
                    <rect x="100" y="5" width="20" height="55" fill="#3b82f6" />
                 </svg>
              </div>
           </div>

           <div className="col-span-12 md:col-span-4 p-12 md:p-16 flex flex-col justify-start min-h-[350px]">
              <div className="mt-auto">
                <h3 className="text-6xl font-medium tracking-tight mb-2">Zero</h3>
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Memory Leaks</div>
              </div>
              <div className="w-full mt-12 opacity-80">
                 <svg width="100%" height="60" viewBox="0 0 200 60" preserveAspectRatio="none">
                    <path d="M0 45 L 200 45" fill="none" stroke="#000000" strokeWidth="2" strokeDasharray="4 4" opacity="0.2" />
                    <path d="M0 45 L 200 45" fill="none" stroke="#000000" strokeWidth="2" />
                 </svg>
              </div>
           </div>

        </div>

        {/* ROW 6: ENTERPRISE COMPLIANCE */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black/10">
           
           <div className="col-span-12 md:col-span-4 border-r border-black/10 p-12 md:p-16 flex flex-col justify-start min-h-[350px]">
             <div className="text-xs font-mono text-black/50 uppercase tracking-widest mb-16">// SECURITY & COMPLIANCE</div>
             <h2 className="text-4xl font-medium tracking-tight mb-6 mt-auto">Enterprise-grade security by default.</h2>
             <p className="text-gray-500 leading-relaxed max-w-sm">
               Our architecture never stores your raw source data. Everything is generated statelessly and streamed securely.
             </p>
           </div>

           <div className="col-span-12 md:col-span-8 p-12 md:p-16 bg-white/30 grid grid-cols-1 md:grid-cols-2 gap-12">
              
              <div className="flex gap-6">
                 <div className="w-12 h-12 rounded-full border border-black/20 flex items-center justify-center shrink-0">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                 </div>
                 <div>
                   <h4 className="text-lg font-medium mb-2 text-black">SOC2 Type II</h4>
                   <p className="text-sm text-gray-500 leading-relaxed">Independently audited for security, availability, and confidentiality.</p>
                 </div>
              </div>

              <div className="flex gap-6">
                 <div className="w-12 h-12 rounded-full border border-black/20 flex items-center justify-center shrink-0">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                 </div>
                 <div>
                   <h4 className="text-lg font-medium mb-2 text-black">HIPAA Compliant</h4>
                   <p className="text-sm text-gray-500 leading-relaxed">Built to safely synthesize sensitive healthcare data and PHI.</p>
                 </div>
              </div>

              <div className="flex gap-6">
                 <div className="w-12 h-12 rounded-full border border-black/20 flex items-center justify-center shrink-0">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                 </div>
                 <div>
                   <h4 className="text-lg font-medium mb-2 text-black">GDPR Ready</h4>
                   <p className="text-sm text-gray-500 leading-relaxed">Guaranteed privacy means your data is fundamentally un-linkable to individuals.</p>
                 </div>
              </div>

              <div className="flex gap-6">
                 <div className="w-12 h-12 rounded-full border border-black/20 flex items-center justify-center shrink-0">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                 </div>
                 <div>
                   <h4 className="text-lg font-medium mb-2 text-black">ISO 27001</h4>
                   <p className="text-sm text-gray-500 leading-relaxed">Information security management systems certified to global standards.</p>
                 </div>
              </div>

           </div>
        </div>

      </main>

      <div className="bg-black text-white border-t border-white/20">
        <Footer />
      </div>
    </div>
  );
}
