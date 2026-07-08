'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LetterReveal from '../../components/ui/LetterReveal';
import { BranchingGraphic, LinearTimelineGraphic, StackedBoxesGraphic } from '../../components/ui/TimelineGraphics';

const bentoArticles = [
  {
    id: 0,
    title: "Why Your Async Pipelines Feel Inconsistent",
    tag: "ASYNC PROCESSING",
    readTime: "3 MIN READ",
    left: {
      title: "Generate Anything: Multiple Data Types",
      desc: "The engine supports deep relations across hundreds of entities out of the box, preserving constraints seamlessly.",
      graphic: <BranchingGraphic branches={[
                          { color: '#3b82f6', label: 'User/Person', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg> },
                          { color: '#eab308', label: 'E-commerce', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> },
                          { color: '#22c55e', label: 'Company', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg> }
                       ]} theme="light" />
    },
    midTop: {
      title: "Visual Schema Editor",
      desc: "Custom Templates natively support constraints and foreign keys without SQL.",
      graphic: <BranchingGraphic branches={[
                            { color: '#ec4899', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg> },
                            { color: '#14b8a6', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/></svg> }
                         ]} theme="light" />
    },
    midBottom: {
      title: "Enterprise Authentication",
      desc: "JWT-based auth and strict API key access controls for all endpoints.",
      graphic: <StackedBoxesGraphic theme="light" />
    }
  },
  {
    id: 1,
    title: "From Prompting to Systems: The Storage Shift",
    tag: "AUTO CLEANUP",
    readTime: "2 MIN READ",
    left: {
      title: "Persistent Memory Architecture",
      desc: "Transitioning from stateless prompts to robust, version-controlled system states with automated garbage collection.",
      graphic: <StackedBoxesGraphic theme="light" />
    },
    midTop: {
      title: "Vector Embeddings",
      desc: "Automatically vectorize unstructured data as it flows through the pipeline.",
      graphic: <LinearTimelineGraphic theme="light" />
    },
    midBottom: {
      title: "State Management",
      desc: "Handle massive JSON payloads with zero memory leaks.",
      graphic: <BranchingGraphic branches={[
                            { color: '#a855f7', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
                            { color: '#ef4444', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/></svg> }
                         ]} theme="light" />
    }
  },
  {
    id: 2,
    title: "Deploying the Next.js Unified Dashboard",
    tag: "UX / UI",
    readTime: "5 MIN READ",
    left: {
      title: "Server Components at Edge",
      desc: "Rendering your unified dashboard natively at the edge for sub-50ms TTFB and flawless hydration.",
      graphic: <BranchingGraphic branches={[
                          { color: '#000000', label: 'Server', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg> },
                          { color: '#3b82f6', label: 'Client', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/></svg> }
                       ]} theme="light" />
    },
    midTop: {
      title: "Real-time Subscriptions",
      desc: "WebSockets powered by our global edge network.",
      graphic: <BranchingGraphic branches={[{ color: '#22c55e', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>}]} theme="light" />
    },
    midBottom: {
      title: "Role-based Access",
      desc: "Granular UI controls based on synthetic data schemas.",
      graphic: <StackedBoxesGraphic theme="light" />
    }
  }
];

export default function FeaturesPage() {
  const [activeArticle, setActiveArticle] = useState(0);
  const [activeAutonomyTab, setActiveAutonomyTab] = useState('DISCOVERY');
  return (
    <div className="antialiased min-h-screen bg-[#ebebeb] text-black relative">
      <Navbar />

      {/* BACKGROUND VERTICAL GRID LINES (Global for the page) */}
      <div className="absolute inset-0 pointer-events-none flex justify-center w-full z-0 opacity-20 mix-blend-difference overflow-hidden">
         <div className="w-full h-full flex">
            <div className="h-full border-r border-white flex-1"></div>
            <div className="h-full border-r border-white flex-1"></div>
            <div className="h-full border-r border-white flex-1"></div>
            <div className="h-full flex-1"></div>
         </div>
      </div>
      
      {/* SECTION 1: Asymmetrical Hero (Inspired by Image 1) */}
      <section className="pt-32 pb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 w-full">
          
          {/* Col 1: Empty Spacer */}
          <div className="hidden md:block"></div>

          {/* Col 2: Main Text */}
          <div className="p-8 lg:p-12 flex flex-col justify-between">
             <div>
                 <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-12">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
                   OUR PLATFORM
                 </div>
                 <LetterReveal 
                   text={"Building on\nsynthetic data\nintelligence"} 
                   className="text-5xl lg:text-[70px] font-medium tracking-tight leading-[1.05] mb-8"
                 />
                 <motion.p 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}
                   className="text-gray-600 text-lg max-w-md leading-relaxed mb-16"
                 >
                   We partner with bold AI teams to design, deploy, and scale synthetic data generation systems that create highly realistic, privacy-preserving environments from day one.
                 </motion.p>
             </div>
             <div>
                <h4 className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-widest mb-4">Trusted by startups and enterprises across four continents.</h4>
                <div className="text-6xl md:text-[80px] font-light mb-4 tracking-tight">10M+</div>
                <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                  Rows generated per minute across distributed Celery clusters. Unmatched speed and reliability for your QA teams.
                </p>
             </div>
          </div>

          {/* Col 3: Stat */}
          <div className="p-8 lg:p-12 flex flex-col justify-end">
             <div>
                <div className="text-6xl md:text-[80px] font-light mb-4 tracking-tight">99.9%</div>
                <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                  Uptime SLA for critical agent infrastructure. We cut time-to-value by combining proven stacks with deep domain expertise.
                </p>
                <div className="mt-8 flex items-center gap-2 text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  SOC2 & ISO 27001 Certified
                </div>
             </div>
          </div>

          {/* Col 4: Image Block */}
          <div className="bg-[#050505] text-white p-8 lg:p-12 flex flex-col min-h-[600px] relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80')] bg-cover bg-center grayscale opacity-40 mix-blend-luminosity"></div>
             <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="text-5xl font-light text-gray-300 tracking-tight text-center mt-32">8yrs</div>
                <div>
                   <h3 className="text-2xl font-medium mb-6 leading-tight">
                     Deploy your first intelligent dataset in under thirty days.
                   </h3>
                   <button className="bg-white text-black text-[10px] font-bold font-mono px-6 py-4 flex items-center gap-2 hover:bg-gray-200 transition-colors uppercase tracking-widest">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                     Get started
                   </button>
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: Branching Data Structure (Node Editor) */}
      <section className="pt-32 pb-32 relative z-10">
        
        {/* Header Area - 4 Col Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 w-full mb-24">
           {/* Col 1: Empty Spacer */}
           <div className="hidden md:block"></div>
           {/* Col 2 & 3: Header Content */}
           <div className="md:col-span-2 p-8 lg:p-12">
               <div className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-4">FEATURES</div>
               <LetterReveal 
                 text={"Insights on\nsynthetic logic"}
                 className="text-5xl lg:text-[70px] font-medium tracking-tight leading-[1.05] mb-6"
               />
               <p className="text-gray-600 text-lg max-w-xl leading-relaxed">
                 Deep dives into data architecture, asynchronous processing, and the future of enterprise generation. Stay ahead of the neural curve.
               </p>
           </div>
        </div>

        {/* Content Area - 4 Col Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 w-full">
           
           {/* Col 1 & 2: Massive Left Column (Main Article) */}
           <div className="md:col-span-2 p-8 lg:p-12 flex flex-col group cursor-pointer relative min-h-[600px]">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`left-${activeArticle}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col p-8 lg:p-12"
                >
                  <div className="w-full h-[400px] md:h-[500px] mb-6 flex items-center justify-center overflow-hidden relative">
                     <div className="relative z-10 scale-[1.5]">
                        {bentoArticles[activeArticle].left.graphic}
                     </div>
                  </div>
                  <h3 className="text-3xl font-medium mb-4 leading-tight group-hover:underline decoration-2 underline-offset-4">
                    {bentoArticles[activeArticle].left.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {bentoArticles[activeArticle].left.desc}
                  </p>
                </motion.div>
              </AnimatePresence>
           </div>

           {/* Col 3: Middle Column (Stacked Cards) */}
           <div className="p-8 lg:p-12 flex flex-col gap-8 lg:gap-12 relative min-h-[600px]">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`mid-${activeArticle}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="absolute inset-0 flex flex-col gap-8 lg:gap-12 p-8 lg:p-12"
                >
                  <div className="group cursor-pointer">
                     <div className="w-full h-[200px] mb-6 flex items-center justify-center overflow-hidden relative">
                        <div className="scale-100 absolute">
                          {bentoArticles[activeArticle].midTop.graphic}
                        </div>
                     </div>
                     <h3 className="text-xl font-medium mb-2 group-hover:underline underline-offset-4">{bentoArticles[activeArticle].midTop.title}</h3>
                     <p className="text-sm text-gray-500">{bentoArticles[activeArticle].midTop.desc}</p>
                  </div>
                  
                  <div className="group cursor-pointer mt-auto lg:mt-0">
                     <div className="w-full h-[200px] mb-6 flex items-center justify-center overflow-hidden relative">
                        <div className="scale-100 absolute">
                           {bentoArticles[activeArticle].midBottom.graphic}
                        </div>
                     </div>
                     <h3 className="text-xl font-medium mb-2 group-hover:underline underline-offset-4">{bentoArticles[activeArticle].midBottom.title}</h3>
                     <p className="text-sm text-gray-500">{bentoArticles[activeArticle].midBottom.desc}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
           </div>

           {/* Col 4: Right Column (Text Links) */}
           <div className="p-8 lg:p-12 flex flex-col gap-12 pt-8 lg:pt-12">
              {bentoArticles.map((article, idx) => (
                 <div 
                   key={article.id}
                   onClick={() => setActiveArticle(idx)}
                   className={`group cursor-pointer transition-opacity duration-300 ${activeArticle === idx ? 'opacity-100' : 'opacity-40 hover:opacity-70'} ${idx !== bentoArticles.length - 1 ? 'border-b border-gray-300 pb-12' : ''}`}
                 >
                    <h3 className="text-2xl font-medium mb-6 leading-tight group-hover:underline underline-offset-4">
                      {article.title}
                    </h3>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">{article.tag}</span>
                      <span className="text-[10px] font-mono text-gray-400">{article.readTime}</span>
                    </div>
                 </div>
              ))}
           </div>

        </div>
      </section>

      {/* SECTION 3: Custom Node Canvas */}
      <section className="bg-[#050505] text-white relative overflow-hidden pt-32 pb-32">
         <div className="w-full grid grid-cols-1 md:grid-cols-4 relative z-10">
            
            <div className="hidden md:block"></div>

            <div className="md:col-span-3 flex flex-col p-8 lg:p-12 border-l border-[#333]">
               <div className="mb-24 flex items-start gap-4">
                  <div className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mt-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  </div>
                  <div>
                     <LetterReveal 
                       text={"Build logic at\nscale"}
                       className="text-5xl lg:text-[70px] font-medium tracking-tight mb-8 leading-[1.05]"
                     />
                     <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
                       Design, deploy, and manage sophisticated AI workflows through an intuitive visual interface. No complex coding—just pure logic mapped onto our high-performance edge network.
                     </p>
                  </div>
               </div>

               {/* Custom Interactive Node Editor UI */}
               <div className="w-full h-[600px] border border-[#333] bg-[#050505] rounded-xl overflow-hidden relative flex shadow-2xl font-mono">
               
               {/* Dot grid for canvas */}
               <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
               
               {/* Top Toolbar */}
               <div className="absolute top-0 left-48 right-0 h-14 border-b border-[#222] flex items-center px-6 justify-between bg-black/40 backdrop-blur-sm z-20">
                  <div className="flex gap-2">
                     <button className="px-3 py-1 border border-[#333] rounded text-xs hover:bg-[#111]">AGENT MODE</button>
                     <button className="px-3 py-1 border border-[#333] rounded text-xs hover:bg-[#111]">UNTITLED ✏️</button>
                  </div>
                  <div className="flex gap-2 items-center text-gray-500">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                     <div className="w-px h-4 bg-[#333] mx-2"></div>
                     <span className="text-xs">100%</span>
                  </div>
               </div>

               {/* Left Sidebar (Stack) */}
               <div className="w-48 border-r border-[#222] h-full bg-black/80 backdrop-blur-md z-20 flex flex-col p-4 relative">
                  <div className="w-full flex border border-[#333] rounded mb-8 overflow-hidden">
                     <button className="flex-1 py-2 bg-white text-black text-[10px] font-bold">AI AGENT</button>
                     <button className="flex-1 py-2 text-gray-500 text-[10px] font-bold hover:text-white">AI CHAT</button>
                  </div>
                  <div className="text-[10px] text-gray-500 mb-4">STACK</div>
                  <div className="grid grid-cols-2 gap-2">
                     <div className="aspect-square border border-[#333] rounded flex items-center justify-center hover:bg-[#111] cursor-pointer text-gray-400"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></div>
                     <div className="aspect-square border border-[#333] rounded flex items-center justify-center hover:bg-[#111] cursor-pointer text-gray-400"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div>
                     <div className="aspect-square border border-[#333] rounded flex items-center justify-center hover:bg-[#111] cursor-pointer text-gray-400"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg></div>
                     <div className="aspect-square border border-[#333] rounded flex items-center justify-center hover:bg-[#111] cursor-pointer text-gray-400"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
                  </div>
               </div>

               {/* Canvas Content - The actual nodes */}
               <div className="absolute inset-0 z-10 pointer-events-none">
                  
                  {/* Connection Lines (SVG) */}
                  <svg className="absolute inset-0 w-full h-full" style={{ filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.3))' }}>
                     <motion.path 
                        d="M 342 192 C 450 192, 450 160, 550 160" 
                        fill="none" 
                        stroke="#3b82f6" 
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                     />
                     <motion.path 
                        d="M 342 192 C 450 192, 450 302, 550 302" 
                        fill="none" 
                        stroke="#a855f7" 
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
                     />
                     <motion.path 
                        d="M 742 160 C 850 160, 850 212, 950 212" 
                        fill="none" 
                        stroke="#22c55e" 
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ duration: 1, ease: "easeInOut", delay: 0.4 }}
                     />
                  </svg>

                  {/* Node 1: Webhook Trigger */}
                  <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 0.4 }}
                     style={{ top: 160, left: 150, width: 192 }}
                     className="absolute bg-[#0a0a0a] border border-[#333] rounded-lg shadow-xl p-3 flex items-center gap-3 pointer-events-auto cursor-pointer hover:border-[#555]"
                  >
                     <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                     </div>
                     <div className="flex-1">
                        <div className="text-xs font-bold text-gray-200">Webhook</div>
                        <div className="text-[9px] text-gray-500">Listens for POST</div>
                     </div>
                     <div className="w-2 h-2 rounded-full bg-blue-500 absolute -right-1"></div>
                  </motion.div>

                  {/* Node 2: AI Agent */}
                  <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 0.4, delay: 0.2 }}
                     style={{ top: 110, left: 550, width: 192 }}
                     className="absolute bg-[#0a0a0a] border border-blue-500/50 rounded-lg shadow-xl p-3 pointer-events-auto cursor-pointer"
                  >
                     <div className="w-2 h-2 rounded-full bg-[#333] absolute -left-1 top-6"></div>
                     <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
                        </div>
                        <div>
                           <div className="text-xs font-bold text-gray-200">Classifier Agent</div>
                           <div className="text-[9px] text-gray-500">Gemini 1.5 Pro</div>
                        </div>
                     </div>
                     <div className="w-full bg-[#111] rounded p-2 text-[10px] text-gray-400 border border-[#222]">
                        Prompt: Analyze sentiment...
                     </div>
                     <div className="w-2 h-2 rounded-full bg-green-500 absolute -right-1 top-6"></div>
                  </motion.div>

                  {/* Node 3: Database Filter */}
                  <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 0.4, delay: 0.3 }}
                     style={{ top: 270, left: 550, width: 192 }}
                     className="absolute bg-[#0a0a0a] border border-[#333] rounded-lg shadow-xl p-3 flex items-center gap-3 pointer-events-auto cursor-pointer"
                  >
                     <div className="w-2 h-2 rounded-full bg-[#333] absolute -left-1"></div>
                     <div className="w-8 h-8 rounded bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                     </div>
                     <div className="flex-1">
                        <div className="text-xs font-bold text-gray-200">Format JSON</div>
                        <div className="text-[9px] text-gray-500">Transform schema</div>
                     </div>
                  </motion.div>

                  {/* Node 4: Database Insert */}
                  <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 0.4, delay: 0.5 }}
                     style={{ top: 180, left: 950, width: 192 }}
                     className="absolute bg-[#0a0a0a] border border-[#333] rounded-lg shadow-xl p-3 flex items-center gap-3 pointer-events-auto cursor-pointer"
                  >
                     <div className="w-2 h-2 rounded-full bg-[#333] absolute -left-1"></div>
                     <div className="w-8 h-8 rounded bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
                     </div>
                     <div className="flex-1">
                        <div className="text-xs font-bold text-gray-200">Postgres Insert</div>
                        <div className="text-[9px] text-gray-500">Table: user_logs</div>
                     </div>
                  </motion.div>

               </div>
            </div>

            </div> {/* Close md:col-span-3 */}

         </div>
      </section>

      

      {/* SECTION 2: Autonomy Tabs (Image 5) */}
      <section className="bg-[#050505] text-white">
         <div className="w-full">
            {/* Top Area - 4 Col Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4">
               {/* Left content spans 2 cols */}
               <div className="md:col-span-2 p-8 lg:p-16 border-b md:border-b-0 border-[#333]">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-6">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
                     PRODUCT FEATURES
                  </div>
                  <LetterReveal text={"Engineered for\nautonomy"} className="text-5xl lg:text-[70px] font-medium tracking-tight mb-8 leading-[1.05]" />
                  <p className="text-gray-400 text-lg max-w-md">
                     Go beyond simple chat interfaces. Armory provides the underlying architecture to build, test, and scale enterprise-grade agents.
                  </p>
               </div>
               {/* Empty cols to form the grid */}
               <div className="hidden md:block border-l border-[#333]"></div>
               <div className="hidden md:block border-l border-[#333]"></div>
            </div>

            {/* Tab Bar - 4 Col Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-[#333]">
               <button 
                  onClick={() => setActiveAutonomyTab('DISCOVERY')}
                  className={`py-6 text-[10px] font-mono tracking-widest uppercase transition-colors border-r border-[#333] flex items-center justify-center gap-3
                     ${activeAutonomyTab === 'DISCOVERY' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
               >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  DISCOVERY
               </button>
               <button 
                  onClick={() => setActiveAutonomyTab('ANALYSIS')}
                  className={`py-6 text-[10px] font-mono tracking-widest uppercase transition-colors border-r border-[#333] flex items-center justify-center gap-3
                     ${activeAutonomyTab === 'ANALYSIS' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
               >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  ANALYSIS
               </button>
               <button 
                  onClick={() => setActiveAutonomyTab('TRAINING')}
                  className={`py-6 text-[10px] font-mono tracking-widest uppercase transition-colors border-r border-[#333] flex items-center justify-center gap-3
                     ${activeAutonomyTab === 'TRAINING' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
               >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  TRAINING
               </button>
               <button 
                  onClick={() => setActiveAutonomyTab('DEPLOY')}
                  className={`py-6 text-[10px] font-mono tracking-widest uppercase transition-colors flex items-center justify-center gap-3
                     ${activeAutonomyTab === 'DEPLOY' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
               >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  DEPLOY
               </button>
            </div>

            {/* Split Screen Content - 4 Col Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 min-h-[500px]">
               {/* Left (Visual/Mockup) spans 2 cols */}
               <div className="md:col-span-2 border-b md:border-b-0 border-r border-[#333] bg-[#0a0a0a] relative overflow-hidden flex flex-col justify-center items-center">
                  {/* Background gradient & noise covering bottom half */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-[#050505]"></div>
                  <div className="absolute bottom-0 inset-x-0 h-1/2 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80')] bg-cover bg-top grayscale opacity-50 mix-blend-screen" style={{ maskImage: 'linear-gradient(to bottom, transparent, black)' }}></div>
                  
                  <AnimatePresence mode="wait">
                     <motion.div 
                        key={activeAutonomyTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full max-w-sm bg-[#050505] border border-[#222] rounded-lg shadow-2xl relative z-10 my-16"
                     >
                        {/* Mock Window Header */}
                        <div className="flex items-center gap-2 p-3 border-b border-[#222]">
                           <div className="w-2 h-2 rounded-full bg-[#444]"></div>
                           <div className="w-2 h-2 rounded-full bg-[#444]"></div>
                           <div className="w-2 h-2 rounded-full bg-[#444]"></div>
                           <div className="ml-auto text-[10px] text-[#444] font-mono"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
                        </div>
                        {/* Mock Window Body */}
                        <div className="p-6 h-48 flex flex-col justify-end">
                           <div className="w-full bg-[#111] border border-[#222] rounded-md p-3 flex justify-between items-center">
                              <span className="text-xs text-[#666]">Ask your AI anything...</span>
                              <div className="flex gap-2">
                                 <div className="w-6 h-6 rounded-full bg-[#222] flex items-center justify-center">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#666"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                 </div>
                                 <div className="w-6 h-6 rounded-full bg-[#222] flex items-center justify-center">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#666"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  </AnimatePresence>
               </div>

               {/* Right (Text Content) spans 2 cols */}
               <div className="md:col-span-2 p-8 lg:p-16 flex flex-col justify-between bg-[#050505]">
                  <AnimatePresence mode="wait">
                     <motion.p
                        key={activeAutonomyTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-2xl lg:text-3xl font-medium leading-relaxed max-w-lg mt-8"
                     >
                        {activeAutonomyTab === 'DISCOVERY' && "Map your entire organizational data structure instantly. Our agent crawls your repos to identify key schemas."}
                        {activeAutonomyTab === 'ANALYSIS' && "Identify bottlenecks in your current logic. We automatically flag unhandled edge cases and slow functions."}
                        {activeAutonomyTab === 'TRAINING' && "Fine-tune foundation models on your proprietary datasets without writing any complex orchestration code."}
                        {activeAutonomyTab === 'DEPLOY' && "Push your agents to production with a single click. Our secure edge infrastructure ensures sub-50ms latency globally."}
                     </motion.p>
                  </AnimatePresence>
                  
                  <div className="mt-16 text-[10px] text-gray-500 font-mono tracking-widest uppercase">
                     Deploy to any cloud provider or on-premise.
                     <div className="flex items-center gap-4 mt-4">
                        <div className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center">
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <button className="bg-white text-black px-5 py-2.5 font-bold rounded-full hover:bg-gray-200 transition-colors">GO LIVE NOW</button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* SECTION 2: Intelligence Grid (Image 1) */}
      <section className="bg-[#ebebeb] text-black relative z-10">
         <div className="w-full grid grid-cols-1 md:grid-cols-4 min-h-[600px]">
            {/* Left Col */}
            <div className="lg:col-span-2 border-b lg:border-b-0 lg:border-r border-black p-8 lg:p-16 flex flex-col justify-between">
               <div>
                  <h2 className="text-5xl lg:text-[70px] font-medium tracking-tight leading-[1.05] mb-8">
                     Building on<br />machine<br />intelligence
                  </h2>
                  <p className="text-gray-600 text-lg max-w-md mb-12">
                     We partner with bold teams to design, deploy, and scale AI systems that create real business value from day one.
                  </p>
               </div>
               
               <div className="grid grid-cols-2 gap-8 border-t border-black/20 pt-8 mt-12">
                  <div>
                     <div className="text-4xl lg:text-5xl font-light tracking-tight mb-2">3x</div>
                     <p className="text-sm text-gray-600">Average ROI delivered within the first year of engagement.</p>
                  </div>
                  <div className="flex items-end gap-2">
                     <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">SOC2</div>
                     <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">ISO</div>
                  </div>
               </div>
            </div>

            {/* Middle Col */}
            <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-black p-8 lg:p-16 flex flex-col justify-between">
               <div className="text-5xl lg:text-[70px] font-light tracking-tight mt-32">8yrs</div>
               <p className="text-sm text-gray-600 mt-12">
                  We cut time-to-value by combining proven AI stacks with deep domain expertise.
               </p>
            </div>

            {/* Right Col Image block */}
            <div className="lg:col-span-1 bg-[#050505] relative overflow-hidden flex flex-col justify-end p-8 min-h-[400px]">
               {/* Noisy/abstract background simulation */}
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80')] bg-cover bg-center grayscale contrast-150 opacity-40"></div>
               <div className="relative z-10">
                  <h3 className="text-white text-lg font-medium mb-4">Deploy your first intelligent system in under thirty days.</h3>
                  <button className="bg-white text-black text-sm font-bold px-6 py-3 hover:bg-gray-200 transition-colors">
                     Get started
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* SECTION 3: Built for the long term (Image 4) */}
      <section className="bg-[#ebebeb] text-black">
         <div className="w-full grid grid-cols-1 md:grid-cols-4 min-h-[700px]">
            {/* Left Dark Image */}
            <div className="md:col-span-2 bg-[#050505] relative overflow-hidden border-b md:border-b-0 md:border-r border-black min-h-[400px]">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80')] bg-cover bg-center grayscale contrast-125 opacity-70 mix-blend-luminosity"></div>
            </div>

            {/* Right Content */}
            <div className="md:col-span-2 flex flex-col">
               <div className="p-8 lg:p-16 border-b border-black">
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-6">
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
                     OUR APPROACH
                  </div>
                  <LetterReveal text={"Built for the\nlong term"} className="text-5xl lg:text-7xl font-medium tracking-tight mb-8 leading-tight" />
                  <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                     We don't just ship code; we architect neural ecosystems. Our approach combines rigorous testing with rapid deployment cycles.
                  </p>
               </div>
               
               {/* 2x2 Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 flex-1">
                  <div className="p-8 lg:p-12 border-b md:border-b-0 md:border-r border-black flex flex-col">
                     <div className="w-12 h-12 mb-8 text-black">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                     </div>
                     <h4 className="text-xl font-medium mb-4">Prime Logic</h4>
                     <p className="text-sm text-gray-600">We prioritize high-fidelity model alignment to ensure your agents deliver consistent results.</p>
                  </div>
                  <div className="p-8 lg:p-12 border-b md:border-b-0 border-black flex flex-col">
                     <div className="w-12 h-12 mb-8 text-black">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                     </div>
                     <h4 className="text-xl font-medium mb-4">Total Clarity</h4>
                     <p className="text-sm text-gray-600">Gain full observability into how your data is processed, indexed, and retrieved by your AI.</p>
                  </div>
               </div>
               <div className="grid grid-cols-1 border-t border-black">
                  <div className="p-8 lg:p-12 flex flex-col">
                     <div className="w-12 h-12 mb-8 text-black">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                     </div>
                     <h4 className="text-xl font-medium mb-4">Fast Cycles</h4>
                     <p className="text-sm text-gray-600 max-w-sm">Transition from prototype to production in weeks, not months, with our pre-built frameworks.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* SECTION 4: Trusted by Pioneers (Light Mode Grid) */}
      <section className="bg-[#ebebeb] text-black pt-24 pb-0 relative z-10">
         <div className="w-full border-t border-black grid grid-cols-1 md:grid-cols-4">
            
            {/* Top row with Title spanning 3 cols */}
            <div className="col-span-1 border-r border-black p-8 hidden lg:block bg-transparent"></div>
            <div className="col-span-3 p-8 lg:p-16 lg:pr-32 border-b border-black">
               <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-500 uppercase tracking-widest mb-6">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  TESTIMONIALS
               </div>
               <LetterReveal 
                 text={"Trusted by the\npioneers"}
                 className="text-6xl md:text-7xl lg:text-[90px] font-medium tracking-tight mb-8 leading-[1.05]"
               />
               <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                 From high-growth startups to enterprise research labs, Armory is the chosen infrastructure for teams building the next era of AI data.
               </p>
            </div>

            {/* Testimonial Grid Cards */}
            
            {/* Card 1 */}
            <div className="border-b lg:border-b-0 lg:border-r border-black p-6 md:p-8 flex h-[450px] relative bg-transparent hover:bg-black/5 transition-colors group">
               <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-end pb-8 items-center">
                  <span className="-rotate-90 text-[10px] font-mono text-gray-400 whitespace-nowrap mb-12 uppercase tracking-widest origin-bottom">Vertex Labs</span>
                  <div className="flex flex-row gap-1 mb-8 opacity-40">
                     <div className="w-px h-4 bg-black"></div><div className="w-px h-4 bg-black"></div><div className="w-px h-4 bg-black"></div><div className="w-px h-4 bg-black"></div>
                  </div>
               </div>
               <div className="pl-12 flex flex-col h-full w-full border-l border-black/10">
                  <div className="flex items-start gap-4 mb-8">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-black shrink-0"><path d="M12 2L2 22h20L12 2z"/></svg>
                     <h3 className="text-xl font-medium leading-snug">Infrastructure that finally scales</h3>
                  </div>
                  <div className="mt-auto">
                     <div className="text-[10px] font-mono font-bold text-gray-500 mb-2 tracking-widest uppercase">Rating</div>
                     <div className="flex gap-1 mb-6">
                       {[1,2,3,4,5].map(i => <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-black"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
                     </div>
                     <div className="text-[10px] font-mono font-bold text-gray-500 mb-2 tracking-widest uppercase">Comment</div>
                     <p className="text-sm text-gray-600 leading-relaxed">
                       "The reliability of Armory is unmatched. We've migrated our entire neural pipeline to their edge nodes with zero downtime for our users."
                     </p>
                  </div>
               </div>
            </div>

            {/* Card 2 */}
            <div className="border-b lg:border-b-0 lg:border-r border-black p-6 md:p-8 flex h-[450px] relative bg-transparent hover:bg-black/5 transition-colors group">
               <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-end pb-8 items-center">
                  <span className="-rotate-90 text-[10px] font-mono text-gray-400 whitespace-nowrap mb-12 uppercase tracking-widest origin-bottom">FlowState AI</span>
                  <div className="flex flex-row gap-1 mb-8 opacity-40">
                     <div className="w-px h-4 bg-black"></div><div className="w-px h-4 bg-black"></div><div className="w-px h-4 bg-black"></div><div className="w-px h-4 bg-black"></div>
                  </div>
               </div>
               <div className="pl-12 flex flex-col h-full w-full border-l border-black/10">
                  <div className="flex items-start gap-4 mb-8">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-black shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                     <h3 className="text-xl font-medium leading-snug">Saved us months of R&D</h3>
                  </div>
                  <div className="mt-auto">
                     <div className="text-[10px] font-mono font-bold text-gray-500 mb-2 tracking-widest uppercase">Rating</div>
                     <div className="flex gap-1 mb-6">
                       {[1,2,3,4,5].map(i => <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-black"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
                     </div>
                     <div className="text-[10px] font-mono font-bold text-gray-500 mb-2 tracking-widest uppercase">Comment</div>
                     <p className="text-sm text-gray-600 leading-relaxed">
                       "Instead of building our own agent logic from scratch, we used Armory. We went from a prototype to a global production launch in weeks."
                     </p>
                  </div>
               </div>
            </div>

            {/* Card 3 */}
            <div className="border-b lg:border-b-0 lg:border-r border-black p-6 md:p-8 flex h-[450px] relative bg-transparent hover:bg-black/5 transition-colors group">
               <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-end pb-8 items-center">
                  <span className="-rotate-90 text-[10px] font-mono text-gray-400 whitespace-nowrap mb-12 uppercase tracking-widest origin-bottom">Neural Sync</span>
                  <div className="flex flex-row gap-1 mb-8 opacity-40">
                     <div className="w-px h-4 bg-black"></div><div className="w-px h-4 bg-black"></div><div className="w-px h-4 bg-black"></div><div className="w-px h-4 bg-black"></div>
                  </div>
               </div>
               <div className="pl-12 flex flex-col h-full w-full border-l border-black/10">
                  <div className="flex items-start gap-4 mb-8">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-black shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                     <h3 className="text-xl font-medium leading-snug">Precision in every inference</h3>
                  </div>
                  <div className="mt-auto">
                     <div className="text-[10px] font-mono font-bold text-gray-500 mb-2 tracking-widest uppercase">Rating</div>
                     <div className="flex gap-1 mb-6">
                       {[1,2,3,4,5].map(i => <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-black"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
                     </div>
                     <div className="text-[10px] font-mono font-bold text-gray-500 mb-2 tracking-widest uppercase">Comment</div>
                     <p className="text-sm text-gray-600 leading-relaxed">
                       "The observability tools allow us to monitor agent accuracy in real-time. It has become a vital part of our model evaluation workflow."
                     </p>
                  </div>
               </div>
            </div>

            {/* Card 4 */}
            <div className="p-6 md:p-8 flex h-[450px] relative bg-transparent hover:bg-black/5 transition-colors group">
               <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-end pb-8 items-center">
                  <span className="-rotate-90 text-[10px] font-mono text-gray-400 whitespace-nowrap mb-12 uppercase tracking-widest origin-bottom">Sentinel Ops</span>
                  <div className="flex flex-row gap-1 mb-8 opacity-40">
                     <div className="w-px h-4 bg-black"></div><div className="w-px h-4 bg-black"></div><div className="w-px h-4 bg-black"></div><div className="w-px h-4 bg-black"></div>
                  </div>
               </div>
               <div className="pl-12 flex flex-col h-full w-full border-l border-black/10">
                  <div className="flex items-start gap-4 mb-8">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-black shrink-0"><path d="M2 12A10 10 0 0 0 15 21.54A10 10 0 0 1 15 2.46A10 10 0 0 0 2 12Z"/></svg>
                     <h3 className="text-xl font-medium leading-snug">Enterprise-grade by default</h3>
                  </div>
                  <div className="mt-auto">
                     <div className="text-[10px] font-mono font-bold text-gray-500 mb-2 tracking-widest uppercase">Rating</div>
                     <div className="flex gap-1 mb-6">
                       {[1,2,3,4,5].map(i => <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-black"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
                     </div>
                     <div className="text-[10px] font-mono font-bold text-gray-500 mb-2 tracking-widest uppercase">Comment</div>
                     <p className="text-sm text-gray-600 leading-relaxed">
                       "The node-based builder is a game changer for our team. Even our non-technical stakeholders can now help map out complex agent behaviors."
                     </p>
                  </div>
               </div>
            </div>

         </div>
      </section>

      <Footer />
    </div>
  );
}
