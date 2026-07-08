import React from 'react';

export default function Testimonials() {
  return (
    <section className="bg-grid-light border-t b-light text-black">
      <div className="max-w-[1440px] mx-auto border-x b-light">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b b-light">
          <div className="col-span-12 md:col-span-4 p-12 border-r b-light bg-[#ebebeb]">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8 flex items-center gap-2">
              <span className="w-4 h-[2px] bg-gray-400"></span> TESTIMONIALS
            </div>
            <h2 className="text-5xl font-medium tracking-tight mb-8">
              Trusted by the pioneers
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              From high-growth startups to enterprise research labs, Armory is the chosen infrastructure for teams building the next era of AI.
            </p>
          </div>
          <div className="hidden md:block col-span-12 md:col-span-8"></div>
        </div>

        {/* Testimonial Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4">
          
          {/* Col 1 */}
          <div className="p-8 border-r b-light flex flex-col justify-between min-h-[400px]">
            <h3 className="text-2xl font-medium leading-tight">Infrastructure that finally scales</h3>
            <div className="mt-auto pt-12">
              <div className="text-xs text-gray-400 font-bold uppercase mb-2">Rating</div>
              <div className="text-black text-lg mb-6">★★★★★</div>
              <div className="text-xs text-gray-400 font-bold uppercase mb-2">Comment</div>
              <p className="text-sm text-gray-600 leading-relaxed">The reliability of Armory is unmatched. We've migrated our entire neural pipeline to their edge nodes with zero downtime for our users.</p>
            </div>
          </div>

          {/* Col 2 */}
          <div className="p-8 border-r b-light flex flex-col justify-between min-h-[400px]">
            <h3 className="text-2xl font-medium leading-tight">Saved us months of R&D</h3>
            <div className="mt-auto pt-12">
              <div className="text-xs text-gray-400 font-bold uppercase mb-2">Rating</div>
              <div className="text-black text-lg mb-6">★★★★★</div>
              <div className="text-xs text-gray-400 font-bold uppercase mb-2">Comment</div>
              <p className="text-sm text-gray-600 leading-relaxed">Instead of building our own agent logic from scratch, we used Armory. We went from a prototype to a global production launch in weeks.</p>
            </div>
          </div>

          {/* Col 3 */}
          <div className="p-8 border-r b-light flex flex-col justify-between min-h-[400px]">
            <h3 className="text-2xl font-medium leading-tight">Precision in every inference</h3>
            <div className="mt-auto pt-12">
              <div className="text-xs text-gray-400 font-bold uppercase mb-2">Rating</div>
              <div className="text-black text-lg mb-6">★★★★★</div>
              <div className="text-xs text-gray-400 font-bold uppercase mb-2">Comment</div>
              <p className="text-sm text-gray-600 leading-relaxed">The observability tools allow us to monitor agent accuracy in real-time. It has become a vital part of our model evaluation workflow.</p>
            </div>
          </div>

          {/* Col 4 */}
          <div className="p-8 flex flex-col justify-between min-h-[400px]">
            <h3 className="text-2xl font-medium leading-tight">Enterprise-grade by default</h3>
            <div className="mt-auto pt-12">
              <div className="text-xs text-gray-400 font-bold uppercase mb-2">Rating</div>
              <div className="text-black text-lg mb-6">★★★★★</div>
              <div className="text-xs text-gray-400 font-bold uppercase mb-2">Comment</div>
              <p className="text-sm text-gray-600 leading-relaxed">The node-based builder is a game changer for our team. Even our non-technical stakeholders can now help map out complex agent behaviors.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
