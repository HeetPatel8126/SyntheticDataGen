import React from 'react';

export default function Pricing() {
  return (
    <section className="bg-black text-white border-t border-black bg-grid-dark relative">
      <div className="max-w-[1440px] mx-auto border-x b-dark relative z-10">
        
        {/* Header */}
        <div className="p-12 md:p-16 border-b b-dark text-center flex flex-col items-center">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8 flex items-center gap-2">
              <span className="w-4 h-[2px] bg-gray-500"></span> PRICING
            </div>
            <h2 className="text-5xl font-medium tracking-tight mb-4">
              Simple, transparent scaling
            </h2>
            <p className="text-gray-400 max-w-lg text-sm">
              Start building for free. Scale to millions of requests with predictable, transparent pricing based purely on compute and memory used.
            </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          
          {/* Starter */}
          <div className="p-12 border-b md:border-b-0 border-r b-dark flex flex-col hover:bg-white/5 transition">
            <h3 className="text-2xl font-medium mb-2">Starter</h3>
            <p className="text-gray-500 text-sm mb-8">For individuals and small prototypes.</p>
            <div className="text-5xl font-medium tracking-tight mb-8">
              $0<span className="text-xl text-gray-500 font-normal">/mo</span>
            </div>
            <ul className="flex flex-col gap-4 text-sm text-gray-300 mb-12 flex-grow">
              <li className="flex gap-3"><span className="text-gray-600">✓</span> Up to 10k requests/mo</li>
              <li className="flex gap-3"><span className="text-gray-600">✓</span> 2 concurrent agents</li>
              <li className="flex gap-3"><span className="text-gray-600">✓</span> Community support</li>
            </ul>
            <button className="w-full py-4 border border-white/20 hover:bg-white hover:text-black transition font-medium text-sm">
              Deploy Free
            </button>
          </div>

          {/* Pro */}
          <div className="p-12 border-b md:border-b-0 border-r b-dark flex flex-col bg-white/5 relative">
            <div className="absolute top-0 right-0 bg-white text-black text-[10px] font-bold uppercase tracking-widest px-4 py-1">
              Most Popular
            </div>
            <h3 className="text-2xl font-medium mb-2">Professional</h3>
            <p className="text-gray-500 text-sm mb-8">For scaling startups and active workflows.</p>
            <div className="text-5xl font-medium tracking-tight mb-8">
              $49<span className="text-xl text-gray-500 font-normal">/mo</span>
            </div>
            <ul className="flex flex-col gap-4 text-sm text-gray-300 mb-12 flex-grow">
              <li className="flex gap-3"><span className="text-white">✓</span> Up to 500k requests/mo</li>
              <li className="flex gap-3"><span className="text-white">✓</span> Unlimited agents</li>
              <li className="flex gap-3"><span className="text-white">✓</span> Advanced observability</li>
              <li className="flex gap-3"><span className="text-white">✓</span> Priority email support</li>
            </ul>
            <button className="w-full py-4 bg-white text-black hover:bg-gray-200 transition font-medium text-sm">
              Start Free Trial
            </button>
          </div>

          {/* Enterprise */}
          <div className="p-12 flex flex-col hover:bg-white/5 transition relative overflow-hidden">
            <div className="absolute inset-0 stripe-pattern opacity-10"></div>
            <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-2xl font-medium mb-2">Enterprise</h3>
                <p className="text-gray-500 text-sm mb-8">For custom deployments and compliance.</p>
                <div className="text-5xl font-medium tracking-tight mb-8">
                  Custom
                </div>
                <ul className="flex flex-col gap-4 text-sm text-gray-300 mb-12 flex-grow">
                  <li className="flex gap-3"><span className="text-gray-600">✓</span> Unlimited requests</li>
                  <li className="flex gap-3"><span className="text-gray-600">✓</span> VPC / On-prem deployment</li>
                  <li className="flex gap-3"><span className="text-gray-600">✓</span> SOC2 & HIPAA BAAs</li>
                  <li className="flex gap-3"><span className="text-gray-600">✓</span> Dedicated success manager</li>
                </ul>
                <button className="w-full py-4 border border-white/20 hover:bg-white hover:text-black transition font-medium text-sm">
                  Contact Sales
                </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
