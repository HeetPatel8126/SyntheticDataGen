'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, MouseEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

// ============================================
// GLOWING CARD (CURSOR-FOLLOWING GLOW)
// ============================================

interface GlowingCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  glowOpacity?: number
  borderRadius?: string
}

export function GlowingCard({
  children,
  className = '',
  glowColor = 'rgba(139, 92, 246, 0.4)',
  glowOpacity = 0.4,
  borderRadius = '1rem',
}: GlowingCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        'relative overflow-hidden',
        className
      )}
      style={{ borderRadius }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) =>
              `radial-gradient(400px circle at ${x}px ${y}px, ${glowColor}, transparent 40%)`
          ),
          borderRadius,
        }}
      />
      {children}
    </motion.div>
  )
}

// ============================================
// TILT CARD (3D HOVER EFFECT)
// ============================================

interface TiltCardProps {
  children: ReactNode
  className?: string
  maxTilt?: number
  scale?: number
  perspective?: number
  transitionDuration?: number
}

export function TiltCard({
  children,
  className = '',
  maxTilt = 10,
  scale = 1.02,
  perspective = 1000,
  transitionDuration = 0.3,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { stiffness: 400, damping: 30 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const rotateX = useTransform(ySpring, [-0.5, 0.5], [maxTilt, -maxTilt])
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-maxTilt, maxTilt])

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = (e.clientX - centerX) / rect.width
    const mouseY = (e.clientY - centerY) / rect.height
    x.set(mouseX)
    y.set(mouseY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective,
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale }}
        transition={{ duration: transitionDuration }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

// ============================================
// GLOW CARD WITH BORDER
// ============================================

interface GlowBorderCardProps {
  children: ReactNode
  className?: string
  containerClassName?: string
  gradientColors?: string[]
  animate?: boolean
}

export function GlowBorderCard({
  children,
  className = '',
  containerClassName = '',
  gradientColors = ['#8B5CF6', '#6366F1', '#3B82F6', '#8B5CF6'],
  animate = true,
}: GlowBorderCardProps) {
  return (
    <div className={cn('relative p-[1px] rounded-xl overflow-hidden', containerClassName)}>
      <div
        className={cn(
          'absolute inset-0 rounded-xl',
          animate && 'animate-spin-slow'
        )}
        style={{
          background: `conic-gradient(from 0deg, ${gradientColors.join(', ')})`,
        }}
      />
      <div className={cn('relative bg-background rounded-xl', className)}>
        {children}
      </div>
    </div>
  )
}

// ============================================
// HOVER SPOTLIGHT CARD
// ============================================

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  spotlightColor?: string
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(139, 92, 246, 0.15)',
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={cn(
        'group relative rounded-xl border border-white/10 bg-card overflow-hidden',
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) =>
              `radial-gradient(600px circle at ${x}px ${y}px, ${spotlightColor}, transparent 40%)`
          ),
        }}
      />
      {children}
    </motion.div>
  )
}
