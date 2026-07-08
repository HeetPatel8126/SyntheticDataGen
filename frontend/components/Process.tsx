import React from 'react';

export default function Process() {
  return (
    <section className="bg-black text-white border-t border-black">
      <div className="max-w-[1440px] mx-auto border-x b-dark">
        
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b b-dark">
          <div className="col-span-12 p-12 md:p-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
             <div>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8 flex items-center gap-2">
                  <span className="w-4 h-[2px] bg-gray-500"></span> HOW IT WORKS
                </div>
                <h2 className="text-5xl font-medium tracking-tight">
                  Deploy in three steps
                </h2>
             </div>
             <p className="text-gray-400 max-w-sm text-sm">
               We handle the infrastructure, the security, and the scaling. You just connect your data and define your logic.
             </p>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          
          {/* Step 1 */}
          <div className="p-12 border-b md:border-b-0 border-r b-dark hover:bg-white/5 transition group">
            <div className="text-4xl font-mono text-gray-600 mb-8 opacity-50 group-hover:text-white group-hover:opacity-100 transition">01.</div>
            <h3 className="text-2xl font-medium mb-4">Connect Data</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Securely authenticate your internal databases, APIs, and vector stores using our zero-trust integration layer.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-12 border-b md:border-b-0 border-r b-dark hover:bg-white/5 transition group">
            <div className="text-4xl font-mono text-gray-600 mb-8 opacity-50 group-hover:text-white group-hover:opacity-100 transition">02.</div>
            <h3 className="text-2xl font-medium mb-4">Map Logic</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Use our visual node editor or our TypeScript SDK to define how the agent should reason, route, and execute tasks.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-12 hover:bg-white/5 transition group relative overflow-hidden">
             <div className="absolute inset-0 bg-grid-dark opacity-30 mix-blend-overlay"></div>
             <div className="relative z-10">
                <div className="text-4xl font-mono text-gray-600 mb-8 opacity-50 group-hover:text-white group-hover:opacity-100 transition">03.</div>
                <h3 className="text-2xl font-medium mb-4">Deploy to Edge</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Push your agent to our global edge network in seconds. Enjoy sub-50ms latency and automatic auto-scaling.
                </p>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
