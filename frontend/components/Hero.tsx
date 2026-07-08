import React from 'react';

export default function Hero() {
  return (
    <div className="relative flex-grow flex items-center min-h-screen text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000" 
          alt="3D Data Grid" 
          className="w-full h-full object-cover opacity-30 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-[1440px] w-full mx-auto grid grid-cols-1 md:grid-cols-12 px-8 py-24 border-x b-dark h-full">
        
        {/* Left Content (8 cols) */}
        <div className="col-span-12 md:col-span-8 flex flex-col justify-center pr-8 md:pr-16 md:border-r b-dark">
          <h1 className="text-huge font-medium leading-[1.1] tracking-tight mb-6 mt-32">
            Generate<br/>Production-Ready<br/>Data
          </h1>
          <p className="text-gray-400 text-lg max-w-md mb-12 leading-relaxed">
            Create highly accurate, privacy-preserving synthetic datasets to train your ML models at infinite scale.
          </p>
          
          <button className="flex items-center w-fit bg-white text-black font-medium text-sm group hover:bg-gray-200 transition">
            <div className="bg-[#1a1a1a] p-3 border-r border-black/10 group-hover:bg-[#2a2a2a] transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <span className="px-6 py-3">Start Generating</span>
          </button>
        </div>

        {/* Right Navigation & Logos (4 cols) */}
        <div className="hidden md:flex col-span-4 flex-col justify-center pl-16">
          <nav className="flex flex-col gap-6 text-2xl font-medium tracking-tight mb-16">
            <a href="#" className="text-white hover:text-gray-300 transition">AI Strategy</a>
            <a href="#" className="text-white hover:text-gray-300 transition">Custom Agents</a>
            <a href="#" className="text-white hover:text-gray-300 transition">Process Automation</a>
            <a href="#" className="text-white hover:text-gray-300 transition">Data Intelligence</a>
          </nav>

          <div className="flex gap-8 opacity-60 grayscale items-center">
             <span className="font-bold text-xl">cy&deg;</span>
             <span className="font-bold text-lg border-l border-r border-white/20 px-4">United<br/><span className="text-xs">Healthcare</span></span>
             <span className="font-bold text-xl flex items-center gap-1"><span className="text-red-500">&hearts;</span> aetna&reg;</span>
          </div>
        </div>

      </div>
    </div>
  );
}
