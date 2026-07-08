import React from 'react';

export default function CaseStudies() {
  return (
    <section className="bg-grid-light text-black">
      <div className="max-w-[1440px] mx-auto border-x b-light">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b b-light">
          {/* Title area spanning 4 cols */}
          <div className="col-span-12 md:col-span-4 p-12 border-r b-light">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8 flex items-center gap-2">
              <span className="w-4 h-[2px] bg-gray-400"></span> CASE STUDIES
            </div>
            <h2 className="text-5xl font-medium tracking-tight mb-8">
              Proven neural solutions
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We partner with industry leaders to deploy bespoke AI agents that solve complex operational hurdles and drive measurable growth.
            </p>
          </div>
          
          {/* Empty/Decorative space spanning 8 cols to avoid wide layouts */}
          <div className="hidden md:block col-span-12 md:col-span-8 p-12">
            {/* Intentional negative space */}
          </div>
        </div>

        {/* Case Study Rows */}
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b b-light hover:bg-black/5 transition cursor-pointer group">
          <div className="col-span-12 md:col-span-3 p-8 flex items-center justify-center border-r b-light bg-gray-200 overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-105 transition duration-700" alt="Cigna" />
            <div className="font-bold text-2xl relative z-10 text-white mix-blend-difference">cigna</div>
          </div>
          <div className="col-span-12 md:col-span-2 p-8 border-r b-light text-sm text-gray-400 font-mono flex items-center">
            // 2026
          </div>
          <div className="col-span-12 md:col-span-6 p-8 flex flex-col justify-center">
            <h3 className="text-2xl font-medium mb-4">Cigna Smart Health Systems</h3>
            <p className="text-sm text-gray-600 max-w-md font-mono leading-relaxed">
              Revolutionizing patient care through predictive analytics and seamless AI-driven diagnostic integration tools.
            </p>
          </div>
          <div className="col-span-12 md:col-span-1 p-8 flex items-center justify-center text-xl text-gray-400 group-hover:text-black transition">
            &raquo;
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b b-light hover:bg-black/5 transition cursor-pointer group">
          <div className="col-span-12 md:col-span-3 p-8 flex items-center justify-center border-r b-light bg-white">
            <div className="font-black text-2xl tracking-tighter flex items-center gap-1">
              <span className="text-red-500 text-3xl">&hearts;</span> aetna
            </div>
          </div>
          <div className="col-span-12 md:col-span-2 p-8 border-r b-light text-sm text-gray-400 font-mono flex items-center">
            // 2026
          </div>
          <div className="col-span-12 md:col-span-6 p-8 flex flex-col justify-center">
            <h3 className="text-2xl font-medium mb-4">Aetna Health Data Ecosystem</h3>
            <p className="text-sm text-gray-600 max-w-md font-mono leading-relaxed">
              We automated Aetna's member data management using secure AI to provide personalized care and clinical insights.
            </p>
          </div>
          <div className="col-span-12 md:col-span-1 p-8 flex items-center justify-center text-xl text-gray-400 group-hover:text-black transition">
            &raquo;
          </div>
        </div>
      </div>
    </section>
  );
}
