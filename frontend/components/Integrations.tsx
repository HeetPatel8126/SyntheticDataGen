import React from 'react';

export default function Integrations() {
  return (
    <section className="bg-[#f5f5f5] text-black border-t b-light">
      <div className="max-w-[1440px] mx-auto border-x b-light">
        <div className="grid grid-cols-1 md:grid-cols-12">
          
          <div className="col-span-12 md:col-span-4 p-12 border-r b-light flex flex-col justify-center">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
              <span className="w-4 h-[2px] bg-gray-400"></span> INTEGRATIONS
            </div>
            <h3 className="text-2xl font-medium">Connects with your entire stack</h3>
          </div>
          
          <div className="col-span-12 md:col-span-8 p-12 flex flex-wrap gap-12 items-center opacity-60">
             {/* Text-based logos for simplicity and speed */}
             <div className="font-bold text-xl tracking-tighter flex items-center gap-1">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/><path d="M2 12h20"/></svg>
               OpenAI
             </div>
             <div className="font-bold text-xl tracking-tighter flex items-center gap-1">
                <span className="text-purple-600 font-serif italic text-2xl pr-1">A</span>nthropic
             </div>
             <div className="font-bold text-xl tracking-widest uppercase flex items-center gap-1">
               AWS
             </div>
             <div className="font-bold text-xl tracking-tighter flex items-center gap-1">
               <span className="text-purple-600 text-2xl font-black">D</span>datadog
             </div>
             <div className="font-bold text-xl tracking-tighter flex items-center gap-1">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
               Supabase
             </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
