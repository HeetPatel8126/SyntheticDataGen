import React from 'react';
import RevealHeading from './ui/RevealHeading';
import LetterReveal from './ui/LetterReveal';

export default function Team() {
  return (
    <section className="bg-[#ebebeb] text-black border-t border-b b-light relative">
      <div className="max-w-[1440px] mx-auto border-x b-light relative z-10">
        
        {/* ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-4 border-b b-light">
          {/* Left Text Block (Spans 2 cols) */}
          <div className="col-span-1 md:col-span-2 p-12 md:p-16 border-r b-light flex flex-col justify-center min-h-[400px] md:min-h-[600px] lg:min-h-[700px]">
            <RevealHeading className="text-xs font-bold uppercase tracking-widest text-black mb-8 flex items-center gap-2 font-mono">
              <span className="w-4 h-[2px] bg-black"></span> OUR TEAM
            </RevealHeading>
            <LetterReveal 
              text={"Architects of\nsynthetic data"} 
              className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8" 
            />
            <p className="text-black text-lg md:text-xl leading-relaxed max-w-md">
              We're a tight-knit crew of ML researchers, privacy experts, and distributed systems engineers obsessed with building generators that actually work.
            </p>
          </div>

          {/* Blue Portrait */}
          <div className="col-span-1 border-r b-light overflow-hidden h-[400px] md:h-auto relative">
            <img src="/team_blue.png" alt="Team Member" className="absolute inset-0 w-full h-full object-cover object-center" />
          </div>

          {/* Pink Portrait */}
          <div className="col-span-1 overflow-hidden h-[400px] md:h-auto relative">
            <img src="/team_pink.png" alt="Team Member" className="absolute inset-0 w-full h-full object-cover object-center" />
          </div>
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 md:grid-cols-4">
          {/* Teal Portrait */}
          <div className="col-span-1 border-r b-light overflow-hidden h-[400px] md:h-auto relative min-h-[400px] md:min-h-[600px] lg:min-h-[700px]">
            <img src="/team_teal.png" alt="Team Member" className="absolute inset-0 w-full h-full object-cover object-center" />
          </div>

          {/* Orange Portrait */}
          <div className="col-span-1 border-r b-light overflow-hidden h-[400px] md:h-auto relative">
            <img src="/team_orange.png" alt="Team Member" className="absolute inset-0 w-full h-full object-cover object-center" />
          </div>

          {/* Right Text Block (Spans 2 cols) */}
          <div className="col-span-1 md:col-span-2 p-12 md:p-16 flex flex-col justify-center items-start h-[400px] md:h-auto">
            <p className="text-black text-lg md:text-xl leading-relaxed max-w-md mb-12">
              We hire curious builders who move fast and think deep. If that sounds like you, we'd love to hear from you.
            </p>
            <button className="flex items-center group cursor-pointer hover:opacity-80 transition-opacity">
              <div className="bg-transparent border border-black w-16 h-16 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <div className="bg-black text-white px-8 h-16 flex items-center font-medium text-sm tracking-wide">
                Apply Now
              </div>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
