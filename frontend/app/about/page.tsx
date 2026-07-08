'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import About from '../../components/About';
import Mission from '../../components/Mission';
import Team from '../../components/Team';
import Footer from '../../components/Footer';

export default function AboutPage() {
  return (
    <div className="antialiased min-h-screen flex flex-col bg-[#ebebeb]">
      <section className="bg-black relative flex flex-col border-b border-black pt-8 pb-12">
        <div className="absolute top-0 left-0 w-full">
          <Navbar />
        </div>
        <div className="pt-24 px-12 md:px-16 text-center max-w-[1440px] mx-auto w-full text-white">
            <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-6">
              Building the standard for<br/>synthetic intelligence.
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our mission is to enable developers to build robust AI systems without compromising user privacy or waiting for production data.
            </p>
        </div>
      </section>

      <About />
      <Mission />
      <Team />
      <Footer />
    </div>
  );
}
