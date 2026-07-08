import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import About from '../components/About';
import Mission from '../components/Mission';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="antialiased min-h-screen">
      
      {/* 1. DARK HERO SECTION */}
      <section className="bg-black relative flex flex-col border-b border-black">
        <Navbar />
        <Hero />
      </section>

      {/* 2. DARK INTEGRATE / FEATURES SECTION */}
      <Features />

      {/* 3. LIGHT ABOUT/STATS SECTION */}
      <About />

      {/* 4. LIGHT MISSION SECTION */}
      <Mission />

      {/* 5. LIGHT FAQ SECTION */}
      <FAQ />

      {/* 7. DARK FOOTER */}
      <Footer />
      
    </div>
  );
}
