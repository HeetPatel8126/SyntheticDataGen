import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-black text-white overflow-hidden bg-grid-dark relative">
      {/* Background radial gradient overlay to soften the grid near edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_80%)]"></div>
      
      <div className="relative z-10 w-full">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b b-dark">
          {/* Logo Column */}
          <div className="col-span-12 md:col-span-3 p-12 border-r b-dark flex items-start justify-center">
             <svg width="60" height="60" viewBox="0 0 24 24" fill="white" className="-rotate-12">
               <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
             </svg>
          </div>
          
          {/* Email Subscription */}
          <div className="col-span-12 md:col-span-9 p-12 md:p-16">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8 flex items-center gap-2">
              <span className="w-4 h-[2px] bg-gray-500"></span> GET STARTED
            </div>
            <h2 className="text-5xl font-medium tracking-tight leading-[1.1] mb-6">
              Get smarter about<br/>AI systems
            </h2>
            <p className="text-gray-400 mb-12 text-sm">
              Weekly insights on automation, AI workflows, and real builds. No fluff, just what works.
            </p>
            
            <div className="flex max-w-md">
              <input 
                type="email" 
                placeholder="jane@framer.com" 
                className="bg-black/50 border border-[#333] text-white px-4 py-3 outline-none focus:border-white/50 transition flex-grow font-mono text-sm"
              />
              <button className="bg-black/80 border border-[#333] hover:bg-white hover:text-black transition flex items-center">
                 <div className="px-3 border-r border-white/10 opacity-50">&rsaquo;&rsaquo;</div>
                 <span className="px-4 py-3 text-sm font-medium">Subscribe</span>
              </button>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b b-dark">
          <div className="hidden md:block col-span-3 border-r b-dark"></div>
          
          <div className="col-span-4 md:col-span-3 p-12 border-r b-dark">
            <h4 className="text-xs font-mono text-gray-500 mb-6 uppercase">Quick Links</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-300">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/features" className="hover:text-white transition">Features</a></li>
              <li><a href="/integrations" className="hover:text-white transition">Integrations</a></li>
              <li><a href="/developers" className="hover:text-white transition">Developers</a></li>
              <li><a href="/dashboard" className="hover:text-white transition">Dashboard</a></li>
              <li><a href="/pricing" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">Articles</a></li>
            </ul>
          </div>
          
          <div className="col-span-4 md:col-span-3 p-12 border-r b-dark">
            <h4 className="text-xs font-mono text-gray-500 mb-6 uppercase">Company</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-300">
              <li><a href="/about" className="hover:text-white transition">About Us</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition">Book A Call</a></li>
              <li><a href="#" className="hover:text-white transition">More Templates</a></li>
            </ul>
          </div>
          
          <div className="col-span-4 md:col-span-3 p-12">
            <h4 className="text-xs font-mono text-gray-500 mb-6 uppercase">Policies</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-300 mb-12">
              <li><a href="/security" className="hover:text-white transition">Security & Trust</a></li>
              <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
            </ul>
            <div className="flex gap-2">
              <a href="#" className="w-8 h-8 rounded bg-black/50 flex items-center justify-center text-xs text-gray-400 hover:text-white hover:bg-black/80 transition">𝕏</a>
              <a href="#" className="w-8 h-8 rounded bg-black/50 flex items-center justify-center text-xs text-gray-400 hover:text-white hover:bg-black/80 transition">in</a>
              <a href="#" className="w-8 h-8 rounded bg-black/50 flex items-center justify-center text-xs text-gray-400 hover:text-white hover:bg-black/80 transition">yt</a>
              <a href="#" className="w-8 h-8 rounded bg-black/50 flex items-center justify-center text-xs text-gray-400 hover:text-white hover:bg-black/80 transition">ig</a>
            </div>
          </div>
        </div>

        {/* Giant Typography Section */}
        <div className="p-4 flex items-center justify-center bg-black overflow-hidden relative min-h-[300px]">
           <h1 
             className="absolute bottom-0 text-[28vw] md:text-[320px] font-black tracking-tighter leading-none text-white w-full text-center mix-blend-overlay opacity-90 select-none"
             style={{ bottom: '-0.15em' }}
           >
             armory
           </h1>
           <div className="absolute bottom-4 text-[10px] text-gray-600 font-mono text-center w-full">
             &copy; 2026 Armory AI. All rights reserved.
           </div>
        </div>

      </div>
    </footer>
  );
}
