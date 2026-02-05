'use client'

import Link from "next/link"
import { motion, useScroll, useTransform, useMotionValue, AnimatePresence } from "framer-motion"
import { 
  ArrowRight, 
  Zap, 
  Database, 
  Download, 
  Shield, 
  Code, 
  BarChart,
  Sparkles,
  Check,
  Play,
  Globe,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef, useState, useEffect, useCallback } from "react"
import { 
  FadeInWhenVisible, 
  SpotlightCard 
} from "@/components/animations"
import { WordRotator, CountingText } from "@/components/animations/TypewriterText"
import { FloatingParticles } from "@/components/animations/FloatingElement"
import { ScrollProgress, MouseScrollIndicator } from "@/components/animations/ScrollProgress"
import { MeshGradient, NoiseOverlay, GridPattern } from "@/components/animations/AnimatedGradient"
import { TiltCard } from "@/components/animations/GlowingCard"
import { cn } from "@/lib/utils"

// ============================================
// ANIMATED HEADER / NAVBAR
// ============================================

function AnimatedHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled 
            ? "bg-black/80 backdrop-blur-xl border-b border-white/10 py-3" 
            : "bg-transparent py-5"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <Database className="w-8 h-8 text-purple-500" />
            </motion.div>
            <span className="text-xl font-heading font-bold">SynthData</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'Docs', 'Blog'].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Link 
                  href={`#${item.toLowerCase()}`}
                  className="text-sm text-gray-400 hover:text-white transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full" />
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  Sign In
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/dashboard">
                <Button variant="gradient" size="sm" className="btn-shine">
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>
      <ScrollProgress />
    </>
  )
}

// ============================================
// HERO SECTION
// ============================================

function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    }
  }, [mouseX, mouseY])

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        <MeshGradient />
        <GridPattern animate className="opacity-30" />
        <NoiseOverlay opacity={0.02} />
        <FloatingParticles count={30} color="bg-purple-500/10" />
      </div>
      
      {/* Gradient orbs */}
      <motion.div 
        className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]"
        animate={{ 
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]"
        animate={{ 
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="container mx-auto px-4 pt-32 pb-20 relative z-10"
        style={{ y, opacity }}
      >
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/10 mb-8 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
            </motion.div>
            <span className="text-sm text-purple-300">Generate millions of records instantly</span>
            <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-full">New</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-8 leading-[1.1] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="block">Generate</span>
            <span className="block text-gradient-animated">
              <WordRotator 
                words={['Realistic', 'Production-Ready', 'Scalable', 'Custom']} 
                interval={3000}
              />
            </span>
            <span className="block">Synthetic Data</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Create realistic, high-quality datasets for testing, development, and analytics.
            <span className="text-white"> Zero setup, instant results.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link href="/dashboard">
              <motion.div
                whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(139, 92, 246, 0.4)" }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="gradient" size="xl" className="w-full sm:w-auto text-lg px-8 relative overflow-hidden group">
                  <span className="relative z-10 flex items-center">
                    Start Generating Free
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </motion.div>
            </Link>
            <Link href="#demo">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="outline" size="xl" className="w-full sm:w-auto text-lg px-8 group">
                  <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>10K records free</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Setup in 30 seconds</span>
            </div>
          </motion.div>
        </div>

        {/* Live Preview Widget */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <LivePreviewWidget />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <MouseScrollIndicator size="sm" />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ============================================
// LIVE PREVIEW WIDGET
// ============================================

function LivePreviewWidget() {
  const [activeTab, setActiveTab] = useState('json')
  const [isGenerating, setIsGenerating] = useState(false)
  const [data, setData] = useState(sampleData)
  
  const regenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setData([...sampleData].sort(() => Math.random() - 0.5))
      setIsGenerating(false)
    }, 500)
  }

  return (
    <TiltCard maxTilt={5} className="perspective-1000">
      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-mono">preview.json</span>
          </div>
          <motion.button
            onClick={regenerate}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
          </motion.button>
        </div>
        
        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-white/10 bg-white/[0.01]">
          {['json', 'table', 'sql'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                activeTab === tab 
                  ? "bg-purple-500/20 text-purple-400" 
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="p-6 min-h-[300px]">
          <AnimatePresence mode="wait">
            {activeTab === 'json' && (
              <motion.pre
                key="json"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm font-mono overflow-x-auto"
              >
                <code>
                  <span className="text-gray-500">{'{'}</span>
                  {'\n'}
                  <span className="text-purple-400">  &quot;users&quot;</span>
                  <span className="text-gray-500">: [</span>
                  {'\n'}
                  {data.map((user, i) => (
                    <span key={i}>
                      <span className="text-gray-500">    {'{'}</span>
                      {'\n'}
                      <span className="text-blue-400">      &quot;id&quot;</span>
                      <span className="text-gray-500">: </span>
                      <span className="text-yellow-400">&quot;{user.id}&quot;</span>
                      <span className="text-gray-500">,</span>
                      {'\n'}
                      <span className="text-blue-400">      &quot;name&quot;</span>
                      <span className="text-gray-500">: </span>
                      <span className="text-green-400">&quot;{user.name}&quot;</span>
                      <span className="text-gray-500">,</span>
                      {'\n'}
                      <span className="text-blue-400">      &quot;email&quot;</span>
                      <span className="text-gray-500">: </span>
                      <span className="text-green-400">&quot;{user.email}&quot;</span>
                      {'\n'}
                      <span className="text-gray-500">    {'}'}</span>
                      {i < data.length - 1 && <span className="text-gray-500">,</span>}
                      {'\n'}
                    </span>
                  ))}
                  <span className="text-gray-500">  ]</span>
                  {'\n'}
                  <span className="text-gray-500">{'}'}</span>
                </code>
              </motion.pre>
            )}
            {activeTab === 'table' && (
              <motion.div
                key="table"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="overflow-x-auto"
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 px-3 text-gray-400">ID</th>
                      <th className="text-left py-2 px-3 text-gray-400">Name</th>
                      <th className="text-left py-2 px-3 text-gray-400">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((user, i) => (
                      <motion.tr 
                        key={user.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="border-b border-white/5 hover:bg-white/[0.02]"
                      >
                        <td className="py-2 px-3 font-mono text-purple-400">{user.id}</td>
                        <td className="py-2 px-3">{user.name}</td>
                        <td className="py-2 px-3 text-gray-400">{user.email}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
            {activeTab === 'sql' && (
              <motion.pre
                key="sql"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm font-mono overflow-x-auto"
              >
                <code>
                  <span className="text-purple-400">INSERT INTO</span>
                  <span className="text-white"> users </span>
                  <span className="text-gray-500">(</span>
                  <span className="text-blue-400">id, name, email</span>
                  <span className="text-gray-500">)</span>
                  {'\n'}
                  <span className="text-purple-400">VALUES</span>
                  {'\n'}
                  {data.map((user, i) => (
                    <span key={i}>
                      <span className="text-gray-500">  (</span>
                      <span className="text-yellow-400">&apos;{user.id}&apos;</span>
                      <span className="text-gray-500">, </span>
                      <span className="text-green-400">&apos;{user.name}&apos;</span>
                      <span className="text-gray-500">, </span>
                      <span className="text-green-400">&apos;{user.email}&apos;</span>
                      <span className="text-gray-500">)</span>
                      {i < data.length - 1 ? <span className="text-gray-500">,</span> : <span className="text-gray-500">;</span>}
                      {'\n'}
                    </span>
                  ))}
                </code>
              </motion.pre>
            )}
          </AnimatePresence>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-white/[0.01] flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{data.length} records</span>
            <span>•</span>
            <span>JSON format</span>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="text-xs text-purple-400 hover:text-purple-300"
          >
            Generate More →
          </motion.button>
        </div>
      </div>
    </TiltCard>
  )
}

const sampleData = [
  { id: 'usr_7K9mP2xQ', name: 'Sarah Johnson', email: 'sarah.j@example.com' },
  { id: 'usr_4L8nR3yW', name: 'Michael Chen', email: 'm.chen@example.com' },
  { id: 'usr_9T2kJ5zV', name: 'Emma Wilson', email: 'emma.w@example.com' },
]

// ============================================
// FEATURES SECTION
// ============================================

function FeaturesSection() {
  return (
    <section id="features" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <FadeInWhenVisible>
          <div className="text-center mb-20">
            <motion.span 
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-6"
            >
              Features
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Everything you need to
              <br />
              <span className="text-gradient">generate data</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful features designed for developers and data teams
            </p>
          </div>
        </FadeInWhenVisible>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FadeInWhenVisible key={feature.title} delay={index * 0.1}>
              <SpotlightCard className="h-full p-6 group">
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="h-full"
                >
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all group-hover:scale-110",
                    `bg-gradient-to-br ${feature.gradient}`
                  )}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              </SpotlightCard>
            </FadeInWhenVisible>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// STATS SECTION
// ============================================

function StatsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-indigo-500/10" />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <FadeInWhenVisible key={stat.label} delay={index * 0.1}>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-5xl md:text-6xl font-heading font-bold text-gradient mb-2">
                  <CountingText 
                    to={stat.value} 
                    suffix={stat.suffix} 
                    duration={2}
                  />
                </div>
                <div className="text-gray-400 text-lg">{stat.label}</div>
              </motion.div>
            </FadeInWhenVisible>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// HOW IT WORKS
// ============================================

function HowItWorksSection() {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-4">
        <FadeInWhenVisible>
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
              How it works
            </span>
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Three steps to
              <br />
              <span className="text-gradient">production data</span>
            </h2>
          </div>
        </FadeInWhenVisible>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <FadeInWhenVisible key={step.title} delay={index * 0.2}>
              <div className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent -translate-x-1/2" />
                )}
                
                <motion.div
                  whileHover={{ y: -5 }}
                  className="text-center"
                >
                  <motion.div 
                    className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/20 flex items-center justify-center mx-auto mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <span className="text-4xl font-heading font-bold text-gradient">{index + 1}</span>
                  </motion.div>
                  <h3 className="text-xl font-heading font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </motion.div>
              </div>
            </FadeInWhenVisible>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// CTA SECTION
// ============================================

function CTASection() {
  return (
    <section className="py-32">
      <div className="container mx-auto px-4">
        <FadeInWhenVisible>
          <motion.div
            className="relative rounded-3xl overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-blue-500/20" />
            <MeshGradient className="opacity-50" />
            <NoiseOverlay opacity={0.03} />
            
            <div className="relative z-10 px-8 py-20 md:px-16 md:py-28 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
                  Ready to start generating?
                </h2>
                <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                  Join thousands of developers using SynthData to build better applications
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard">
                    <motion.div
                      whileHover={{ scale: 1.02, boxShadow: "0 0 50px rgba(139, 92, 246, 0.5)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="gradient" size="xl" className="text-lg px-10">
                        Get Started for Free
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="#contact">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="outline" size="xl" className="text-lg px-10">
                        Talk to Sales
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </FadeInWhenVisible>
      </div>
    </section>
  )
}

// ============================================
// FOOTER
// ============================================

function Footer() {
  return (
    <footer className="border-t border-white/10 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Database className="w-8 h-8 text-purple-500" />
              <span className="text-xl font-heading font-bold">SynthData</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Generate production-ready synthetic data in seconds. Built for developers, by developers.
            </p>
            <div className="flex items-center gap-4">
              {['twitter', 'github', 'discord'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Globe className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
          
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm group inline-flex items-center"
                    >
                      {link.name}
                      <ArrowRight className="w-3 h-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2026 SynthData. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      <AnimatedHeader />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  )
}

// ============================================
// DATA
// ============================================

const features = [
  {
    icon: Database,
    title: "Multiple Data Types",
    description: "Generate users, e-commerce transactions, companies, financial data, and more with realistic relationships.",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    icon: Download,
    title: "Multiple Formats",
    description: "Export to JSON, CSV, SQL, Parquet, and XML formats. Perfect for any use case or database.",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate millions of records in seconds with our optimized parallel processing engine.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "All data is generated, never collected. No PII concerns, perfect for compliance.",
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description: "REST API, Python SDK, CLI tools, and webhooks for seamless integration into any workflow.",
    gradient: "from-teal-500 to-green-500",
  },
  {
    icon: BarChart,
    title: "Smart Patterns",
    description: "Data follows realistic patterns and distributions. Dates, trends, and correlations that make sense.",
    gradient: "from-green-500 to-emerald-500",
  },
]

const stats = [
  { value: 50, suffix: 'M+', label: 'Records Generated' },
  { value: 10, suffix: 'K+', label: 'Developers' },
  { value: 99.9, suffix: '%', label: 'Uptime' },
  { value: 15, suffix: 'ms', label: 'Avg Response' },
]

const steps = [
  {
    title: "Choose Your Schema",
    description: "Select from pre-built templates or define custom fields with types and constraints.",
  },
  {
    title: "Configure Options",
    description: "Set record count, output format, locale, and any advanced generation options.",
  },
  {
    title: "Download & Use",
    description: "Get your data instantly via download, API, or direct database insertion.",
  },
]

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Changelog", href: "#" },
      { name: "Roadmap", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Documentation", href: "#" },
      { name: "API Reference", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Tutorials", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "#" },
      { name: "Partners", href: "#" },
    ],
  },
]
