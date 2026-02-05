'use client'

import { motion, useMotionValue, useTransform, useAnimationFrame } from 'framer-motion'
import { useRef, useMemo, ReactNode } from 'react'
import { cn } from '@/lib/utils'

// ============================================
// ANIMATED GRADIENT BACKGROUND
// ============================================

interface AnimatedGradientProps {
  className?: string
  colors?: string[]
  speed?: number
  blur?: number
}

export function AnimatedGradient({
  className = '',
  colors = [
    'rgba(139, 92, 246, 0.3)',
    'rgba(99, 102, 241, 0.3)',
    'rgba(59, 130, 246, 0.3)',
    'rgba(139, 92, 246, 0.3)',
  ],
  speed = 10,
  blur = 100,
}: AnimatedGradientProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useAnimationFrame((t) => {
    x.set(Math.sin(t / 1000 / speed) * 20)
    y.set(Math.cos(t / 1000 / speed) * 20)
  })

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${colors.join(', ')})`,
          x,
          y,
          filter: `blur(${blur}px)`,
        }}
      />
    </div>
  )
}

// ============================================
// MESH GRADIENT
// ============================================

interface MeshGradientProps {
  className?: string
  colors?: string[]
  interactive?: boolean
}

export function MeshGradient({
  className = '',
  colors = ['#8B5CF6', '#6366F1', '#3B82F6', '#EC4899'],
  interactive = true,
}: MeshGradientProps) {
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `
      radial-gradient(
        ellipse at ${Number(x) * 100}% ${Number(y) * 100}%,
        ${colors[0]}40 0%,
        transparent 50%
      ),
      radial-gradient(
        ellipse at ${100 - Number(x) * 100}% ${Number(y) * 100}%,
        ${colors[1]}40 0%,
        transparent 50%
      ),
      radial-gradient(
        ellipse at ${Number(x) * 100}% ${100 - Number(y) * 100}%,
        ${colors[2]}40 0%,
        transparent 50%
      ),
      radial-gradient(
        ellipse at ${100 - Number(x) * 100}% ${100 - Number(y) * 100}%,
        ${colors[3]}40 0%,
        transparent 50%
      )
    `
  )

  return (
    <motion.div
      className={cn('absolute inset-0', className)}
      onMouseMove={handleMouseMove}
      style={{ background }}
    />
  )
}

// ============================================
// AURORA BACKGROUND
// ============================================

interface AuroraBackgroundProps {
  className?: string
  children?: ReactNode
}

export function AuroraBackground({
  className = '',
  children,
}: AuroraBackgroundProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 via-transparent to-transparent animate-aurora-1" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 via-transparent to-transparent animate-aurora-2" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-transparent to-transparent animate-aurora-3" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// ============================================
// NOISE OVERLAY
// ============================================

interface NoiseOverlayProps {
  className?: string
  opacity?: number
}

export function NoiseOverlay({ className = '', opacity = 0.03 }: NoiseOverlayProps) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        opacity,
      }}
    />
  )
}

// ============================================
// GRID PATTERN
// ============================================

interface GridPatternProps {
  className?: string
  size?: number
  color?: string
  opacity?: number
  animate?: boolean
}

export function GridPattern({
  className = '',
  size = 50,
  color = 'rgba(255, 255, 255, 0.03)',
  opacity = 1,
  animate = false,
}: GridPatternProps) {
  return (
    <motion.div
      className={cn('absolute inset-0', className)}
      initial={animate ? { opacity: 0 } : undefined}
      animate={animate ? { opacity } : undefined}
      transition={{ duration: 1 }}
      style={{
        backgroundImage: `
          linear-gradient(${color} 1px, transparent 1px),
          linear-gradient(90deg, ${color} 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
        opacity,
      }}
    />
  )
}

// ============================================
// DOT PATTERN
// ============================================

interface DotPatternProps {
  className?: string
  size?: number
  spacing?: number
  color?: string
  opacity?: number
}

export function DotPattern({
  className = '',
  size = 2,
  spacing = 20,
  color = 'rgba(255, 255, 255, 0.1)',
  opacity = 1,
}: DotPatternProps) {
  return (
    <div
      className={cn('absolute inset-0', className)}
      style={{
        backgroundImage: `radial-gradient(${color} ${size}px, transparent ${size}px)`,
        backgroundSize: `${spacing}px ${spacing}px`,
        opacity,
      }}
    />
  )
}

// ============================================
// SPOTLIGHT
// ============================================

interface SpotlightProps {
  className?: string
  size?: number
}

export function Spotlight({ className = '', size = 400 }: SpotlightProps) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: MouseEvent) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }

  // Add event listener on mount
  useMemo(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <motion.div
      className={cn('pointer-events-none fixed inset-0 z-30', className)}
      style={{
        background: useTransform(
          [mouseX, mouseY],
          ([x, y]) =>
            `radial-gradient(${size}px circle at ${x}px ${y}px, rgba(139, 92, 246, 0.1), transparent 80%)`
        ),
      }}
    />
  )
}
