'use client';
import React, { useState, useEffect } from 'react';
import LetterReveal from './ui/LetterReveal';

const categories = ['Overview', 'Security', 'Protocols', 'Licensing'];

const faqData = [
  // Overview
  {
    id: 1,
    category: 'Overview',
    question: 'What is Synthetic Data Generation?',
    answer: 'Synthetic data generation creates completely artificial datasets that maintain the exact statistical properties and patterns of your original data, without containing any real personal information.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/></svg>
  },
  {
    id: 2,
    category: 'Overview',
    question: 'Is the generated data statistically identical?',
    answer: 'Yes, our engine mathematically preserves the underlying distribution, correlations, and statistical properties of your original schema.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/></svg>
  },
  // Security
  {
    id: 3,
    category: 'Security',
    question: 'Is the infrastructure SOC2 compliant?',
    answer: 'Yes, our entire infrastructure is SOC2 Type II certified. We undergo regular independent security audits to ensure your data remains entirely secure.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  },
  {
    id: 4,
    category: 'Security',
    question: 'Is there a risk of model memorization?',
    answer: 'No, we apply rigorous differential privacy mechanisms that mathematically prevent the generated dataset from leaking any individual source records.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
  },
  {
    id: 5,
    category: 'Security',
    question: 'Do you support HIPAA or GDPR standards?',
    answer: 'We provide HIPAA compliant Business Associate Agreements (BAAs) and offer data localization options to satisfy GDPR requirements for EU customers.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.5 19C19.985 19 22 17.067 22 14.685c0-2.148-1.597-3.957-3.666-4.264-.475-3.076-3.155-5.421-6.334-5.421-3.179 0-5.859 2.345-6.334 5.421C3.597 10.728 2 12.537 2 14.685 2 17.067 4.015 19 6.5 19h11z"/></svg>
  },
  // Protocols
  {
    id: 6,
    category: 'Protocols',
    question: 'Can it generate relational database structures?',
    answer: 'Yes, we guarantee perfect referential integrity across dozens of tables, preserving foreign keys and complex constraints automatically.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
  },
  {
    id: 7,
    category: 'Protocols',
    question: 'What database formats are supported?',
    answer: 'We support all major SQL databases (PostgreSQL, MySQL, SQL Server) and common NoSQL document stores via direct connectors.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/></svg>
  },
  // Licensing
  {
    id: 8,
    category: 'Licensing',
    question: 'Can I run the generator on my own private cloud?',
    answer: 'Enterprise customers can deploy the synthesis engine directly within their own AWS, GCP, or Azure environments using our secure Kubernetes helm charts.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  },
  {
    id: 9,
    category: 'Licensing',
    question: 'How is pricing calculated?',
    answer: 'Pricing is based on a compute-hour model or a fixed annual enterprise license with unlimited rows generated.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/></svg>
  }
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('Security');
  const [openId, setOpenId] = useState<number | null>(null);

  // Set default open FAQ when category changes
  useEffect(() => {
    const defaultFaq = faqData.find(f => f.category === activeCategory);
    if (defaultFaq) {
      setOpenId(defaultFaq.id);
    }
  }, [activeCategory]);

  const filteredFaqs = faqData.filter(f => f.category === activeCategory);

  return (
    <section className="bg-[#ebebeb] text-black border-t b-light">
      <div className="max-w-[1440px] mx-auto border-x b-light grid grid-cols-1 md:grid-cols-12 min-h-[800px]">
        
        {/* Left Column (Sticky info) */}
        <div className="col-span-12 md:col-span-6 border-r b-light p-12 md:p-16 flex flex-col relative">
          <div className="sticky top-16">
            <div className="text-xs font-bold uppercase tracking-widest text-black mb-8 flex items-center gap-2">
              <span className="w-4 h-[2px] bg-black"></span> FAQ
            </div>
            
            <LetterReveal 
              text={"Common\ninquiries"} 
              className="text-6xl font-medium tracking-tight leading-[1.1] mb-12" 
              scrollOffset={["start 0.75", "start 0.15"]}
            />
            
            <div className="mt-32 max-w-sm text-black leading-relaxed text-sm mb-8">
              Everything you need to know about generating, scaling, and securing your synthetic datasets. Can't find an answer?
            </div>
            <button className="flex items-center w-fit bg-black text-white font-medium text-sm group hover:opacity-80 transition">
              <div className="bg-white p-3 border-r border-white/10 text-black">
                &there4;
              </div>
              <span className="px-6 py-3">Contact Us</span>
            </button>
          </div>
        </div>

        {/* Right Column (Tabs & Accordion) */}
        <div className="col-span-12 md:col-span-6 bg-[#f5f5f5]">
          
          {/* Tabs */}
          <div className="flex border-b b-light text-sm text-black overflow-x-auto">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-1 py-6 px-4 whitespace-nowrap transition border-r last:border-r-0 ${
                  activeCategory === cat 
                    ? 'bg-black text-white font-medium border-black' 
                    : 'hover:bg-white/50 b-light'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="p-8 min-h-[500px]">
            {filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div key={faq.id} className="border-b b-light last:border-b-0 py-2">
                  <button 
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between py-4 text-left group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="text-black">{faq.icon}</div>
                      <span className="text-lg font-medium">{faq.question}</span>
                    </div>
                    <div className="text-black group-hover:text-black transition">
                      {isOpen ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
                      )}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="pl-12 pr-12 pb-6 text-black text-sm leading-relaxed animate-fade-in-down">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
