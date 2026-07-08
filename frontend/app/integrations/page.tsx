"use client";

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LetterReveal from '../../components/ui/LetterReveal';
import { motion } from 'framer-motion';

const IntegrationNode = ({ icon, type, index }: { icon: React.ReactNode, type: 'start' | 'middle' | 'end', index: number }) => {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center my-16 bg-[#ebebeb] group">
      {/* Pulse effect */}
      <div className="absolute inset-0 rounded-full bg-black/5 group-hover:bg-black/10 transition-colors duration-500 scale-150"></div>
      {/* Node circle */}
      <div className="relative z-10 w-20 h-20 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
         {icon}
      </div>
    </div>
  );
};

const CompanyCard = ({ name, type, description, logoUrl }: { name: string, type: string, description: string, logoUrl: string }) => {
  return (
    <div className="relative w-80 h-[400px] flex-shrink-0 bg-white border border-gray-200 overflow-hidden group cursor-pointer">
      {/* Front */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 transition-transform duration-700 ease-in-out group-hover:-translate-y-full">
        <div className="w-24 h-24 flex items-center justify-center transition-all duration-300">
          <img src={logoUrl} alt={name} className="w-full h-full object-contain" />
        </div>
      </div>
      
      {/* Back (Revealed on hover) */}
      <div className="absolute inset-0 bg-black text-white p-8 flex flex-col items-start justify-between translate-y-full transition-transform duration-700 ease-in-out group-hover:translate-y-0">
         <div>
            <div className="w-12 h-12 mb-6 opacity-75 flex items-center justify-start filter brightness-0 invert">
               <img src={logoUrl} alt={name} className="w-full h-full object-contain" />
            </div>
            <h3 className="font-medium text-2xl tracking-tight mb-2 text-white">{name}</h3>
            <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-4">{type}</div>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
         </div>
         <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest hover:text-white text-gray-300">
            View Docs 
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
         </div>
      </div>
    </div>
  );
};

const companies = [
  { name: "PostgreSQL", type: "Database", description: "Two-way real-time sync with advanced vector capabilities.", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg" },
  { name: "Salesforce", type: "CRM", description: "Automate custom object updates and trigger workflows.", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" },
  { name: "Snowflake", type: "Data Warehouse", description: "Batch ingest massive datasets for secure model training.", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Snowflake_Logo.svg" },
  { name: "Stripe", type: "Payments", description: "Listen for payment events to trigger access provisioning.", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
  { name: "Slack", type: "Communication", description: "Deploy agentic bots to channels for interactive Q&A.", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" },
  { name: "AWS", type: "Infrastructure", description: "Native hooks into S3, Lambda, and DynamoDB.", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
];

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState('DEPLOY');

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
      
      {/* SECTION 0: Light "About Style" Hero */}
      <section className="bg-[#ebebeb] text-black pt-40 pb-24 relative z-10 border-b border-gray-300">
         <div className="w-full">
            {/* Top Text Area */}
            <div className="grid grid-cols-1 md:grid-cols-4 pb-16">
               <div className="hidden md:block"></div>
               <div className="md:col-span-2 px-8 lg:px-16 flex flex-col justify-center">
                  <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5 }}
                     className="flex items-center gap-2 text-[10px] font-bold font-mono text-gray-500 uppercase tracking-widest mb-8"
                  >
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 9h16M4 15h16" /></svg>
                     INTEGRATIONS
                  </motion.div>
                  <motion.h1 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5, delay: 0.1 }}
                     className="text-6xl md:text-[80px] lg:text-[90px] font-medium tracking-tight mb-8 leading-[1.05] text-black"
                  >
                     Connect your tech stack
                  </motion.h1>
                  <motion.p 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5, delay: 0.2 }}
                     className="text-gray-600 text-lg max-w-2xl leading-relaxed"
                  >
                     We design, build, and deploy AI systems that automate operations, improve decision-making, and drive measurable business outcomes through seamless integrations.
                  </motion.p>
               </div>
               <div className="hidden md:block"></div>
            </div>

            {/* Infinite Scroll Company Cards */}
            <div className="w-full overflow-hidden mb-16 relative">
               <motion.div 
                 className="flex w-max"
                 animate={{ x: ["0%", "-50%"] }} 
                 transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
               >
                  {[...companies, ...companies].map((company, i) => (
                     <div key={i} className={i !== 0 ? "-ml-[1px]" : ""}>
                        <CompanyCard {...company} />
                     </div>
                  ))}
               </motion.div>
            </div>
            {/* Bottom Text Area */}
            <div className="grid grid-cols-1 md:grid-cols-4 pb-16">
               <div className="hidden md:block"></div>
               <div className="md:col-span-2 px-8 lg:px-16 flex flex-col justify-center">
                  <div className="text-gray-600 text-base max-w-2xl leading-relaxed font-normal">
                     <LetterReveal text="Armory is an AI systems studio focused on turning complex workflows into intelligent, scalable automation. We work with teams that want more than experiments. They need reliable systems that connect with their tools, support their operations, and create clear business value." />
                  </div>
               </div>
               <div className="hidden md:block"></div>
            </div>

            {/* 4 Column Timeline Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 border-t border-gray-300 mt-24 relative overflow-hidden">
               {/* Horizontal Timeline Connector passing behind the nodes */}
               <div className="absolute top-[192px] lg:top-[208px] left-0 w-full h-[2px] bg-black z-0 hidden md:block opacity-20 -mt-[1px]"></div>
               
               {[
                  { 
                    num: "01", type: "start" as const, title: "Connect Sources", desc: "Bind any database, CRM, or external API directly into your environment.",
                    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
                  },
                  { 
                    num: "02", type: "middle" as const, title: "Process & Transform", desc: "Raw data is normalized and embedded for immediate agent consumption.",
                    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  },
                  { 
                    num: "03", type: "middle" as const, title: "Autonomous Actions", desc: "Custom agents trigger workflows seamlessly across your entire network.",
                    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>
                  },
                  { 
                    num: "04", type: "end" as const, title: "Output & Reporting", desc: "Real-time sync to your communication tools, dashboards, and client portals.",
                    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  }
               ].map((item, i) => (
                  <motion.div 
                     key={i} 
                     initial={{ opacity: 0, y: 40 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: "-100px" }}
                     transition={{ duration: 0.7, delay: i * 0.15 }}
                     className={`p-8 lg:p-12 relative z-10 ${i !== 3 ? 'md:border-r md:border-gray-300' : ''}`}
                  >
                     {/* Data particle (animating right to next node) */}
                     {i !== 3 && (
                        <motion.div 
                           className="absolute z-20 w-2 h-2 bg-black rounded-full top-[192px] lg:top-[208px] -mt-[4px] pointer-events-none hidden md:block"
                           initial={{ left: '50%', opacity: 1 }}
                           animate={{ left: '150%', opacity: [1, 1, 0] }}
                           transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: i * 0.5 }}
                        />
                     )}
                     <div className="font-mono text-xs text-gray-500 mb-4">// {item.num}</div>
                     <div className="flex justify-center">
                       <IntegrationNode icon={item.icon} type={item.type} index={i} />
                     </div>
                     <h3 className="font-mono font-bold text-sm mb-4 uppercase">{item.title}</h3>
                     <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* SECTION 1: Dark Hero & Tabs (Based on Image 1) */}
      <section className="bg-[#050505] text-white pt-0 relative z-10">
         <div className="w-full">
            {/* Top Area - Hero Text */}
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-[#333]">
               <div className="hidden md:block"></div>
               <div className="md:col-span-2 p-8 lg:p-16">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-6">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
                     PRODUCT FEATURES
                  </div>
                  <LetterReveal text={"Engineered for\nautonomy"} className="text-5xl lg:text-[70px] font-medium tracking-tight mb-8 leading-[1.05]" />
                  <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                     Go beyond simple chat interfaces. Armory provides the underlying architecture to build, test, and scale enterprise-grade agents.
                  </p>
               </div>
               <div className="hidden md:block"></div>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#333] font-mono text-[10px] uppercase tracking-widest">
               <button onClick={() => setActiveTab('DISCOVERY')} className={`p-4 border-r border-[#333] flex items-center justify-center gap-2 hover:bg-[#111] transition-colors ${activeTab === 'DISCOVERY' ? 'bg-[#ebebeb] text-black font-bold' : 'text-gray-400'}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  DISCOVERY
               </button>
               <button onClick={() => setActiveTab('ANALYSIS')} className={`p-4 border-r border-[#333] flex items-center justify-center gap-2 hover:bg-[#111] transition-colors ${activeTab === 'ANALYSIS' ? 'bg-[#ebebeb] text-black font-bold' : 'text-gray-400'}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
                  ANALYSIS
               </button>
               <button onClick={() => setActiveTab('TRAINING')} className={`p-4 border-r border-[#333] flex items-center justify-center gap-2 hover:bg-[#111] transition-colors ${activeTab === 'TRAINING' ? 'bg-[#ebebeb] text-black font-bold' : 'text-gray-400'}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  TRAINING
               </button>
               <button onClick={() => setActiveTab('DEPLOY')} className={`p-4 flex items-center justify-center gap-2 hover:bg-[#111] transition-colors ${activeTab === 'DEPLOY' ? 'bg-[#ebebeb] text-black font-bold' : 'text-gray-400'}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                  DEPLOY
               </button>
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 w-full">
               <div className="md:col-span-2 relative min-h-[400px] border-r border-[#333] flex items-center justify-center overflow-hidden bg-[#111]">
                  {/* Mockup for graphic */}
                  <div className="w-full h-full absolute inset-0 bg-gradient-to-t from-black via-transparent to-[#111] z-10" />
                  <div className="w-[80%] max-w-lg aspect-[1.5] border border-[#333] bg-black rounded-lg shadow-2xl relative z-20 overflow-hidden flex flex-col p-4">
                     <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-1.5">
                           <div className="w-2 h-2 rounded-full bg-white"></div>
                           <div className="w-2 h-2 rounded-full bg-white"></div>
                           <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-500"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                     </div>
                     <div className="flex-1 mt-auto flex flex-col justify-end">
                        <div className="flex items-center justify-between border border-[#333] bg-[#0a0a0a] rounded-full px-4 py-2">
                           <span className="text-xs text-gray-500 font-mono">Ask your AI anything...</span>
                           <div className="flex gap-2">
                              <div className="w-6 h-6 rounded-full border border-[#333] flex items-center justify-center">
                                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg>
                              </div>
                              <div className="px-3 h-6 rounded-full border border-[#333] flex items-center text-[9px] text-gray-300">
                                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="mr-1"><circle cx="12" cy="12" r="10"/></svg>
                                 Tools
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="md:col-span-2 flex flex-col justify-between p-8 lg:p-16 bg-[#050505]">
                  <p className="text-xl md:text-2xl text-gray-300 max-w-md leading-relaxed">
                     Push your agents to production with a single click. Our secure edge infrastructure ensures sub-50ms latency globally.
                  </p>
                  
                  <div className="mt-24 font-mono">
                     <div className="text-[10px] text-gray-500 mb-4">Deploy to any cloud provider or on-premise.</div>
                     <div className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded-full border border-[#333] flex items-center justify-center text-gray-500">
                           <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <button className="px-4 py-2 bg-white text-black text-xs font-bold rounded hover:bg-gray-200 transition-colors">GO LIVE NOW</button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* SECTION 2: Dark Features & Stats (Based on Image 2) */}
      <section className="bg-[#050505] text-white border-t border-[#333] relative z-10 pb-32">
         <div className="w-full">
            {/* 4 Feature Columns */}
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-[#333]">
               {/* Feature 1 */}
               <div className="p-8 lg:p-10 border-r border-[#333]">
                  <div className="mb-8 text-white">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <h3 className="font-mono text-lg mb-4">Secure Guard</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     We fortify your AI deployments with robust security protocols. Our team ensures every model adheres to strict data privacy standards.
                  </p>
               </div>
               
               {/* Feature 2 */}
               <div className="p-8 lg:p-10 border-r border-[#333]">
                  <div className="mb-8 text-white">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/></svg>
                  </div>
                  <h3 className="font-mono text-lg mb-4">Agent Build</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Tailored AI agents designed for your specific needs. We develop custom logic and workflows that integrate deeply with your existing tools.
                  </p>
               </div>

               {/* Feature 3 */}
               <div className="p-8 lg:p-10 border-r border-[#333]">
                  <div className="mb-8 text-white">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
                  </div>
                  <h3 className="font-mono text-lg mb-4">Cloud Scale</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Infrastructure optimization for high-traffic AI apps. We ensure your systems remain fast, responsive, and ready for any level of demand.
                  </p>
               </div>

               {/* Feature 4 */}
               <div className="p-8 lg:p-10">
                  <div className="mb-8 text-white">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/><polyline points="2 15.5 12 8.5 22 15.5"/><line x1="12" y1="2" x2="12" y2="8.5"/></svg>
                  </div>
                  <h3 className="font-mono text-lg mb-4">Data Mining</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Transform raw information into actionable intelligence. We build the pipelines and vector stores that power your organization's future.
                  </p>
               </div>
            </div>

            {/* Stats Header Area */}
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-[#333]">
               <div className="hidden md:block border-r border-[#333]"></div>
               <div className="md:col-span-2 p-8 lg:p-12 border-r border-[#333]">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-6">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
                     STATISTICS
                  </div>
                  <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-8 leading-[1.1] max-w-xl">
                     Quantifiable impact across every deployment. We measure success by the speed and scale of your neural ops.
                  </h2>
                  <button className="flex items-center gap-3 border border-[#333] rounded px-4 py-2 hover:bg-[#111] transition-colors group">
                     <div className="text-[10px] font-mono text-gray-500">:</div>
                     <span className="text-sm font-medium group-hover:text-white text-gray-300">View Report</span>
                  </button>
               </div>
               <div className="hidden md:block"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-[#333]">
               <div className="hidden md:block border-r border-[#333]"></div>
               <div className="p-8 lg:p-12 border-r border-[#333] relative">
                  <div className="text-6xl md:text-[80px] font-medium tracking-tighter mb-4 leading-none">12ms</div>
                  <p className="text-gray-400 text-sm max-w-[150px] font-mono">Average latency for real-time inference.</p>
                  {/* Decorative Corner marker */}
                  <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-[#333]"></div>
               </div>
               <div className="p-8 lg:p-12 border-r border-[#333] relative">
                  <div className="text-6xl md:text-[80px] font-medium tracking-tighter mb-4 leading-none">10x</div>
                  <p className="text-gray-400 text-sm max-w-[150px] font-mono">Increase in manual task processing speed.</p>
                  <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-[#333]"></div>
               </div>
               <div className="p-8 lg:p-12 relative">
                  <div className="text-6xl md:text-[80px] font-medium tracking-tighter mb-4 leading-none">99%</div>
                  <p className="text-gray-400 text-sm max-w-[150px] font-mono">Uptime for critical neural infrastructure.</p>
                  <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-[#333]"></div>
               </div>
            </div>
         </div>
      </section>

      {/* SECTION 3: Light Intelligence & ROI (Based on Image 3) */}
      <section className="bg-[#ebebeb] text-black relative z-10 pt-32">
         <div className="w-full">
            {/* Header Area */}
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-[#ddd]">
               <div className="hidden md:block border-r border-[#ddd]"></div>
               <div className="md:col-span-2 p-8 lg:p-16 border-r border-[#ddd]">
                  <LetterReveal text={"Building on\nmachine\nintelligence"} className="text-5xl lg:text-[70px] font-medium tracking-tight mb-8 leading-[1.05]" />
                  <p className="text-gray-600 text-lg max-w-md leading-relaxed">
                     We partner with bold teams to design, deploy, and scale AI systems that create real business value from day one.
                  </p>
               </div>
               <div className="hidden md:block"></div>
            </div>

            {/* Bento Grid Area */}
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-[#ddd]">
               {/* Col 1: Avatars & Text */}
               <div className="p-8 lg:p-12 border-r border-[#ddd] flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-12">
                     <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gray-300 border border-white"></div>
                        <div className="w-6 h-6 rounded-full bg-gray-400 border border-white"></div>
                        <div className="w-6 h-6 rounded-full bg-gray-500 border border-white"></div>
                        <div className="w-6 h-6 rounded-full bg-gray-600 border border-white"></div>
                     </div>
                     <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 ml-2">Global Clients</span>
                  </div>
                  <h3 className="text-xl font-medium mb-4 max-w-[200px]">Trusted by startups and enterprises across four continents.</h3>
               </div>

               {/* Col 2: 3x ROI */}
               <div className="p-8 lg:p-12 border-r border-[#ddd] flex flex-col justify-end">
                  <div className="text-5xl md:text-[60px] font-medium tracking-tighter mb-4 leading-none">3x</div>
                  <p className="text-gray-500 text-sm max-w-[200px]">Average ROI delivered within the first year of engagement.</p>
               </div>

               {/* Col 3: 8yrs */}
               <div className="p-8 lg:p-12 border-r border-[#ddd] flex flex-col justify-between">
                  <div className="text-6xl md:text-[80px] font-medium tracking-tighter mb-4 leading-none mt-12">8yrs</div>
                  <div>
                     <p className="text-gray-600 text-sm max-w-[200px] mb-8 font-medium">We cut time-to-value by combining proven AI stacks with deep domain expertise.</p>
                     <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
                        12 Core AI Frameworks
                     </div>
                  </div>
               </div>

               {/* Col 4: Dark Graphic */}
               <div className="bg-[#050505] text-white p-8 lg:p-12 flex flex-col justify-end relative overflow-hidden min-h-[400px]">
                  {/* Decorative curved graphic mockup */}
                  <div className="absolute top-1/4 left-0 w-full h-[150%] bg-[#111] rounded-[50%] border-t border-[#333]"></div>
                  <div className="relative z-10">
                     <h4 className="text-lg font-medium mb-6">Deploy your first intelligent system in under thirty days.</h4>
                     <button className="flex items-center gap-3 bg-white text-black rounded px-4 py-3 hover:bg-gray-200 transition-colors">
                        <div className="w-4 h-4 border border-black"></div>
                        <span className="text-sm font-bold">Get started</span>
                     </button>
                  </div>
               </div>
            </div>

            {/* Footer Text & Badges */}
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-[#ddd]">
               <div className="md:col-span-2 p-8 lg:p-12 border-r border-[#ddd] flex flex-col justify-between">
                  <p className="text-gray-600 text-sm leading-relaxed max-w-xl mb-12">
                     We've spent eight years at the frontier of applied AI — building recommendation engines, intelligent automation, and decision systems for clients across fintech, health, and logistics. Our approach is rigorous and outcome-driven: no hype, no black boxes, just systems that perform. Every engagement starts with a deep audit of your data and workflows, so we build what actually moves the needle.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                     <div className="w-12 h-12 rounded-full bg-[#050505] flex items-center justify-center text-white text-[8px] font-bold">irap</div>
                     <div className="w-12 h-12 rounded-full bg-[#050505] flex items-center justify-center text-white text-[8px] font-bold flex-col leading-tight"><span className="text-[10px]">ISO</span>27001</div>
                     <div className="w-12 h-12 rounded-full bg-[#050505] flex items-center justify-center text-white text-[8px] font-bold flex-col leading-tight"><span className="text-[10px]">ISO</span>42001</div>
                     <div className="w-12 h-12 rounded-full bg-[#050505] flex items-center justify-center text-white text-[8px] font-bold flex-col leading-tight">SOC2<br/><span className="text-[6px] font-normal">TYPE 2</span></div>
                  </div>
               </div>
               <div className="hidden md:block border-r border-[#ddd]"></div>
               <div className="hidden md:block"></div>
            </div>
         </div>
      </section>

      {/* SECTION 4: Light Articles/Insights (Based on Image 4) */}
      <section className="bg-[#ebebeb] text-black relative z-10 pt-32">
         <div className="w-full">
            {/* Header Area */}
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-[#ddd]">
               <div className="hidden md:block border-r border-[#ddd]"></div>
               <div className="md:col-span-2 p-8 lg:p-16 border-r border-[#ddd]">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-6">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
                     ARTICLES
                  </div>
                  <LetterReveal text={"Insights on neural\nlogic"} className="text-5xl lg:text-[70px] font-medium tracking-tight mb-8 leading-[1.05]" />
                  <p className="text-gray-600 text-lg max-w-md leading-relaxed">
                     Deep dives into AI architecture, agent automation, and the future of enterprise intelligence. Stay ahead of the neural curve.
                  </p>
               </div>
               <div className="hidden md:block"></div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-[#ddd]">
               {/* Main Article (Spans 2 cols) */}
               <div className="md:col-span-2 border-r border-[#ddd] p-4 lg:p-8">
                  <div className="bg-[#050505] text-white aspect-[1.2] flex flex-col justify-end p-8 relative overflow-hidden group cursor-pointer">
                     {/* Mock Image Gradient */}
                     <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 via-purple-900 to-black opacity-60 transition-transform duration-700 group-hover:scale-105"></div>
                     <div className="absolute inset-0 mix-blend-overlay opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                     
                     <div className="relative z-10">
                        <h3 className="text-2xl md:text-3xl font-medium mb-8 max-w-sm">What It Takes to Turn AI Into a Business Asset</h3>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-gray-300">
                           <div className="mb-1">APR 29, 2026</div>
                           <div>2 MINS READ</div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right Side Articles */}
               <div className="md:col-span-2 grid grid-rows-2">
                  {/* Small Article 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[#ddd]">
                     <div className="p-4 lg:p-8 border-r border-[#ddd]">
                        <div className="bg-[#111] w-full h-full min-h-[160px] relative overflow-hidden group cursor-pointer">
                           <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black transition-transform duration-700 group-hover:scale-105"></div>
                        </div>
                     </div>
                     <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <h3 className="text-xl font-medium mb-12 hover:underline cursor-pointer">Why Your AI Outputs Feel Inconsistent</h3>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                           <div className="mb-1">APR 29, 2026</div>
                           <div>3 MINS READ</div>
                        </div>
                     </div>
                  </div>

                  {/* Small Article 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2">
                     <div className="p-4 lg:p-8 border-r border-[#ddd]">
                        <div className="bg-[#111] w-full h-full min-h-[160px] relative overflow-hidden group cursor-pointer">
                           <div className="absolute inset-0 bg-gradient-to-bl from-gray-700 to-black transition-transform duration-700 group-hover:scale-105"></div>
                        </div>
                     </div>
                     <div className="p-8 lg:p-12 flex flex-col justify-between">
                        <h3 className="text-xl font-medium hover:underline cursor-pointer">From Prompting to Systems: The Real Shift in AI</h3>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mt-12">
                           <div className="mb-1">APR 29, 2026</div>
                           <div>2 MINS READ</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Bottom articles banner */}
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-[#ddd]">
               <div className="hidden md:col-span-2 md:block border-r border-[#ddd]"></div>
               <div className="md:col-span-2 p-8 lg:p-12 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-gray-500">Access all our articles in one place.</span>
                  <button className="flex items-center gap-3 border border-[#333] rounded px-4 py-2 hover:bg-white transition-colors group">
                     <div className="text-[10px] font-mono text-gray-400 group-hover:text-black">↘</div>
                     <span className="text-sm font-medium group-hover:text-black">View Articles</span>
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* SECTION 5: Light "Built for the long term" (Based on Image 5) */}
      <section className="bg-[#ebebeb] text-black relative z-10">
         <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-4 min-h-[800px]">
               {/* Left Side Massive Graphic (2 Cols) */}
               <div className="md:col-span-2 border-r border-[#ddd] bg-[#050505] relative overflow-hidden">
                  {/* Mocking the ASCII Eye Graphic */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-40 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at center, #333 1px, transparent 1px)', backgroundSize: '6px 6px' }}>
                     <div className="w-64 h-32 rounded-full border border-[#555] flex items-center justify-center" style={{ transform: 'rotate(-5deg)' }}>
                        <div className="w-24 h-24 rounded-full border border-[#888] flex items-center justify-center">
                           <div className="w-8 h-8 rounded-full bg-white shadow-[0_0_20px_white]"></div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right Side Content (2 Cols) */}
               <div className="md:col-span-2 flex flex-col">
                  {/* Header */}
                  <div className="p-8 lg:p-16 border-b border-[#ddd]">
                     <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-6">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
                        OUR APPROACH
                     </div>
                     <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8 leading-[1.1]">
                        Built for the long<br/>term
                     </h2>
                     <p className="text-gray-600 text-sm max-w-md leading-relaxed">
                        We don't just ship code; we architect neural ecosystems. Our approach combines rigorous testing with rapid deployment cycles.
                     </p>
                  </div>

                  {/* 2x2 Grid */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
                     <div className="p-8 lg:p-12 border-r border-b md:border-b-0 border-[#ddd]">
                        <div className="mb-6">
                           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <h3 className="font-mono text-base mb-4 font-bold">Prime Logic</h3>
                        <p className="text-gray-500 text-xs leading-relaxed">
                           We prioritize high-fidelity model alignment to ensure your agents deliver consistent results.
                        </p>
                     </div>
                     <div className="p-8 lg:p-12 border-b md:border-b-0 border-[#ddd]">
                        <div className="mb-6">
                           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </div>
                        <h3 className="font-mono text-base mb-4 font-bold">Total Clarity</h3>
                        <p className="text-gray-500 text-xs leading-relaxed">
                           Gain full observability into how your data is processed, indexed, and retrieved by your AI.
                        </p>
                     </div>
                     <div className="p-8 lg:p-12 border-r border-[#ddd]">
                        <div className="mb-6">
                           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                        </div>
                        <h3 className="font-mono text-base mb-4 font-bold">Fast Cycles</h3>
                        <p className="text-gray-500 text-xs leading-relaxed">
                           Transition from prototype to production in weeks, not months, with our pre-built frameworks.
                        </p>
                     </div>
                     <div className="p-8 lg:p-12">
                        {/* Empty/Placeholder for future */}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
}
