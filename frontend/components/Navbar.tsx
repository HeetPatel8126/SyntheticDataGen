'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'next-view-transitions';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <>
      <nav className="relative z-50 grid grid-cols-4 w-full py-6 mix-blend-difference text-white">
        {/* Col 1: Logo */}
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight pl-8">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 22H22L12 2Z" fill="white" />
          </svg>
          Synth
        </div>
        
        {/* Col 2 & 3: Empty */}
        <div className="hidden md:block"></div>
        <div className="hidden md:block"></div>

        {/* Col 4: Hamburger Icon */}
        <div className="flex justify-end pr-8">
          <button 
            onClick={() => setIsOpen(true)}
            className="hover:opacity-70 transition p-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 8h16M4 16h16"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Fullscreen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-[#ebebeb]"
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 z-[110] text-black hover:opacity-50 transition p-2"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            {/* Left Side (Dark branding) */}
            <div className="hidden md:flex w-1/2 bg-black text-white p-16 flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-dark opacity-20"></div>
              
              <div className="relative z-10 flex items-center gap-2 font-bold text-2xl tracking-tight">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 22H22L12 2Z" fill="white" />
                </svg>
                armory
              </div>

              <div className="relative z-10">
                <div className="text-gray-500 font-mono text-sm mb-4">Armory 2026</div>
                <h2 className="text-5xl font-medium tracking-tight leading-tight max-w-md">
                  Seamlessly connect your custom data to GPT-4, Claude 3, and Perplexity.
                </h2>
                
                <div className="mt-24 text-xs font-mono text-gray-500 uppercase tracking-widest flex justify-between">
                  <span>2919 Manchaca Rd #102, Austin, TX 78704</span>
                  <span>Jul 6, 2026</span>
                </div>
              </div>
            </div>

            {/* Right Side (Links) */}
            <div className="w-full md:w-1/2 p-16 md:p-32 flex flex-col justify-center bg-[#ebebeb] text-black">
              <div className="grid grid-cols-2 gap-16">
                
                {/* Column 1 */}
                <div>
                  <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-12">Quick Links</div>
                  <ul className="flex flex-col gap-6 text-2xl font-medium">
                    <li><Link href="/" className="hover:opacity-50 transition flex items-center gap-2">Home <span className="text-lg">↗</span></Link></li>
                    <li><Link href="/features" className="hover:opacity-50 transition flex items-center gap-2">Features <span className="text-lg">↗</span></Link></li>
                    <li><Link href="/pricing" className="hover:opacity-50 transition flex items-center gap-2">Pricing <span className="text-lg">↗</span></Link></li>
                    <li><Link href="/about" className="hover:opacity-50 transition flex items-center gap-2">About <span className="text-lg">↗</span></Link></li>
                    <li><Link href="/developers" className="hover:opacity-50 transition flex items-center gap-2">Developers <span className="text-lg">↗</span></Link></li>
                    <li><Link href="/login" className="hover:opacity-50 transition flex items-center gap-2">Login <span className="text-lg">↗</span></Link></li>
                    <li><Link href="/signup" className="hover:opacity-50 transition flex items-center gap-2">Signup <span className="text-lg">↗</span></Link></li>
                    <li><Link href="/contact" className="hover:opacity-50 transition flex items-center gap-2">Contact Us <span className="text-lg">↗</span></Link></li>
                  </ul>
                </div>

                {/* Column 2 */}
                <div>
                  <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-12">Other Links</div>
                  <ul className="flex flex-col gap-6 text-xl text-gray-600">
                    <li><Link href="#" className="hover:text-black transition flex items-center gap-2">Terms & Conditions <span className="text-sm">↗</span></Link></li>
                    <li><Link href="#" className="hover:text-black transition flex items-center gap-2">Privacy Policies <span className="text-sm">↗</span></Link></li>
                    <li><Link href="#" className="hover:text-black transition flex items-center gap-2">Hire via Contra <span className="text-sm">↗</span></Link></li>
                    <li><Link href="#" className="hover:text-black transition flex items-center gap-2">Book A Call <span className="text-sm">↗</span></Link></li>
                  </ul>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
