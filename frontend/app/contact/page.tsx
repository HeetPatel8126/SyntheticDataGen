'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Mock network request
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <div className="antialiased min-h-screen flex flex-col bg-[#ebebeb]">
      <div className="bg-black">
        <Navbar />
      </div>

      <div className="flex-grow flex items-center justify-center py-24 px-8 border-t border-black bg-grid-light">
        <div className="max-w-[1200px] w-full grid grid-cols-1 md:grid-cols-2 gap-0 border border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          
          {/* Left Side: Info */}
          <div className="p-12 md:p-16 border-b md:border-b-0 md:border-r border-black flex flex-col justify-between bg-black text-white">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8 flex items-center gap-2">
                <span className="w-4 h-[2px] bg-gray-500"></span> GET IN TOUCH
              </div>
              <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-6 leading-none">
                Let's build something.
              </h1>
              <p className="text-gray-400 text-lg mb-12">
                Need enterprise features, custom SLAs, or a dedicated instance? Our engineering team is ready to help you scale your synthetic data pipelines.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Email</h3>
                <p className="text-lg font-medium">enterprise@synthdata.com</p>
              </div>
              <div>
                <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Office</h3>
                <p className="text-lg font-medium">
                  2919 Manchaca Rd #102<br/>
                  Austin, TX 78704
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="p-12 md:p-16 bg-[#ebebeb]">
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h2 className="text-3xl font-medium">Message Received</h2>
                <p className="text-gray-600">We'll get back to you within 24 hours.</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-8 text-xs font-mono uppercase tracking-widest border-b border-black hover:text-gray-500 transition"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-8 h-full justify-center">
                
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-transparent border-b-2 border-black/20 focus:border-black py-3 outline-none transition rounded-none font-medium text-lg placeholder:text-gray-400"
                    placeholder="Jane Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase tracking-widest">Work Email</label>
                  <input 
                    type="email" 
                    required
                    className="w-full bg-transparent border-b-2 border-black/20 focus:border-black py-3 outline-none transition rounded-none font-medium text-lg placeholder:text-gray-400"
                    placeholder="jane@company.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase tracking-widest">Company Size</label>
                  <select className="w-full bg-transparent border-b-2 border-black/20 focus:border-black py-3 outline-none transition rounded-none font-medium text-lg text-black cursor-pointer appearance-none">
                    <option value="" disabled selected>Select an option</option>
                    <option value="1-50">1-50 employees</option>
                    <option value="51-250">51-250 employees</option>
                    <option value="251-1000">251-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase tracking-widest">How can we help?</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full bg-transparent border-b-2 border-black/20 focus:border-black py-3 outline-none transition rounded-none font-medium text-lg placeholder:text-gray-400 resize-none"
                    placeholder="Tell us about your data infrastructure needs..."
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className="w-full bg-black text-white py-4 font-mono text-sm uppercase tracking-widest font-bold hover:bg-gray-800 transition disabled:opacity-50 mt-4"
                >
                  {status === 'submitting' ? 'Sending...' : 'Submit Request'}
                </button>

              </form>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
