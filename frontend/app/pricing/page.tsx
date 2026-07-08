'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Pricing from '../../components/Pricing';
import FAQ from '../../components/FAQ';

export default function PricingPage() {
  return (
    <div className="antialiased min-h-screen flex flex-col">
      {/* 1. DARK NAV & PRICING SECTION */}
      <section className="bg-black relative flex flex-col border-b border-black pt-8">
        <div className="absolute top-0 left-0 w-full">
          <Navbar />
        </div>
        <div className="pt-24">
          <Pricing />
        </div>
      </section>

      {/* 2. LIGHT FAQ SECTION */}
      <FAQ />

      {/* 3. DARK FOOTER */}
      <Footer />
    </div>
  );
}
